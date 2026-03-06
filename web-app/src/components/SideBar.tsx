import { useState } from 'react';

interface Props {
	fullRoutes: any[];
	dayRoutes: any[];
	routeMeta: Record<string, { date: string; day?: string }>;
	selected: string;
	selectedDayDate: string | null;
	onSelect: (name: string) => void;
	onDayDateClick: (date: string) => void;
}

function HamburgerIcon({ open }: { open: boolean }) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			{open ? (
				<>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</>
			) : (
				<>
					<line x1="3" y1="6" x2="21" y2="6" />
					<line x1="3" y1="12" x2="21" y2="12" />
					<line x1="3" y1="18" x2="21" y2="18" />
				</>
			)}
		</svg>
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

const DATE_GROUP_COLORS = [
	'#6366f1',
	'#22c55e',
	'#eab308',
	'#ec4899',
	'#14b8a6',
	'#f97316',
	'#8b5cf6',
	'#ef4444',
];

const TITLE = 'Prithvi and Koushik\'s EBC Trek'
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
}: Props) {
	const [menuOpen, setMenuOpen] = useState(false);

	const handleSelect = (name: string) => {
		onSelect(name);
		setMenuOpen(false);
	};

	const handleDayDateClick = (dateStr: string) => {
		onDayDateClick(dateStr);
		setMenuOpen(false);
	};

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
			{/* Mobile: hamburger + title only; route name shown in elevation chart and notes */}
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
					<h2 className="sidebar-title">
						{TITLE}
					</h2>
				</div>
				<div className="sidebar-routes">
				{/* Full route at top */}
				{fullRoutes.length > 0 && (
					<>
						<div className="sidebar-full-route-header">
							Full route
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
						<div className="sidebar-day-route-header">
							Day wise route
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

							return (
								<div
									key={dateStr || 'no-date'}
									className="sidebar-day-group"
								>
									{dateStr &&
										firstRoute &&
										!(
											isEbcDay && ebcUphillRoutes !== null
										) && (
											<button
												type="button"
												className={`sidebar-date-header ${isEbcDay ? 'sidebar-date-header--ebc' : ''} ${selectedDayDate === dateStr ? 'sidebar-date-header--selected' : ''}`}
												onClick={() =>
													handleDayDateClick(dateStr)
												}
											>
												{routeMeta[firstRoute.name]?.day
													? `${routeMeta[firstRoute.name].day} - ${formatDate(dateStr)}`
													: formatDate(dateStr)}
												{isEbcDay && (
													<span className="sidebar-date-header-ebc-badge">
														EBC day
													</span>
												)}
											</button>
										)}
									{isEbcDay &&
									ebcUphillRoutes !== null &&
									ebcDownhillRoutes !== null ? (
										<>
											<button
												type="button"
												className={`sidebar-date-header sidebar-date-header--ebc ${selected === EBC_UPHILL_ROUTE ? 'sidebar-date-header--selected' : ''}`}
												onClick={() =>
													handleSelect(EBC_UPHILL_ROUTE)
												}
											>
												{headerLabel} (uphill)
												<span className="sidebar-date-header-ebc-badge">
													EBC day
												</span>
											</button>
											{ebcUphillRoutes.map(route => {
												const routeGroupIndex =
													dateToGroupIndex[dateStr] ??
													-1;
												const routeAccentColor =
													routeGroupIndex >= 0
														? DATE_GROUP_COLORS[
																routeGroupIndex %
																	DATE_GROUP_COLORS.length
															]
														: null;
												return (
													<div
														key={route.name}
														className="sidebar-route-wrap sidebar-route-wrap--ebc-day"
													>
														{renderRouteItem(
															route,
															{
																isFullRoute: false,
																accentColor:
																	routeAccentColor,
																isEbcDay: true,
																showAsSelected:
																	selected ===
																	route.name,
															},
														)}
													</div>
												);
											})}
											<button
												type="button"
												className={`sidebar-date-header sidebar-date-header--ebc ${selected === EBC_DOWNHILL_ROUTE ? 'sidebar-date-header--selected' : ''}`}
												onClick={() =>
													handleSelect(EBC_DOWNHILL_ROUTE)
												}
											>
												{headerLabel} (downhill)
												<span className="sidebar-date-header-ebc-badge">
													EBC day
												</span>
											</button>
											{ebcDownhillRoutes.map(route => {
												const routeGroupIndex =
													dateToGroupIndex[dateStr] ??
													-1;
												const routeAccentColor =
													routeGroupIndex >= 0
														? DATE_GROUP_COLORS[
																routeGroupIndex %
																	DATE_GROUP_COLORS.length
															]
														: null;
												return (
													<div
														key={route.name}
														className="sidebar-route-wrap sidebar-route-wrap--ebc-day"
													>
														{renderRouteItem(
															route,
															{
																isFullRoute: false,
																accentColor:
																	routeAccentColor,
																isEbcDay: true,
																showAsSelected:
																	selected ===
																	route.name,
															},
														)}
													</div>
												);
											})}
										</>
									) : (
										group.routes.map(route => {
											const routeDateStr =
												routeMeta[route.name]?.date;
											const routeGroupIndex =
												routeDateStr != null
													? dateToGroupIndex[
															routeDateStr
														]
													: -1;
											const routeAccentColor =
												routeGroupIndex >= 0
													? DATE_GROUP_COLORS[
															routeGroupIndex %
																DATE_GROUP_COLORS.length
														]
													: null;
											const routeEbcDay =
												routeDateStr === EBC_REACH_DATE;
											const showAsSelected =
												selected === route.name &&
												(!selectedDayDate ||
													routeDateStr ===
														selectedDayDate);
											return (
												<div
													key={route.name}
													className={`sidebar-route-wrap ${routeEbcDay ? 'sidebar-route-wrap--ebc-day' : ''}`}
												>
													{renderRouteItem(route, {
														isFullRoute: false,
														accentColor:
															routeAccentColor,
														isEbcDay: routeEbcDay,
														showAsSelected,
													})}
												</div>
											);
										}									)
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
