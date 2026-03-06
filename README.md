# EBC Trek Map

An **interactive web app** that visualizes the **Everest Base Camp (EBC)** trek — routes, elevation profiles, waypoints, and day-by-day photos and notes. Built to share the full journey from Lukla to EBC and back (via Gokyo and Cho La) in one place.

![EBC Trek](https://res.cloudinary.com/dbedchkny/image/upload/v1772795423/EBC/social-preview.jpg)

## Overview

- **Route:** Lukla → Phakding → Namche Bazaar → Gokyo (via Dole, Macchermo) → Cho La pass → Dzonglha → Lobuche → Gorak Shep → **Everest Base Camp** → return via Pheriche, Tengboche, Namche, Phakding → Lukla
- **Distance:** ~125 km (round trip)
- **Duration:** 12 days
- **Max elevation:** 5,364 m (Everest Base Camp)

The app lets you explore the trek as **full out-and-back routes** or **day-by-day segments**, with an elevation chart, map waypoints, and a photo carousel tied to each segment.

## Features

- **Interactive map** — Leaflet + OpenStreetMap; route polylines and waypoints (villages, passes, EBC). Map auto-fits the selected route.
- **Route selection** — Sidebar with:
    - **Full route:** Lukla → EBC and EBC → Lukla
    - **Day-wise routes:** Choose by date to see that day’s legs (e.g. “Day 10 – EBC day” with uphill/downhill options).
- **Elevation profile** — Recharts-based profile for the selected route with distance and elevation tooltips.
- **Photos** — Per-segment photos (hosted on Cloudinary) in a carousel and a full-screen popup.
- **Trip stats & notes** — For the selected segment: day, date, locations, distance, elevation gain/loss, and short notes.
- **Responsive layout** — Collapsible sidebar and layout that works on mobile and desktop.

## Tech Stack

| Layer     | Technology                                       |
| --------- | ------------------------------------------------ |
| Framework | React 19, TypeScript                             |
| Build     | Vite 7                                           |
| Map       | Leaflet, react-leaflet, OpenStreetMap tiles      |
| Charts    | Recharts                                         |
| Data      | GeoJSON routes + waypoints (JSON), metadata (JS) |

No API keys are required for the map (OpenStreetMap only).

## Project Structure

```
ebc-trek-map/
├── README.md
└── web-app/
    ├── index.html
    ├── package.json
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── index.css
    │   ├── data/
    │   │   ├── routeMeta.js      # Dates, pictures, notes per route
    │   │   ├── fullRoutes.json   # Full trek GeoJSON + waypoints
    │   │   ├── pointToPointRoutes.json
    │   │   └── dayWiseRoutes.json
    │   ├── components/
    │   │   ├── MapView.tsx       # Leaflet map container
    │   │   ├── map/              # MapContent, pin icons
    │   │   ├── SideBar.tsx       # Route list & day selector
    │   │   ├── ElevationChart.tsx
    │   │   ├── RightPanel.tsx    # Stats & notes
    │   │   ├── PictureCarousel.tsx
    │   │   └── CarouselPopup.tsx
    │   ├── hooks/
    │   │   └── useRouteSelection.ts
    │   └── utils/
    │       ├── routeData.ts
    │       └── waypointsOnRoute.ts
    └── ...
```

## Customizing Your Own Trek

To adapt this for another EBC (or other) trek:

1. **Route geometry** — Replace or edit `web-app/src/data/fullRoutes.json`, `pointToPointRoutes.json`, and `dayWiseRoutes.json` with your GeoJSON routes and waypoints.
2. **Metadata** — Update `web-app/src/data/routeMeta.js`: route names, `date`, `day`, `pictures` (URLs), and `notes` for each segment.
3. **Copy and titles** — Change the app title in `web-app/index.html` and the sidebar title in `web-app/src/components/SideBar.tsx`.
4. **Images** — Use your own image URLs in `routeMeta.js`; the current ones point to Cloudinary.

## License

This project is for personal use and sharing. Reuse and modify as you like; attribution is appreciated.

---

_Built to document and share an Everest Base Camp trek — from Lukla to the monument and back._
