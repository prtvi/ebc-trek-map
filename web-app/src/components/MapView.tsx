import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Tooltip, useMap, useMapEvents } from "react-leaflet"
import { LatLngBounds } from "leaflet"
import { useEffect, useRef, useState } from "react"

interface Props {
  route?: any
  routes?: any[]
  waypoints: any[]
  waypointNamesToShow?: Set<string>
}

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const TILE_ATTRIBUTION = "© OpenStreetMap contributors"

const PLACE_LABEL_MIN_ZOOM = 11

function MapContent({ route, routes, waypoints, waypointNamesToShow }: Props) {
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

      {waypoints.map((wp) => (
        <Marker
          key={wp.name}
          position={[wp.coordinates[1], wp.coordinates[0]]}
        >
          {showPlaceLabels && nameVisible.has(wp.name) && (
            <Tooltip
              permanent
              direction="top"
              offset={[0, -12]}
              className="map-waypoint-label"
            >
              {wp.name}
            </Tooltip>
          )}
          <Popup>{wp.name}</Popup>
        </Marker>
      ))}
    </>
  )
}

export default function MapView({ route, routes, waypoints, waypointNamesToShow }: Props) {
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
        <MapContent route={route} routes={routes} waypoints={waypoints} waypointNamesToShow={waypointNamesToShow} />
      </MapContainer>
    </div>
  )
}