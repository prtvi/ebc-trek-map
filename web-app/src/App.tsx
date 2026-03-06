import { useMemo, useState } from 'react'
import { routeMeta } from './data/routeMeta'
import {
  fullRoutes,
  dayRoutesSortedByDate,
  mergeWaypoints,
} from './utils/routeData'
import { useRouteSelection } from './hooks/useRouteSelection'
import MapView from './components/MapView'
import Sidebar from './components/SideBar'
import ElevationChart from './components/ElevationChart'
import RightPanel from './components/RightPanel'
import PictureCarousel from './components/PictureCarousel'
import CarouselPopup from './components/CarouselPopup'

export default function App() {
  const waypoints = useMemo(mergeWaypoints, [])
  const [carouselPopupOpen, setCarouselPopupOpen] = useState(false)

  const {
    selectedRouteName,
    selectedDayDate,
    selectedRoute,
    dayWiseRoutesForSelectedDate,
    waypointNamesOnRoute,
    routeWaypointOrder,
    handleSelectRoute,
    handleDayDateClick,
    hasRoute,
    distanceKm,
    elevationGainM,
    elevationLossM,
    locationsStr,
    panelDay,
    panelDate,
    pictureUrls,
    notesText,
    elevationProfile,
    chartTitle,
    chartDate,
    chartDay,
    chartDistanceKm,
  } = useRouteSelection(waypoints)

  return (
    <div className="app-layout">
      <Sidebar
        fullRoutes={fullRoutes}
        dayRoutes={dayRoutesSortedByDate}
        routeMeta={routeMeta}
        selected={selectedRouteName}
        selectedDayDate={selectedDayDate}
        onSelect={handleSelectRoute}
        onDayDateClick={handleDayDateClick}
      />

      <div className="app-main">
        <div className="app-map">
          <MapView
            route={selectedDayDate ? undefined : selectedRoute}
            routes={
              selectedDayDate ? dayWiseRoutesForSelectedDate : undefined
            }
            waypoints={waypoints}
            waypointNamesToShow={waypointNamesOnRoute}
            routeWaypointOrder={routeWaypointOrder}
          />
        </div>

        <div className="app-pictures" aria-label="Pictures">
          <PictureCarousel pictures={pictureUrls} />
        </div>

        <div className="app-chart">
          {hasRoute && (
            <button
              type="button"
              className="app-chart-pictures-btn"
              onClick={() => setCarouselPopupOpen(true)}
              aria-label="View pictures"
              title="View pictures"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>
          )}
          {hasRoute && (
            <ElevationChart
              data={elevationProfile}
              title={chartTitle}
              date={chartDate}
              day={chartDay}
              distanceKm={chartDistanceKm}
            />
          )}
        </div>

        <div className="app-notes-wrap">
          <RightPanel
            day={panelDay}
            date={panelDate}
            locations={locationsStr}
            distanceKm={distanceKm}
            elevationGainM={elevationGainM}
            elevationLossM={elevationLossM}
            notes={notesText}
          />
        </div>

        {carouselPopupOpen && (
          <CarouselPopup
            pictures={pictureUrls}
            onClose={() => setCarouselPopupOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
