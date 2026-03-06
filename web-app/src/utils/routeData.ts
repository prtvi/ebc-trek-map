import fullRoutesData from '../data/fullRoutes.json'
import pointToPointData from '../data/pointToPointRoutes.json'
import dayWiseData from '../data/dayWiseRoutes.json'
import { routeMeta } from '../data/routeMeta'

export type Waypoint = { name: string; coordinates: number[] }
export type Route = (typeof fullRoutesData.routes)[0]

export const fullRoutes = fullRoutesData.routes
export const pointToPointRoutes = pointToPointData.routes

const pointToPointNames = new Set(pointToPointRoutes.map((r) => r.name))
export const dayWiseOnlyRoutes = dayWiseData.routes.filter(
  (r) => !pointToPointNames.has(r.name)
)

export const allRoutes: Route[] = [
  ...fullRoutes,
  ...pointToPointRoutes,
  ...dayWiseOnlyRoutes,
]

export function mergeWaypoints(): Waypoint[] {
  const byName = new Map<string, Waypoint>()
  ;[...pointToPointData.waypoints, ...fullRoutesData.waypoints].forEach(
    (w) => {
      if (!byName.has(w.name)) byName.set(w.name, w)
    }
  )
  return Array.from(byName.values())
}

export function getRouteNamesForDate(date: string): string[] {
  return Object.entries(routeMeta)
    .filter(([, meta]) => meta.date === date)
    .map(([name]) => name)
}

export const dayWiseRoutes = dayWiseData.routes

export const dayRoutesSortedByDate = [...pointToPointRoutes].sort((a, b) => {
  const dateA = routeMeta[a.name]?.date
  const dateB = routeMeta[b.name]?.date
  if (!dateA && !dateB) return 0
  if (!dateA) return 1
  if (!dateB) return -1
  return dateA.localeCompare(dateB)
})
