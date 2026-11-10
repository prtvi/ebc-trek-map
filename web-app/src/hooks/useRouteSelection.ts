import { useMemo, useState, useCallback } from 'react';
import {
	allRoutes,
	dayWiseRoutes,
	getRouteNamesForDate,
	type Route,
	type Waypoint,
} from '../utils/routeData';
import { routeMeta } from '../data/routeMeta';
import {
	waypointsOnRoute,
	waypointNamesOrderedAlongRoute,
} from '../utils/waypointsOnRoute';

function getShowQueryParam(): string | null {
	if (typeof window === 'undefined') return null;
	return new URLSearchParams(window.location.search).get('show');
}

function findDayRouteByQ(q: string): {
	name: string;
	date: string;
	q: string;
} | null {
	const entry = Object.entries(routeMeta).find(
		([, meta]) => meta.type === 'day' && meta.q === q,
	);
	if (!entry) return null;
	const [name, meta] = entry;
	if (!meta.date || !meta.q) return null;
	return { name, date: meta.date, q: meta.q };
}

function findDayRouteByDate(date: string): {
	name: string;
	date: string;
	q: string;
} | null {
	const entry = Object.entries(routeMeta).find(
		([, meta]) => meta.type === 'day' && meta.date === date && meta.q,
	);
	if (!entry) return null;
	const [name, meta] = entry;
	if (!meta.date || !meta.q) return null;
	return { name, date: meta.date, q: meta.q };
}

function setShowQueryParam(q: string | null) {
	if (typeof window === 'undefined') return;
	const url = new URL(window.location.href);
	if (q) url.searchParams.set('show', q);
	else url.searchParams.delete('show');
	window.history.replaceState({}, '', url);
}

// Day 10 has two TYPE_DAY routes sharing q=day10; deep links always land on uphill.
const DAY10_Q = 'day10';

function getInitialDaySelection(): {
	routeName: string | null;
	dayDate: string | null;
} {
	const q = getShowQueryParam();
	if (!q) return { routeName: null, dayDate: null };
	const found = findDayRouteByQ(q);
	if (!found) return { routeName: null, dayDate: null };
	// day10: select the uphill segment (first day10 match), not whole-day mode
	if (q === DAY10_Q) {
		return { routeName: found.name, dayDate: null };
	}
	return { routeName: found.name, dayDate: found.date };
}

export function useRouteSelection(waypoints: Waypoint[]) {
	const initialDay = getInitialDaySelection();
	const [selectedRouteName, setSelectedRouteName] = useState(
		initialDay.routeName ?? allRoutes[0].name,
	);
	const [selectedDayDate, setSelectedDayDate] = useState<string | null>(
		initialDay.dayDate,
	);

	const selectedRoute = useMemo(
		() => allRoutes.find(r => r.name === selectedRouteName),
		[selectedRouteName],
	);

	const dayWiseRoutesForSelectedDate = useMemo(() => {
		if (!selectedDayDate) return [];
		const namesForDate = getRouteNamesForDate(selectedDayDate);
		const byName = new Map(dayWiseRoutes.map(r => [r.name, r]));
		return namesForDate
			.map(name => byName.get(name))
			.filter((r): r is Route => r != null);
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
		if (!routeToUse?.geojson?.geometry?.coordinates?.length) return [];
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
		const meta = routeMeta[name];
		if (meta?.type === 'day' && meta.q) {
			setShowQueryParam(meta.q);
		} else {
			setShowQueryParam(null);
		}
	}, []);

	const handleDayDateClick = useCallback((date: string) => {
		const dayRoute = findDayRouteByDate(date);
		setSelectedDayDate(date);
		if (dayRoute) {
			setSelectedRouteName(dayRoute.name);
			setShowQueryParam(dayRoute.q);
		} else {
			setShowQueryParam(null);
		}
	}, []);

	const hasRoute = !!selectedRoute || dayWiseRoutesForSelectedDate.length > 0;

	const routesForDisplay = useMemo((): Route[] => {
		if (selectedDayDate && dayWiseRoutesForSelectedDate.length > 0)
			return dayWiseRoutesForSelectedDate;
		return selectedRoute ? [selectedRoute] : [];
	}, [selectedDayDate, dayWiseRoutesForSelectedDate, selectedRoute]);

	const distanceKm =
		routesForDisplay.length > 0
			? routesForDisplay.reduce(
					(sum, r) => sum + (r.stats?.distance_km ?? 0),
					0,
				)
			: undefined;

	const elevationGainM =
		routesForDisplay.length > 0
			? routesForDisplay.reduce(
					(sum, r) => sum + (r.stats?.elevation_gain_m ?? 0),
					0,
				)
			: undefined;

	const elevationLossM =
		routesForDisplay.length > 0
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

	const mediaEnabled = useMemo(() => {
		if (routesForDisplay.length === 0) return false;
		return routesForDisplay.some(
			r => routeMeta[r.name]?.mediaEnabled === true,
		);
	}, [routesForDisplay]);

	const pictureUrls = useMemo(() => {
		if (!mediaEnabled || routesForDisplay.length === 0) return [];
		const urls: string[] = [];
		const seen = new Set<string>();
		for (const r of routesForDisplay) {
			if (routeMeta[r.name]?.mediaEnabled !== true) continue;
			const list = routeMeta[r.name]?.pictures ?? [];
			for (const src of list) {
				if (!seen.has(src)) {
					seen.add(src);
					urls.push(src);
				}
			}
		}
		return urls;
	}, [routesForDisplay, mediaEnabled]);

	const notesText = useMemo(() => {
		if (routesForDisplay.length === 0) return '';
		const parts = routesForDisplay
			.map(r => routeMeta[r.name]?.notes?.trim())
			.filter(Boolean);
		return parts.join('\n\n');
	}, [routesForDisplay]);

	const elevationProfile =
		selectedDayDate && dayWiseRoutesForSelectedDate.length > 0
			? dayWiseRoutesForSelectedDate[0].elevation_profile
			: (selectedRoute?.elevation_profile ?? []);

	const chartTitle =
		selectedDayDate && dayWiseRoutesForSelectedDate.length > 0
			? dayWiseRoutesForSelectedDate.length === 1
				? dayWiseRoutesForSelectedDate[0].name
				: `${routeMeta[dayWiseRoutesForSelectedDate[0].name]?.day ?? ''} (day-wise)`
			: selectedRoute?.name;

	const chartDate =
		selectedDayDate ??
		(selectedRoute ? routeMeta[selectedRoute.name]?.date : undefined);

	const chartDay =
		selectedDayDate && dayWiseRoutesForSelectedDate.length > 0
			? routeMeta[dayWiseRoutesForSelectedDate[0].name]?.day
			: selectedRoute
				? routeMeta[selectedRoute.name]?.day
				: undefined;

	const chartDistanceKm =
		selectedDayDate && dayWiseRoutesForSelectedDate.length > 0
			? dayWiseRoutesForSelectedDate.reduce(
					(sum, r) => sum + (r.stats?.distance_km ?? 0),
					0,
				)
			: selectedRoute?.stats?.distance_km;

	return {
		selectedRouteName,
		selectedDayDate,
		selectedRoute,
		dayWiseRoutesForSelectedDate,
		waypointNamesOnRoute,
		routeWaypointOrder,
		handleSelectRoute,
		handleDayDateClick,
		routesForDisplay,
		hasRoute,
		distanceKm,
		elevationGainM,
		elevationLossM,
		locationsStr,
		panelDay,
		panelDate,
		mediaEnabled,
		pictureUrls,
		notesText,
		elevationProfile,
		chartTitle,
		chartDate,
		chartDay,
		chartDistanceKm,
	};
}
