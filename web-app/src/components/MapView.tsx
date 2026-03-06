import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Tooltip, useMap, useMapEvents } from "react-leaflet"
import L, { LatLngBounds } from "leaflet"
import { useEffect, useRef, useState } from "react"

interface Props {
  route?: any
  routes?: any[]
  waypoints: any[]
  waypointNamesToShow?: Set<string>
  routeWaypointOrder?: string[]
}

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const TILE_ATTRIBUTION = "© OpenStreetMap contributors"

const PLACE_LABEL_MIN_ZOOM = 11

const PIN_SIZE = 24
const PIN_HEIGHT_FACTOR = 1.6
// Our SVG path tip sits slightly above the viewBox bottom (y≈22 in a 24px box).
const PIN_TIP_Y_FACTOR = 22 / 24

type PinState = "start" | "end" | "onRoute" | "offRoute"

function createPinIcon(state: PinState): L.DivIcon {
  const width = PIN_SIZE
  const height = Math.round(width * PIN_HEIGHT_FACTOR)
  const colors: Record<PinState, string> = {
    start: "#22c55e",
    end: "#dc2626",
    onRoute: "#2563eb",
    offRoute: "#60a5fa",
  }
  const color = colors[state]
  const anchorY = Math.round(height * PIN_TIP_Y_FACTOR)
  return L.divIcon({
    className: "map-pin-icon",
    html: `
      <svg
        width="${width}"
        height="${height}"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style="display:block;filter: drop-shadow(0 1px 2px rgba(0,0,0,0.35));"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"
          fill="${color}"
          stroke="white"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <circle cx="12" cy="9.5" r="2.6" fill="rgba(255,255,255,0.9)" />
      </svg>
    `.trim(),
    iconSize: [width, height],
    iconAnchor: [width / 2, anchorY],
  })
}

const pinIcons: Record<PinState, L.DivIcon> = {
  start: createPinIcon("start"),
  end: createPinIcon("end"),
  onRoute: createPinIcon("onRoute"),
  offRoute: createPinIcon("offRoute"),
}

function getPinState(
  waypointName: string,
  routeWaypointOrder: string[] | undefined
): PinState {
  if (!routeWaypointOrder?.length) return "offRoute"
  const index = routeWaypointOrder.indexOf(waypointName)
  if (index < 0) return "offRoute"
  if (index === 0) return "start"
  if (index === routeWaypointOrder.length - 1) return "end"
  return "onRoute"
}

function MapContent({ route, routes, waypoints, waypointNamesToShow, routeWaypointOrder }: Props) {
  const map = useMap()
  const [zoom, setZoom] = useState(map.getZoom())
  const nameVisible = waypointNamesToShow ?? new Set(waypoints.map((w) => w.name))
  const routesToShow = routes?.length ? routes : route ? [route] : []

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  })

  const showPlaceLabels = zoom >= PLACE_LABEL_MIN_ZOOM

  return (
    <>
      {routesToShow.map((r) => (
        <GeoJSON
          key={r.name}
          data={r.geojson}
          style={{
            color: "#2563eb",
            weight: 4
          }}
        />
      ))}

      {waypoints.map((wp) => {
        const pinState = getPinState(wp.name, routeWaypointOrder)
        const height = Math.round(PIN_SIZE * PIN_HEIGHT_FACTOR)
        return (
          <Marker
            key={wp.name}
            position={[wp.coordinates[1], wp.coordinates[0]]}
            icon={pinIcons[pinState]}
          >
            {showPlaceLabels && nameVisible.has(wp.name) && (
              <Tooltip
                permanent
                direction="top"
                offset={[0, -Math.round(height * 0.85)]}
                className="map-waypoint-label"
              >
                {wp.name}
              </Tooltip>
            )}
            <Popup>{wp.name}</Popup>
          </Marker>
        )
      })}
    </>
  )
}

export default function MapView({ route, routes, waypoints, waypointNamesToShow, routeWaypointOrder }: Props) {
  const mapRef = useRef<any>(null)

  useEffect(() => {
    const list = routes?.length ? routes : route ? [route] : []
    if (list.length === 0 || !mapRef.current) return

    const allCoords = list.flatMap(
      (r) => r.geojson?.geometry?.coordinates ?? []
    ) as [number, number][]
    if (allCoords.length === 0) return

    const bounds = new LatLngBounds(
      allCoords.map((c) => [c[1], c[0]])
    )
    mapRef.current.fitBounds(bounds, { padding: [40, 40] })
  }, [route, routes])

  return (
    <div className="map-view-wrapper">
      <MapContainer
        center={[27.9, 86.8]}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} />
        <MapContent
          route={route}
          routes={routes}
          waypoints={waypoints}
          waypointNamesToShow={waypointNamesToShow}
          routeWaypointOrder={routeWaypointOrder}
        />
      </MapContainer>
    </div>
  )
}