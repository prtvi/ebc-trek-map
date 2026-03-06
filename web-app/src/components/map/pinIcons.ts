import L from "leaflet"

export type PinState = "start" | "end" | "onRoute" | "offRoute"

const PIN_SIZE = 24
const PIN_HEIGHT_FACTOR = 1.6
const PIN_TIP_Y_FACTOR = 22 / 24

export const PIN_TOOLTIP_OFFSET_HEIGHT = Math.round(PIN_SIZE * PIN_HEIGHT_FACTOR * 0.85)

const COLORS: Record<PinState, string> = {
  start: "#22c55e",
  end: "#dc2626",
  onRoute: "#2563eb",
  offRoute: "#60a5fa",
}

function createPinIcon(state: PinState): L.DivIcon {
  const width = PIN_SIZE
  const height = Math.round(width * PIN_HEIGHT_FACTOR)
  const color = COLORS[state]
  const anchorY = Math.round(height * PIN_TIP_Y_FACTOR)
  return L.divIcon({
    className: "map-pin-icon",
    html: `
      <svg
        width="${width}"
        height="${height}"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style="display:block;filter: drop-shadow(0 1px 2px rgba(0,0,0,0.35));"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"
          fill="${color}"
          stroke="white"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <circle cx="12" cy="9.5" r="2.6" fill="rgba(255,255,255,0.9)" />
      </svg>
    `.trim(),
    iconSize: [width, height],
    iconAnchor: [width / 2, anchorY],
  })
}

export const pinIcons: Record<PinState, L.DivIcon> = {
  start: createPinIcon("start"),
  end: createPinIcon("end"),
  onRoute: createPinIcon("onRoute"),
  offRoute: createPinIcon("offRoute"),
}

export function getPinState(
  waypointName: string,
  routeWaypointOrder: string[] | undefined
): PinState {
  if (!routeWaypointOrder?.length) return "offRoute"
  const index = routeWaypointOrder.indexOf(waypointName)
  if (index < 0) return "offRoute"
  if (index === 0) return "start"
  if (index === routeWaypointOrder.length - 1) return "end"
  return "onRoute"
}
