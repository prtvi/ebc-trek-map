import { useState, useCallback, useEffect } from 'react';

interface Props {
	pictures: string[];
}

export default function PictureCarousel({ pictures }: Props) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		setIndex(0);
	}, [pictures]);

	const goPrev = useCallback(() => {
		setIndex((i) => (i <= 0 ? pictures.length - 1 : i - 1));
	}, [pictures.length]);

	const goNext = useCallback(() => {
		setIndex((i) => (i >= pictures.length - 1 ? 0 : i + 1));
	}, [pictures.length]);

	if (pictures.length === 0) {
		return (
			<div className="picture-carousel picture-carousel--empty">
				<span className="picture-carousel-empty-label">No pictures</span>
			</div>
		);
	}

	return (
		<div className="picture-carousel">
			<div className="picture-carousel-track">
				<img
					key={pictures[index]}
					className="picture-carousel-image"
					src={pictures[index]}
					alt=""
					loading="lazy"
				/>
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
							width="18"
							height="18"
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
							width="18"
							height="18"
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
					<div className="picture-carousel-dots">
						{pictures.map((_, i) => (
							<button
								key={i}
								type="button"
								className={`picture-carousel-dot ${i === index ? 'active' : ''}`}
								onClick={() => setIndex(i)}
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
