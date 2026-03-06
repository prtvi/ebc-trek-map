import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { TooltipContentProps as RechartsTooltipContentProps } from 'recharts';

interface Props {
	data: { index: number; elevation: number }[];
	title?: string;
	date?: string;
	day?: string;
	distanceKm?: number;
}

const MOBILE_BREAKPOINT = '(max-width: 768px)';

type ChartTooltipContentProps = Partial<RechartsTooltipContentProps<number, string>> & {
	maxIndex: number;
	distanceKm?: number;
};

function ChartTooltipContent(props: ChartTooltipContentProps) {
	const { active, payload, maxIndex, distanceKm } = props;
	if (!active || !payload?.length) return null;
	const { index, elevation } = payload[0].payload;
	const distanceStr =
		distanceKm != null && distanceKm > 0
			? `Distance: ${((index / maxIndex) * distanceKm).toFixed(1)} km`
			: `Index: ${index}`;
	return (
		<div className="elevation-chart-tooltip" style={{ padding: '0 8px 4px', fontSize: '0.75rem' }}>
			<div style={{ marginBottom: 2 }}>{distanceStr}</div>
			<div>Elevation: {elevation != null ? `${elevation} m` : '—'}</div>
		</div>
	);
}

function formatChartDate(iso: string) {
	const d = new Date(iso);
	return d.toLocaleDateString('en-IN', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}

export default function ElevationChart({ data, title, date, day, distanceKm }: Props) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mql = window.matchMedia(MOBILE_BREAKPOINT);
		const update = () => setIsMobile(mql.matches);
		update();
		mql.addEventListener('change', update);
		return () => mql.removeEventListener('change', update);
	}, []);
	const elevations = data.map((d) => d.elevation);
	const minEl = elevations.length ? Math.min(...elevations) : 0;
	const maxEl = elevations.length ? Math.max(...elevations) : 0;
	const padding = Math.max(50, (maxEl - minEl) * 0.05);
	const yDomain: [number, number] =
		elevations.length > 0 ? [minEl - padding, maxEl + padding] : [0, 100];

	const maxIndex = data.length > 1 ? data.length - 1 : 1;
	const formatXTick = (index: number) => {
		if (distanceKm != null && distanceKm > 0) {
			const km = (index / maxIndex) * distanceKm;
			return km % 1 === 0 ? `${km}` : km.toFixed(1);
		}
		return `${index}`;
	};

	return (
		<div className="elevation-chart">
			{(title || date != null || distanceKm != null) && (
				<div className="elevation-chart-header">
					{title && <h3 className="elevation-chart-title">{title}</h3>}
					<div className="elevation-chart-meta">
						{date && (
							<span className="elevation-chart-date">
								{day ? `${day} - ${formatChartDate(date)}` : formatChartDate(date)}
							</span>
						)}
						{distanceKm != null && (
							<span className="elevation-chart-distance">{distanceKm.toFixed(1)} km</span>
						)}
					</div>
				</div>
			)}
			<div className="elevation-chart-graph">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data} margin={{ top: 20, right: 20, bottom: 8, left: 20 }}>
						<XAxis
							dataKey="index"
							tickFormatter={formatXTick}
							tick={{ style: { fontSize: '0.7rem' } }}
							label={{ value: 'Distance (km)', position: 'insideBottom', offset: -8, style: { fontSize: '0.7rem' } }}
						/>
						<YAxis
							dataKey="elevation"
							domain={yDomain}
							tickFormatter={(value) => `${value} m`}
							tick={{ style: { fontSize: '0.7rem' } }}
							label={{ value: 'Elevation (m)', angle: -90, position: 'insideLeft', offset: -12, style: { fontSize: '0.7rem' }, dy: 35 }}
						/>
						<Tooltip
								content={
									isMobile
										? () => null
										: <ChartTooltipContent maxIndex={maxIndex} distanceKm={distanceKm} />
								}
								cursor={!isMobile}
								contentStyle={isMobile ? undefined : { padding: 0, minWidth: 'auto' }}
								wrapperStyle={{ outline: 'none' }}
							/>
						<Line type="monotone" dataKey="elevation" stroke="#16a34a" dot={false} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
