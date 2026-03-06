import PictureCarousel from './PictureCarousel'

interface CarouselPopupProps {
  pictures: string[]
  onClose: () => void
}

export default function CarouselPopup({ pictures, onClose }: CarouselPopupProps) {
  return (
    <div
      className="carousel-popup-backdrop"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Picture carousel"
    >
      <div className="carousel-popup" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="carousel-popup-close"
          onClick={onClose}
          aria-label="Close"
        >
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="carousel-popup-content">
          <PictureCarousel pictures={pictures} />
        </div>
      </div>
    </div>
  )
}
