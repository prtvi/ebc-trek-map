const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const turf = require("@turf/turf");

const RAW_DIR = path.join(__dirname, "..", "raw");
const OUTPUT_DIR = path.join(__dirname, "..", "web-app", "src", "data");

const INPUT_OUTPUT_MAP = [
  {
    input: path.join(RAW_DIR, "day wise routes.gpx"),
    output: path.join(OUTPUT_DIR, "dayWiseRoutes.json"),
    label: "day-wise routes",
  },
  {
    input: path.join(RAW_DIR, "EBC via Gokyo full routes.gpx"),
    output: path.join(OUTPUT_DIR, "fullRoutes.json"),
    label: "EBC via Gokyo full routes",
  },
  {
    input: path.join(RAW_DIR, "point to point routes.gpx"),
    output: path.join(OUTPUT_DIR, "pointToPointRoutes.json"),
    label: "point-to-point routes",
  },
];

/**
 * Parse a single GPX file and return { routes, waypoints } in the same shape
 * used by the frontend (GeoJSON, elevation_profile, stats per route).
 */
async function parseGpxToJson(gpxPath) {
  const xml = fs.readFileSync(gpxPath, "utf8");
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xml);
  const gpx = result.gpx;

  /* ---------- Extract Waypoints ---------- */
  const waypoints = (gpx.wpt || []).map((w) => ({
    name: w.name?.[0] || "Unnamed",
    coordinates: [parseFloat(w.$.lon), parseFloat(w.$.lat)],
    elevation: w.ele ? parseFloat(w.ele[0]) : null,
  }));

  /* ---------- Extract Tracks ---------- */
  const routes = (gpx.trk || []).map((trk) => {
    const name = trk.name?.[0] || "Unnamed Route";

    // Support multiple segments: merge all trkpt into one points array
    const segments = trk.trkseg || [];
    const points = segments.flatMap((seg) =>
      (seg.trkpt || []).map((pt) => ({
        lat: parseFloat(pt.$.lat),
        lon: parseFloat(pt.$.lon),
        ele: pt.ele ? parseFloat(pt.ele[0]) : 0,
      }))
    );

    if (points.length === 0) {
      return {
        name,
        geojson: { type: "Feature", properties: { name }, geometry: { type: "LineString", coordinates: [] } },
        elevation_profile: [],
        stats: { distance_km: 0, elevation_gain_m: 0, elevation_loss_m: 0, absolute_elevation_gain_m: 0 },
      };
    }

    /* ---- Compute stats ---- */
    let totalDistance = 0;
    let elevationGain = 0;
    let elevationLoss = 0;
    for (let i = 1; i < points.length; i++) {
      const from = turf.point([points[i - 1].lon, points[i - 1].lat]);
      const to = turf.point([points[i].lon, points[i].lat]);
      totalDistance += turf.distance(from, to, { units: "kilometers" });
      const diff = points[i].ele - points[i - 1].ele;
      if (diff > 0) elevationGain += diff;
      else if (diff < 0) elevationLoss += -diff;
    }

    /* ---- Convert to GeoJSON ---- */
    const geojson = {
      type: "Feature",
      properties: { name },
      geometry: {
        type: "LineString",
        coordinates: points.map((p) => [p.lon, p.lat]),
      },
    };

    return {
      name,
      geojson,
      elevation_profile: points.map((p, i) => ({
        index: i,
        elevation: p.ele,
      })),
      stats: {
        distance_km: Number(totalDistance.toFixed(2)),
        elevation_gain_m: Math.round(elevationGain),
        elevation_loss_m: Math.round(elevationLoss),
        absolute_elevation_gain_m: Math.round(elevationGain - elevationLoss),
      },
    };
  });

  return { routes, waypoints };
}

async function convert() {
  for (const { input, output, label } of INPUT_OUTPUT_MAP) {
    if (!fs.existsSync(input)) {
      console.warn(`⚠️  Skipping ${label}: file not found at ${input}`);
      continue;
    }
    const data = await parseGpxToJson(input);
    fs.writeFileSync(output, JSON.stringify(data, null, 2));
    console.log(`✅ ${path.basename(output)} generated from ${path.basename(input)} (${data.routes.length} routes, ${data.waypoints.length} waypoints)`);
  }
}

convert().catch((err) => {
  console.error(err);
  process.exit(1);
});
