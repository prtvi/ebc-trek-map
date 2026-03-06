import { useMemo, useState, useCallback } from 'react';
import fullRoutesData from './data/fullRoutes.json';
import pointToPointData from './data/pointToPointRoutes.json';
import dayWiseData from './data/dayWiseRoutes.json';
import { routeMeta } from './data/routeMeta';
import MapView from './components/MapView';
import Sidebar from './components/SideBar';
import ElevationChart from './components/ElevationChart';
import RightPanel from './components/RightPanel';
import PictureCarousel from './components/PictureCarousel';
import { waypointsOnRoute, waypointNamesOrderedAlongRoute } from './utils/waypointsOnRoute';

// Full routes, point-to-point, and day-wise (for EBC uphill/downhill) merged for lookup.
const fullRoutes = fullRoutesData.routes;
const pointToPointRoutes = pointToPointData.routes;
const pointToPointNames = new Set(pointToPointRoutes.map(r => r.name));
const dayWiseOnlyRoutes = dayWiseData.routes.filter(
	r => !pointToPointNames.has(r.name),
);
const allRoutes = [...fullRoutes, ...pointToPointRoutes, ...dayWiseOnlyRoutes];

function mergeWaypoints(): typeof pointToPointData.waypoints {
	const byName = new Map<string, (typeof pointToPointData.waypoints)[0]>();
	[...pointToPointData.waypoints, ...fullRoutesData.waypoints].forEach(w => {
		if (!byName.has(w.name)) byName.set(w.name, w);
	});
	return Array.from(byName.values());
}

function getRouteNamesForDate(date: string): string[] {
	return Object.entries(routeMeta)
		.filter(([, meta]) => meta.date === date)
		.map(([name]) => name);
}

export default function App() {
	const waypoints = useMemo(mergeWaypoints, []);
	const [selectedRouteName, setSelectedRouteName] = useState(
		allRoutes[0].name,
	);
	const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);
	const [carouselPopupOpen, setCarouselPopupOpen] = useState(false);

	const selectedRoute = allRoutes.find(r => r.name === selectedRouteName);

	const dayWiseRoutesForSelectedDate = useMemo(() => {
		if (!selectedDayDate) return [];
		const namesForDate = getRouteNamesForDate(selectedDayDate);
		const byName = new Map(dayWiseData.routes.map(r => [r.name, r]));
		return namesForDate
			.map(name => byName.get(name))
			.filter((r): r is NonNullable<typeof r> => r != null);
	}, [selectedDayDate]);

	const waypointNamesOnRoute = useMemo(() => {
		const routeToUse =
			selectedDayDate && dayWiseRoutesForSelectedDate.length > 0
				? dayWiseRoutesForSelectedDate[0]
				: selectedRoute;
		if (!routeToUse?.geojson?.geometry?.coordinates?.length)
			return new Set<string>();
		const coords = routeToUse.geojson.geometry.coordinates as
			| [number, number][]
			| [number, number, number][];
		const onRoute = waypointsOnRoute(coords, waypoints);
		return new Set(onRoute.map(w => w.name));
	}, [
		selectedRoute,
		selectedDayDate,
		dayWiseRoutesForSelectedDate,
		waypoints,
	]);

	const routeWaypointOrder = useMemo(() => {
		const routeToUse =
			selectedDayDate && dayWiseRoutesForSelectedDate.length > 0
				? dayWiseRoutesForSelectedDate[0]
				: selectedRoute;
		if (!routeToUse?.geojson?.geometry?.coordinates?.length)
			return [];
		const coords = routeToUse.geojson.geometry.coordinates as
			| [number, number][]
			| [number, number, number][];
		return waypointNamesOrderedAlongRoute(coords, waypoints);
	}, [
		selectedRoute,
		selectedDayDate,
		dayWiseRoutesForSelectedDate,
		waypoints,
	]);

	const handleSelectRoute = useCallback((name: string) => {
		setSelectedRouteName(name);
		setSelectedDayDate(null);
	}, []);

	const handleDayDateClick = useCallback((date: string) => {
		setSelectedDayDate(date);
	}, []);

	const dayRoutesSortedByDate = useMemo(() => {
		return [...pointToPointRoutes].sort((a, b) => {
			const dateA = routeMeta[a.name]?.date;
			const dateB = routeMeta[b.name]?.date;
			if (!dateA && !dateB) return 0;
			if (!dateA) return 1;
			if (!dateB) return -1;
			return dateA.localeCompare(dateB);
		});
	}, []);

	const hasRoute =
		selectedRoute || dayWiseRoutesForSelectedDate.length > 0;
	const routesForDisplay =
		selectedDayDate && dayWiseRoutesForSelectedDate.length > 0
			? dayWiseRoutesForSelectedDate
			: selectedRoute
				? [selectedRoute]
				: [];
	const distanceKm = routesForDisplay.length
		? routesForDisplay.reduce(
				(sum, r) => sum + (r.stats?.distance_km ?? 0),
				0,
			)
		: undefined;
	const elevationGainM = routesForDisplay.length
		? routesForDisplay.reduce(
				(sum, r) => sum + (r.stats?.elevation_gain_m ?? 0),
				0,
			)
		: undefined;
	const elevationLossM = routesForDisplay.length
		? routesForDisplay.reduce(
				(sum, r) => sum + (r.stats?.elevation_loss_m ?? 0),
				0,
			)
		: undefined;
	const locationsStr =
		routesForDisplay.length === 1
			? routesForDisplay[0].name
			: routesForDisplay.length > 1
				? routesForDisplay.map(r => r.name).join(' → ')
				: '';
	const panelDay =
		routesForDisplay.length > 0 && routeMeta[routesForDisplay[0].name]?.day
			? routeMeta[routesForDisplay[0].name].day
			: undefined;
	const panelDate =
		selectedDayDate ??
		(routesForDisplay.length > 0
			? routeMeta[routesForDisplay[0].name]?.date
			: undefined);

	const pictureUrls = useMemo(() => {
		if (routesForDisplay.length === 0) return [];
		const urls: string[] = [];
		const seen = new Set<string>();
		for (const r of routesForDisplay) {
			const list = routeMeta[r.name]?.pictures ?? [];
			for (const src of list) {
				if (!seen.has(src)) {
					seen.add(src);
					urls.push(src);
				}
			}
		}
		return urls;
	}, [routesForDisplay]);

	const notesText = useMemo(() => {
		if (routesForDisplay.length === 0) return '';
		const parts = routesForDisplay
			.map((r) => routeMeta[r.name]?.notes?.trim())
			.filter(Boolean);
		return parts.join('\n\n');
	}, [routesForDisplay]);

	return (
		<div className="app-layout">
			<Sidebar
				fullRoutes={fullRoutes}
				dayRoutes={dayRoutesSortedByDate}
				routeMeta={routeMeta}
				selected={selectedRouteName}
				selectedDayDate={selectedDayDate}
				onSelect={handleSelectRoute}
				onDayDateClick={handleDayDateClick}
			/>

			<div className="app-main">
				<div className="app-map">
					<MapView
						route={selectedDayDate ? undefined : selectedRoute}
						routes={
							selectedDayDate
								? dayWiseRoutesForSelectedDate
								: undefined
						}
						waypoints={waypoints}
						waypointNamesToShow={waypointNamesOnRoute}
						routeWaypointOrder={routeWaypointOrder}
					/>
				</div>

				<div className="app-pictures" aria-label="Pictures">
					<PictureCarousel pictures={pictureUrls} />
				</div>

				<div className="app-chart">
					{hasRoute && (
						<button
							type="button"
							className="app-chart-pictures-btn"
							onClick={() => setCarouselPopupOpen(true)}
							aria-label="View pictures"
							title="View pictures"
						>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
								<circle cx="8.5" cy="8.5" r="1.5" />
								<polyline points="21 15 16 10 5 21" />
							</svg>
						</button>
					)}
					{hasRoute && (
						<ElevationChart
							data={
								selectedDayDate &&
								dayWiseRoutesForSelectedDate.length > 0
									? dayWiseRoutesForSelectedDate[0]
											.elevation_profile
									: (selectedRoute?.elevation_profile ?? [])
							}
							title={
								selectedDayDate &&
								dayWiseRoutesForSelectedDate.length > 0
									? dayWiseRoutesForSelectedDate.length === 1
										? dayWiseRoutesForSelectedDate[0].name
										: `${routeMeta[dayWiseRoutesForSelectedDate[0].name]?.day ?? ''} (day-wise)`
									: selectedRoute?.name
							}
							date={
								selectedDayDate ??
								(selectedRoute
									? routeMeta[selectedRoute.name]?.date
									: undefined)
							}
							day={
								selectedDayDate &&
								dayWiseRoutesForSelectedDate.length > 0
									? routeMeta[
											dayWiseRoutesForSelectedDate[0]
												.name
										]?.day
									: selectedRoute
										? routeMeta[selectedRoute.name]?.day
										: undefined
							}
							distanceKm={
								selectedDayDate &&
								dayWiseRoutesForSelectedDate.length > 0
									? dayWiseRoutesForSelectedDate.reduce(
											(sum, r) =>
												sum + (r.stats?.distance_km ?? 0),
											0,
										)
									: selectedRoute?.stats?.distance_km
							}
						/>
					)}
				</div>

				<div className="app-notes-wrap">
					<RightPanel
						day={panelDay}
						date={panelDate}
						locations={locationsStr}
						distanceKm={distanceKm}
						elevationGainM={elevationGainM}
						elevationLossM={elevationLossM}
						notes={notesText}
					/>
				</div>

				{carouselPopupOpen && (
					<div
						className="carousel-popup-backdrop"
						onClick={() => setCarouselPopupOpen(false)}
						aria-modal="true"
						role="dialog"
						aria-label="Picture carousel"
					>
						<div
							className="carousel-popup"
							onClick={e => e.stopPropagation()}
						>
							<button
								type="button"
								className="carousel-popup-close"
								onClick={() => setCarouselPopupOpen(false)}
								aria-label="Close"
							>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</button>
							<div className="carousel-popup-content">
								<PictureCarousel pictures={pictureUrls} />
							</div>
						</div>
					</div>
				)} 
			</div>
		</div>
	);
}
