import { useEffect, useRef, useState } from 'react';

type MobileMediaView = 'map' | 'gallery'

interface Props {
	fullRoutes: any[];
	dayRoutes: any[];
	routeMeta: Record<
		string,
		{
			date: string;
			day?: string;
			type?: 'full' | 'day' | 'p2p';
			q?: string;
		}
	>;
	selected: string;
	selectedDayDate: string | null;
	onSelect: (name: string) => void;
	onDayDateClick: (date: string) => void;
	mobileMediaView: MobileMediaView;
	onMobileMediaViewChange: (view: MobileMediaView) => void;
	mediaEnabled?: boolean;
}

function HamburgerIcon({ open }: { open: boolean }) {
	return (
		<span
			className={`sidebar-hamburger-icon${open ? ' is-open' : ''}`}
			aria-hidden
		>
			<span className="sidebar-hamburger-icon-bar" />
			<span className="sidebar-hamburger-icon-bar" />
			<span className="sidebar-hamburger-icon-bar" />
		</span>
	);
}

function formatDate(iso: string) {
	const d = new Date(iso);
	return d.toLocaleDateString('en-IN', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}

/** Prefer TYPE_DAY meta name for the date; else first→last of the segment chain. */
function getFullDayRouteLabel(
	dateStr: string,
	routes: { name: string }[],
	meta: Props['routeMeta'],
	preferredName?: string,
): string {
	if (preferredName && meta[preferredName]?.type === 'day') {
		return preferredName;
	}
	const dayEntry = Object.entries(meta).find(
		([, m]) => m.date === dateStr && m.type === 'day' && m.q,
	);
	if (dayEntry) return dayEntry[0];
	if (routes.length === 0) return '';
	if (routes.length === 1) return routes[0].name;
	const start = routes[0].name.split(' - ')[0]?.trim() ?? '';
	const endParts = routes[routes.length - 1].name.split(' - ');
	const end = endParts[endParts.length - 1]?.trim() ?? '';
	return start && end ? `${start} - ${end}` : routes[0].name;
}

const DATE_GROUP_COLORS = [
	'#7ec8e3',
	'#3dcf8e',
	'#d4a84b',
	'#9ad0e8',
	'#5fe0a0',
	'#e0bf6a',
	'#6bb8d4',
	'#8aefb8',
];

const TITLE = 'Prithvi & Koushik\'s EBC Trek'
const EBC_REACH_DATE = '2026-02-23';
const EBC_UPHILL_ROUTE = 'Lobuche - Everest Base Camp Monument';
const EBC_DOWNHILL_ROUTE = 'Everest Base Camp Monument - Lobuche';

export default function Sidebar({
	fullRoutes,
	dayRoutes,
	routeMeta,
	selected,
	selectedDayDate,
	onSelect,
	onDayDateClick,
	mobileMediaView,
	onMobileMediaViewChange,
	mediaEnabled = false,
}: Props) {
	const [menuOpen, setMenuOpen] = useState(false);
	const routesListRef = useRef<HTMLDivElement>(null);

	const handleSelect = (name: string) => {
		onSelect(name);
		setMenuOpen(false);
	};

	const handleDayDateClick = (dateStr: string) => {
		onDayDateClick(dateStr);
		setMenuOpen(false);
	};

	// Keep the active day/route visible when the drawer opens or selection
	// comes from ?show=dayX on load.
	useEffect(() => {
		const isMobile =
			typeof window !== 'undefined' &&
			window.matchMedia('(max-width: 768px)').matches;
		if (isMobile && !menuOpen) return;

		const root = routesListRef.current;
		if (!root) return;

		const selectedEl = root.querySelector<HTMLElement>(
			'[data-sidebar-selected="true"]',
		);
		if (!selectedEl) return;

		// Wait for drawer slide-in so layout/overflow are ready
		const delayMs = isMobile ? 320 : 0;
		const timer = window.setTimeout(() => {
			selectedEl.scrollIntoView({
				block: 'center',
				behavior: isMobile ? 'smooth' : 'instant',
			});
		}, delayMs);
		return () => window.clearTimeout(timer);
	}, [menuOpen, selected, selectedDayDate]);

	const orderedDates: string[] = [];
	const dateToGroupIndex: Record<string, number> = {};
	const dayGroups: { dateStr: string; routes: typeof dayRoutes }[] = [];
	dayRoutes.forEach(route => {
		const dateStr = routeMeta[route.name]?.date;
		if (dateStr && dateToGroupIndex[dateStr] === undefined) {
			dateToGroupIndex[dateStr] = orderedDates.length;
			orderedDates.push(dateStr);
		}
		if (dateStr) {
			const group = dayGroups.find(g => g.dateStr === dateStr);
			if (group) group.routes.push(route);
			else dayGroups.push({ dateStr, routes: [route] });
		} else {
			dayGroups.push({ dateStr: '', routes: [route] });
		}
	});

	function renderRouteItem(
		route: (typeof fullRoutes)[0],
		options: {
			isFullRoute: boolean;
			accentColor: string | null;
			isEbcDay?: boolean;
			showAsSelected?: boolean;
		},
	) {
		const { isFullRoute, accentColor, isEbcDay, showAsSelected } = options;
		const isSelected = showAsSelected ?? selected === route.name;
		return (
			<div
				role="button"
				tabIndex={0}
				onClick={() => handleSelect(route.name)}
				onKeyDown={e => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						handleSelect(route.name);
					}
				}}
				className={`sidebar-route ${isSelected ? 'selected' : ''} ${accentColor ? 'sidebar-route-has-date-group' : ''} ${isFullRoute ? 'sidebar-route-full' : ''} ${isEbcDay ? 'sidebar-route--ebc-day' : ''}`}
				data-sidebar-selected={isSelected ? 'true' : undefined}
				style={
					accentColor
						? { ['--date-accent' as string]: accentColor }
						: undefined
				}
			>
				<div className="sidebar-route-name">{route.name}</div>
			</div>
		);
	}

	return (
		<aside className="sidebar">
			{/* Mobile: hamburger + title + map/gallery segmented control */}
			<div className="sidebar-mobile-header">
				<button
					type="button"
					className="sidebar-hamburger"
					onClick={() => setMenuOpen(!menuOpen)}
					aria-label={menuOpen ? 'Close menu' : 'Open menu'}
					aria-expanded={menuOpen}
				>
					<HamburgerIcon open={menuOpen} />
				</button>
				<div className="sidebar-mobile-header-text">
					<h2 className="sidebar-mobile-title">
						{TITLE}
					</h2>
				</div>
				{mediaEnabled && (
					<div
						className="app-media-switch"
						role="tablist"
						aria-label="Map or gallery"
					>
						<button
							type="button"
							role="tab"
							className={`app-media-switch-btn${
								mobileMediaView === 'map' ? ' is-active' : ''
							}`}
							aria-selected={mobileMediaView === 'map'}
							onClick={() => onMobileMediaViewChange('map')}
						>
							Map
						</button>
						<button
							type="button"
							role="tab"
							className={`app-media-switch-btn${
								mobileMediaView === 'gallery' ? ' is-active' : ''
							}`}
							aria-selected={mobileMediaView === 'gallery'}
							onClick={() => onMobileMediaViewChange('gallery')}
						>
							Gallery
						</button>
					</div>
				)}
			</div>

			{/* Desktop: header; Mobile: drawer overlay + panel */}
			<div
				className={`sidebar-drawer-backdrop ${menuOpen ? 'sidebar-drawer-backdrop--open' : ''}`}
				aria-hidden={!menuOpen}
				onClick={() => setMenuOpen(false)}
			/>
			<div
				className={`sidebar-drawer ${menuOpen ? 'sidebar-drawer--open' : ''}`}
				aria-hidden={!menuOpen}
			>
				<div className="sidebar-header">
					<div className="sidebar-header-top">
						<p className="sidebar-eyebrow">Everest Base Camp</p>
						<button
							type="button"
							className="sidebar-drawer-close"
							onClick={() => setMenuOpen(false)}
							aria-label="Close menu"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
					</div>
					<h2 className="sidebar-title">{TITLE}</h2>
					<p className="sidebar-meta">
						<span>125 km</span>
						<span className="sidebar-meta-dot" aria-hidden />
						<span>12 days</span>
						<span className="sidebar-meta-dot" aria-hidden />
						<span>5,364 m</span>
					</p>
				</div>
				<div className="sidebar-routes" ref={routesListRef}>
				{/* Full route at top */}
				{fullRoutes.length > 0 && (
					<>
						<div className="sidebar-section-label">
							<span className="sidebar-section-label-text">
								Full route
							</span>
						</div>
						{fullRoutes.map(route => (
							<div
								key={route.name}
								className="sidebar-route-wrap sidebar-route-wrap-full"
							>
								{renderRouteItem(route, {
									isFullRoute: true,
									accentColor: null,
									showAsSelected:
										selected === route.name &&
										!selectedDayDate,
								})}
							</div>
						))}
					</>
				)}

				{/* Day wise routes */}
				{dayGroups.length > 0 && (
					<>
						<div className="sidebar-section-label sidebar-section-label--spaced">
							<span className="sidebar-section-label-text">
								Day-wise routes
							</span>
						</div>
						{dayGroups.map(group => {
							const dateStr = group.dateStr;
							const isEbcDay = dateStr === EBC_REACH_DATE;
							const firstRoute = group.routes[0];

							const downhillStartIndex = group.routes.findIndex(
								r =>
									r.name === EBC_DOWNHILL_ROUTE ||
									r.name.startsWith(
										'Everest Base Camp Monument -',
									),
							);
							const ebcUphillRoutes =
								isEbcDay && downhillStartIndex >= 0
									? group.routes.slice(0, downhillStartIndex)
									: null;
							const ebcDownhillRoutes =
								isEbcDay && downhillStartIndex >= 0
									? group.routes.slice(downhillStartIndex)
									: null;

							const headerLabel =
								dateStr &&
								firstRoute &&
								routeMeta[firstRoute.name]?.day
									? `${routeMeta[firstRoute.name].day} - ${formatDate(dateStr).toUpperCase()}`
									: dateStr
										? formatDate(dateStr).toUpperCase()
										: '';

							const groupIndex =
								dateStr != null
									? dateToGroupIndex[dateStr] ?? -1
									: -1;
							const groupAccentColor =
								groupIndex >= 0
									? DATE_GROUP_COLORS[
											groupIndex % DATE_GROUP_COLORS.length
										]
									: null;
							const treeStyle = groupAccentColor
								? {
										['--date-accent' as string]:
											groupAccentColor,
									}
								: undefined;

							const isEbcSplit =
								isEbcDay &&
								ebcUphillRoutes !== null &&
								ebcDownhillRoutes !== null;
							const isSingleRouteDay =
								!isEbcSplit && group.routes.length === 1;
							const singleRoute = isSingleRouteDay
								? group.routes[0]
								: null;
							const isSingleDaySelected =
								!!dateStr &&
								(selectedDayDate === dateStr ||
									(!!singleRoute &&
										selected === singleRoute.name &&
										!selectedDayDate));

							const dayLabel =
								dateStr && firstRoute
									? routeMeta[firstRoute.name]?.day
										? `${routeMeta[firstRoute.name].day} - ${formatDate(dateStr)}`
										: formatDate(dateStr)
									: '';

							if (isSingleRouteDay && singleRoute && dateStr) {
								return (
									<button
										key={dateStr}
										type="button"
										className={`sidebar-day-group sidebar-day-group--single${
											isSingleDaySelected
												? ' sidebar-day-group--selected'
												: ''
										}${isEbcDay ? ' sidebar-day-group--ebc' : ''}`}
										data-sidebar-selected={
											isSingleDaySelected
												? 'true'
												: undefined
										}
										style={treeStyle}
										onClick={() =>
											handleDayDateClick(dateStr)
										}
									>
										<div
											className={`sidebar-date-header sidebar-date-header--static${
												isEbcDay
													? ' sidebar-date-header--ebc'
													: ''
											}`}
										>
											{dayLabel}
										</div>
										<div className="sidebar-day-single-route">
											<span className="sidebar-day-single-route-name">
												{singleRoute.name}
											</span>
											{isEbcDay && (
												<span className="sidebar-date-header-ebc-badge">
													EBC day
												</span>
											)}
										</div>
									</button>
								);
							}

							const fullDayLabel =
								dateStr && !isEbcSplit
									? getFullDayRouteLabel(
											dateStr,
											group.routes,
											routeMeta,
										)
									: '';
							const isMultiDaySelected =
								!!dateStr && selectedDayDate === dateStr;

							return (
								<div
									key={dateStr || 'no-date'}
									className={`sidebar-day-group${
										isMultiDaySelected && !isEbcSplit
											? ' sidebar-day-group--day-selected'
											: ''
									}`}
									style={treeStyle}
								>
									{dateStr && firstRoute && !isEbcSplit && (
										<button
											type="button"
											className={`sidebar-day-summary${
												isMultiDaySelected
													? ' sidebar-day-summary--selected'
													: ''
											}`}
											data-sidebar-selected={
												isMultiDaySelected
													? 'true'
													: undefined
											}
											onClick={() =>
												handleDayDateClick(dateStr)
											}
										>
											<div
												className={`sidebar-date-header sidebar-date-header--static${
													isEbcDay
														? ' sidebar-date-header--ebc'
														: ''
												}`}
											>
												{dayLabel}
											</div>
											{fullDayLabel && (
												<div className="sidebar-day-single-route">
													<span className="sidebar-day-single-route-name">
														{fullDayLabel}
													</span>
													{isEbcDay && (
														<span className="sidebar-date-header-ebc-badge">
															EBC day
														</span>
													)}
												</div>
											)}
										</button>
									)}
									{isEbcSplit ? (
										<>
											<button
												type="button"
												className={`sidebar-day-summary sidebar-day-summary--ebc${
													selected === EBC_UPHILL_ROUTE
														? ' sidebar-day-summary--selected'
														: ''
												}`}
												data-sidebar-selected={
													selected === EBC_UPHILL_ROUTE
														? 'true'
														: undefined
												}
												onClick={() =>
													handleSelect(EBC_UPHILL_ROUTE)
												}
											>
												<div className="sidebar-date-header sidebar-date-header--static sidebar-date-header--ebc">
													{headerLabel} (uphill)
												</div>
												<div className="sidebar-day-single-route">
													<span className="sidebar-day-single-route-name">
														{EBC_UPHILL_ROUTE}
													</span>
													<span className="sidebar-date-header-ebc-badge">
														EBC day
													</span>
												</div>
											</button>
											<div className="sidebar-day-tree sidebar-day-tree--ebc">
												{ebcUphillRoutes!.map(route => (
													<div
														key={route.name}
														className="sidebar-route-wrap sidebar-route-wrap--branch sidebar-route-wrap--ebc-day"
													>
														{renderRouteItem(
															route,
															{
																isFullRoute: false,
																accentColor: null,
																isEbcDay: true,
																showAsSelected:
																	selected ===
																	route.name,
															},
														)}
													</div>
												))}
											</div>
											<button
												type="button"
												className={`sidebar-day-summary sidebar-day-summary--ebc${
													selected ===
													EBC_DOWNHILL_ROUTE
														? ' sidebar-day-summary--selected'
														: ''
												}`}
												data-sidebar-selected={
													selected ===
													EBC_DOWNHILL_ROUTE
														? 'true'
														: undefined
												}
												onClick={() =>
													handleSelect(
														EBC_DOWNHILL_ROUTE,
													)
												}
											>
												<div className="sidebar-date-header sidebar-date-header--static sidebar-date-header--ebc">
													{headerLabel} (downhill)
												</div>
												<div className="sidebar-day-single-route">
													<span className="sidebar-day-single-route-name">
														{EBC_DOWNHILL_ROUTE}
													</span>
													<span className="sidebar-date-header-ebc-badge">
														EBC day
													</span>
												</div>
											</button>
											<div className="sidebar-day-tree sidebar-day-tree--ebc">
												{ebcDownhillRoutes!.map(
													route => (
														<div
															key={route.name}
															className="sidebar-route-wrap sidebar-route-wrap--branch sidebar-route-wrap--ebc-day"
														>
															{renderRouteItem(
																route,
																{
																	isFullRoute: false,
																	accentColor: null,
																	isEbcDay: true,
																	showAsSelected:
																		selected ===
																		route.name,
																},
															)}
														</div>
													),
												)}
											</div>
										</>
									) : (
										<div className="sidebar-day-tree">
											{group.routes.map(route => {
												const routeDateStr =
													routeMeta[route.name]?.date;
												const routeEbcDay =
													routeDateStr ===
													EBC_REACH_DATE;
												const showAsSelected =
													selected === route.name &&
													(!selectedDayDate ||
														routeDateStr ===
															selectedDayDate);
												return (
													<div
														key={route.name}
														className={`sidebar-route-wrap sidebar-route-wrap--branch${
															routeEbcDay
																? ' sidebar-route-wrap--ebc-day'
																: ''
														}`}
													>
														{renderRouteItem(
															route,
															{
																isFullRoute: false,
																accentColor: null,
																isEbcDay:
																	routeEbcDay,
																showAsSelected,
															},
														)}
													</div>
												);
											})}
										</div>
									)}
							</div>
						);
					})}
				</>
			)}
				</div>
			</div>
		</aside>
	);
}
