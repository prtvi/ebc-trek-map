import {
  GeoJSON,
  Marker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet"
import { useState } from "react"
import { getPinState, pinIcons, PIN_TOOLTIP_OFFSET_HEIGHT } from "./pinIcons"

const PLACE_LABEL_MIN_ZOOM = 11

export interface MapContentProps {
  route?: { name: string; geojson: unknown }
  routes?: { name: string; geojson: unknown }[]
  waypoints: { name: string; coordinates: number[] }[]
  waypointNamesToShow?: Set<string>
  routeWaypointOrder?: string[]
}

export default function MapContent({
  route,
  routes,
  waypoints,
  waypointNamesToShow,
  routeWaypointOrder,
}: MapContentProps) {
  const map = useMap()
  const [zoom, setZoom] = useState(map.getZoom())
  const nameVisible =
    waypointNamesToShow ?? new Set(waypoints.map((w) => w.name))
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
          style={{ color: "#2563eb", weight: 4 }}
        />
      ))}

      {waypoints.map((wp) => {
        const pinState = getPinState(wp.name, routeWaypointOrder)
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
                offset={[0, -PIN_TOOLTIP_OFFSET_HEIGHT]}
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
