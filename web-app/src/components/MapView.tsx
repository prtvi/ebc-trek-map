import { MapContainer, TileLayer } from "react-leaflet"
import type { Map } from "leaflet"
import { LatLngBounds } from "leaflet"
import { useEffect, useRef } from "react"
import MapContent from "./map/MapContent"
import type { GeoJsonObject } from "geojson"

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
const TILE_ATTRIBUTION = "© OpenStreetMap contributors"

const MAP_CENTER: [number, number] = [27.9, 86.8]
const MAP_ZOOM = 8

export interface MapViewProps {
  route?: { name: string; geojson: GeoJsonObject | any }
  routes?: { name: string; geojson: GeoJsonObject | any }[]
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

  function extractCoords(geo: GeoJsonObject): [number, number][] {
    const out: [number, number][] = []

    const push = (c: any) => {
      if (!c) return
      if (typeof c[0] === "number" && typeof c[1] === "number") {
        out.push([c[0], c[1]])
        return
      }
      for (const inner of c) push(inner)
    }

    const asAny = geo as any
    if (asAny.type === "FeatureCollection") {
      for (const f of asAny.features ?? []) push(f?.geometry?.coordinates)
    } else if (asAny.type === "Feature") {
      push(asAny.geometry?.coordinates)
    } else {
      push(asAny.coordinates)
    }

    return out
  }

  useEffect(() => {
    const list = routes?.length ? routes : route ? [route] : []
    if (list.length === 0 || !mapRef.current) return

    const allCoords = list.flatMap((r) => extractCoords(r.geojson))
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
