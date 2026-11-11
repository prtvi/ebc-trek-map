import { useState, useCallback, useEffect, useRef, type TouchEvent } from 'react';

interface Props {
	pictures: string[];
}

/** Max dots shown at once (Instagram-style sliding window). */
const MAX_VISIBLE_DOTS = 5;
const MOBILE_BREAKPOINT = '(max-width: 768px)';
/** Min horizontal movement (px) to count as a swipe. */
const SWIPE_THRESHOLD_PX = 40;
const SETTLE_MS = 280;

type DotSize = 'xs' | 'sm' | 'md';

interface VisibleDot {
	index: number;
	size: DotSize;
}

/**
 * Build a sliding window of dots centered on the active index.
 * Edge dots shrink when more images exist beyond the window.
 */
function getVisibleDots(total: number, active: number): VisibleDot[] {
	if (total <= MAX_VISIBLE_DOTS) {
		return Array.from({ length: total }, (_, i) => ({
			index: i,
			size: 'md' as const,
		}));
	}

	const half = Math.floor(MAX_VISIBLE_DOTS / 2);
	let start = active - half;
	if (start < 0) start = 0;
	if (start > total - MAX_VISIBLE_DOTS) start = total - MAX_VISIBLE_DOTS;
	const end = start + MAX_VISIBLE_DOTS;

	const dots: VisibleDot[] = [];
	for (let i = start; i < end; i++) {
		let size: DotSize = 'md';
		const isFirst = i === start;
		const isLast = i === end - 1;
		const moreBefore = start > 0;
		const moreAfter = end < total;

		if (i === active) {
			size = 'md';
		} else if ((isFirst && moreBefore) || (isLast && moreAfter)) {
			size = 'xs';
		} else if (
			(moreBefore && i === start + 1 && active > start + 1) ||
			(moreAfter && i === end - 2 && active < end - 2)
		) {
			size = 'sm';
		}

		dots.push({ index: i, size });
	}
	return dots;
}

function wrapIndex(i: number, length: number) {
	if (length <= 0) return 0;
	return ((i % length) + length) % length;
}

export default function PictureCarousel({ pictures }: Props) {
	const [index, setIndex] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [offsetX, setOffsetX] = useState(0);
	const [isSettling, setIsSettling] = useState(false);

	const trackRef = useRef<HTMLDivElement>(null);
	const touchStartRef = useRef<{ x: number; y: number } | null>(null);
	const axisLockRef = useRef<'h' | 'v' | null>(null);
	const offsetXRef = useRef(0);
	const settlingRef = useRef(false);
	const settleTimerRef = useRef<number | null>(null);

	const setDragOffset = useCallback((x: number) => {
		offsetXRef.current = x;
		setOffsetX(x);
	}, []);

	useEffect(() => {
		setIndex(0);
		setDragOffset(0);
		setIsSettling(false);
		settlingRef.current = false;
	}, [pictures, setDragOffset]);

	useEffect(() => {
		const mql = window.matchMedia(MOBILE_BREAKPOINT);
		const update = () => setIsMobile(mql.matches);
		update();
		mql.addEventListener('change', update);
		return () => mql.removeEventListener('change', update);
	}, []);

	useEffect(() => {
		return () => {
			if (settleTimerRef.current != null) {
				window.clearTimeout(settleTimerRef.current);
			}
		};
	}, []);

	const trackWidth = useCallback(() => trackRef.current?.offsetWidth || 1, []);

	const finishSettle = useCallback(
		(nextIndex: number | null) => {
			settlingRef.current = false;
			setIsSettling(false);
			if (nextIndex != null) setIndex(nextIndex);
			setDragOffset(0);
		},
		[setDragOffset],
	);

	const settleTo = useCallback(
		(targetX: number, nextIndex: number | null) => {
			settlingRef.current = true;
			setIsSettling(true);
			setDragOffset(targetX);
			if (settleTimerRef.current != null) {
				window.clearTimeout(settleTimerRef.current);
			}
			settleTimerRef.current = window.setTimeout(() => {
				finishSettle(nextIndex);
			}, SETTLE_MS);
		},
		[finishSettle, setDragOffset],
	);

	const goPrev = useCallback(() => {
		if (pictures.length <= 1 || settlingRef.current) return;
		if (isMobile) {
			settleTo(trackWidth(), wrapIndex(index - 1, pictures.length));
			return;
		}
		setIndex((i) => wrapIndex(i - 1, pictures.length));
	}, [pictures.length, isMobile, index, settleTo, trackWidth]);

	const goNext = useCallback(() => {
		if (pictures.length <= 1 || settlingRef.current) return;
		if (isMobile) {
			settleTo(-trackWidth(), wrapIndex(index + 1, pictures.length));
			return;
		}
		setIndex((i) => wrapIndex(i + 1, pictures.length));
	}, [pictures.length, isMobile, index, settleTo, trackWidth]);

	const goTo = useCallback(
		(target: number) => {
			if (target === index || pictures.length <= 1 || settlingRef.current) return;
			if (!isMobile) {
				setIndex(target);
				return;
			}
			const forward = (target - index + pictures.length) % pictures.length;
			const backward = (index - target + pictures.length) % pictures.length;
			if (forward <= backward) {
				settleTo(-trackWidth(), target);
			} else {
				settleTo(trackWidth(), target);
			}
		},
		[index, pictures.length, isMobile, settleTo, trackWidth],
	);

	const onTouchStart = useCallback(
		(e: TouchEvent<HTMLDivElement>) => {
			if (!isMobile || pictures.length <= 1 || settlingRef.current) return;
			const t = e.touches[0];
			touchStartRef.current = { x: t.clientX, y: t.clientY };
			axisLockRef.current = null;
			setIsSettling(false);
		},
		[isMobile, pictures.length],
	);

	const onTouchMove = useCallback(
		(e: TouchEvent<HTMLDivElement>) => {
			if (!isMobile || pictures.length <= 1 || !touchStartRef.current || settlingRef.current) {
				return;
			}
			const t = e.touches[0];
			const dx = t.clientX - touchStartRef.current.x;
			const dy = t.clientY - touchStartRef.current.y;

			if (axisLockRef.current == null) {
				if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
				axisLockRef.current = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v';
			}
			if (axisLockRef.current === 'v') return;

			setDragOffset(dx);
		},
		[isMobile, pictures.length, setDragOffset],
	);

	const onTouchEnd = useCallback(() => {
		if (!isMobile || pictures.length <= 1 || !touchStartRef.current) return;
		touchStartRef.current = null;
		const axis = axisLockRef.current;
		axisLockRef.current = null;
		const dx = offsetXRef.current;

		if (axis !== 'h' || settlingRef.current) {
			setDragOffset(0);
			return;
		}

		const w = trackWidth();
		if (dx <= -SWIPE_THRESHOLD_PX) {
			settleTo(-w, wrapIndex(index + 1, pictures.length));
		} else if (dx >= SWIPE_THRESHOLD_PX) {
			settleTo(w, wrapIndex(index - 1, pictures.length));
		} else {
			settleTo(0, null);
		}
	}, [isMobile, pictures.length, index, settleTo, trackWidth, setDragOffset]);

	const onTouchCancel = useCallback(() => {
		touchStartRef.current = null;
		axisLockRef.current = null;
		if (!settlingRef.current) {
			settleTo(0, null);
		}
	}, [settleTo]);

	const visibleDots = getVisibleDots(pictures.length, index);
	const prevIndex = wrapIndex(index - 1, pictures.length);
	const nextIndex = wrapIndex(index + 1, pictures.length);
	const showSwipeLayer = isMobile && pictures.length > 1;
	const sliderStyle = showSwipeLayer
		? {
				transform: `translateX(${offsetX}px)`,
				transition: isSettling ? `transform ${SETTLE_MS}ms cubic-bezier(0.25, 0.8, 0.25, 1)` : 'none',
			}
		: undefined;

	if (pictures.length === 0) {
		return (
			<div className="picture-carousel picture-carousel--empty">
				<span className="picture-carousel-empty-label">No pictures</span>
			</div>
		);
	}

	return (
		<div
			className={`picture-carousel${isMobile ? ' picture-carousel--swipeable' : ''}`}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
			onTouchCancel={onTouchCancel}
		>
			<div className="picture-carousel-track" ref={trackRef}>
				{showSwipeLayer ? (
					<div className="picture-carousel-slider" style={sliderStyle}>
						<div className="picture-carousel-slide picture-carousel-slide--prev" aria-hidden>
							<img
								className="picture-carousel-image"
								src={pictures[prevIndex]}
								alt=""
								loading="lazy"
								draggable={false}
							/>
						</div>
						<div className="picture-carousel-slide picture-carousel-slide--current">
							<img
								className="picture-carousel-image"
								src={pictures[index]}
								alt=""
								draggable={false}
							/>
						</div>
						<div className="picture-carousel-slide picture-carousel-slide--next" aria-hidden>
							<img
								className="picture-carousel-image"
								src={pictures[nextIndex]}
								alt=""
								loading="lazy"
								draggable={false}
							/>
						</div>
					</div>
				) : (
					<img
						key={pictures[index]}
						className="picture-carousel-image"
						src={pictures[index]}
						alt=""
						loading="lazy"
						draggable={false}
					/>
				)}
			</div>
			{pictures.length > 1 && (
				<>
					<button
						type="button"
						className="picture-carousel-btn picture-carousel-btn--prev"
						onClick={goPrev}
						aria-label="Previous image"
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.25"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden
						>
							<polyline points="15 18 9 12 15 6" />
						</svg>
					</button>
					<button
						type="button"
						className="picture-carousel-btn picture-carousel-btn--next"
						onClick={goNext}
						aria-label="Next image"
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.25"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden
						>
							<polyline points="9 18 15 12 9 6" />
						</svg>
					</button>
					<div className="picture-carousel-dots" role="tablist" aria-label="Image indicators">
						{visibleDots.map(({ index: i, size }) => (
							<button
								key={i}
								type="button"
								className={`picture-carousel-dot picture-carousel-dot--${size}${i === index ? ' active' : ''}`}
								onClick={() => goTo(i)}
								aria-label={`Go to image ${i + 1}`}
								aria-current={i === index ? 'true' : undefined}
							/>
						))}
					</div>
					<span className="picture-carousel-counter" aria-live="polite">
						{index + 1} / {pictures.length}
					</span>
				</>
			)}
		</div>
	);
}
