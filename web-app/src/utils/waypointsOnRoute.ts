/**
 * Haversine distance in km between two [lon, lat] points.
 */
function haversineKm(a: [number, number], b: [number, number]): number {
	const R = 6371
	const [lon1, lat1] = a
	const [lon2, lat2] = b
	const dLat = ((lat2 - lat1) * Math.PI) / 180
	const dLon = ((lon2 - lon1) * Math.PI) / 180
	const x =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2)
	const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
	return R * c
}

/** Max distance (km) from route line for a waypoint to count as "on route". */
const MAX_DISTANCE_KM = 0.5

export interface Waypoint {
	name: string
	coordinates: [number, number] | number[]
}

/**
 * Returns waypoints within MAX_DISTANCE_KM of any point on the route.
 * Route coords are [lon, lat] or [lon, lat, alt].
 */
export function waypointsOnRoute(
	routeCoords: [number, number][] | [number, number, number][],
	waypoints: Waypoint[],
): Waypoint[] {
	if (!routeCoords.length) return []
	return waypoints.filter((wp) => {
		const wpPt: [number, number] =
			wp.coordinates.length >= 2
				? [wp.coordinates[0], wp.coordinates[1]]
				: [0, 0]
		let minDist = Infinity
		for (const pt of routeCoords) {
			const p: [number, number] = [pt[0], pt[1]]
			const d = haversineKm(wpPt, p)
			if (d < minDist) minDist = d
		}
		return minDist <= MAX_DISTANCE_KM
	})
}

/**
 * Returns waypoint names on the route in order along the route (first = start, last = end).
 * Used to style start (green), end (red), and middle (blue) pins.
 */
export function waypointNamesOrderedAlongRoute(
	routeCoords: [number, number][] | [number, number, number][],
	waypoints: Waypoint[],
): string[] {
	if (!routeCoords.length) return []
	const onRoute = waypointsOnRoute(routeCoords, waypoints)
	if (!onRoute.length) return []
	// For each waypoint, find the index of the closest route point (as position along route).
	const withIndex: { name: string; index: number }[] = onRoute.map((wp) => {
		const wpPt: [number, number] =
			wp.coordinates.length >= 2
				? [wp.coordinates[0], wp.coordinates[1]]
				: [0, 0]
		let minDist = Infinity
		let bestIndex = 0
		routeCoords.forEach((pt, i) => {
			const p: [number, number] = [pt[0], pt[1]]
			const d = haversineKm(wpPt, p)
			if (d < minDist) {
				minDist = d
				bestIndex = i
			}
		})
		return { name: wp.name, index: bestIndex }
	})
	withIndex.sort((a, b) => a.index - b.index)
	return withIndex.map((w) => w.name)
}
