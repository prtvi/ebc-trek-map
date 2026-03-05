import type { ReactNode } from 'react';

interface Props {
	day?: string;
	date?: string;
	locations: string;
	distanceKm?: number;
	elevationGainM?: number;
	elevationLossM?: number;
	notes?: string;
	headerAction?: ReactNode;
}

function formatDate(iso: string) {
	const d = new Date(iso);
	return d.toLocaleDateString('en-IN', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}

export default function RightPanel({
	day,
	date,
	locations,
	distanceKm,
	elevationGainM,
	elevationLossM,
	notes,
	headerAction,
}: Props) {
	const heading =
		day && date
			? `${day} – ${formatDate(date)}`
			: date
				? formatDate(date)
				: locations || 'Route';

	return (
		<div className="right-panel-notes">
			<div className="right-panel-heading-row">
				<h3 className="right-panel-heading">{heading}</h3>
				{headerAction}
			</div>
			{locations && (
				<p className="right-panel-locations">{locations}</p>
			)}
			<dl className="right-panel-stats">
				{distanceKm != null && (
					<>
						<dt>Distance</dt>
						<dd>{distanceKm.toFixed(1)} km</dd>
					</>
				)}
				{elevationGainM != null && (
					<>
						<dt>Elevation gain</dt>
						<dd>{elevationGainM.toLocaleString()} m</dd>
					</>
				)}
				{elevationLossM != null && (
					<>
						<dt>Elevation loss</dt>
						<dd>{elevationLossM.toLocaleString()} m</dd>
					</>
				)}
			</dl>
			<div className="right-panel-extra">
				<label className="right-panel-notes-label">Notes</label>
				<div className="right-panel-notes-content">
					{notes ? (
						<p className="right-panel-notes-text">{notes}</p>
					) : (
						<span className="right-panel-notes-empty">No notes for this route.</span>
					)}
				</div>
			</div>
		</div>
	);
}
