import { MapContainer, TileLayer } from "react-leaflet"
import type { Map } from "leaflet"
import { LatLngBounds } from "leaflet"
import { useEffect, useRef } from "react"
import MapContent from "./map/MapContent"

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const TILE_ATTRIBUTION = "© OpenStreetMap contributors"

const MAP_CENTER: [number, number] = [27.9, 86.8]
const MAP_ZOOM = 8

export interface MapViewProps {
  route?: { name: string; geojson: unknown }
  routes?: { name: string; geojson: unknown }[]
  waypoints: { name: string; coordinates: number[] }[]
  waypointNamesToShow?: Set<string>
  routeWaypointOrder?: string[]
}

export default function MapView({
  route,
  routes,
  waypoints,
  waypointNamesToShow,
  routeWaypointOrder,
}: MapViewProps) {
  const mapRef = useRef<Map | null>(null)

  useEffect(() => {
    const list = routes?.length ? routes : route ? [route] : []
    if (list.length === 0 || !mapRef.current) return

    const allCoords = list.flatMap(
      (r) => (r.geojson as { geometry?: { coordinates?: unknown[] } })?.geometry?.coordinates ?? []
    ) as [number, number][]
    if (allCoords.length === 0) return

    const bounds = new LatLngBounds(allCoords.map((c) => [c[1], c[0]]))
    mapRef.current.fitBounds(bounds, { padding: [40, 40] })
  }, [route, routes])

  return (
    <div className="map-view-wrapper">
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
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
