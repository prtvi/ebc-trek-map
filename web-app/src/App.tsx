import { useMemo, useState, useEffect } from 'react'
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

type MobileMediaView = 'map' | 'gallery'

const WEBSITE_VISIT_URL =
  'https://hotwheeeelsengine.onrender.com/api/capture_website_visit'

export default function App() {
  const waypoints = useMemo(mergeWaypoints, [])
  const [mobileMediaView, setMobileMediaView] =
    useState<MobileMediaView>('map')

  useEffect(() => {
    const alreadyNotified = sessionStorage.getItem('homepage-webhook-sent')
    if (alreadyNotified) return

    sessionStorage.setItem('homepage-webhook-sent', '1')
    fetch(WEBSITE_VISIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({
        url: `${window.location.origin}${window.location.pathname}`,
        src: new URLSearchParams(window.location.search).get('src'),
        show: new URLSearchParams(window.location.search).get('show'),
      }),
    }).catch(() => {
      // Ignore webhook failures so the map still loads
      sessionStorage.removeItem('homepage-webhook-sent')
    })
  }, [])

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
    mediaEnabled,
    pictureUrls,
    notesText,
    elevationProfile,
    chartTitle,
    chartDate,
    chartDay,
    chartDistanceKm,
  } = useRouteSelection(waypoints)

  const showGallery = mobileMediaView === 'gallery'

  const onSelectRoute = (name: string) => {
    setMobileMediaView('map')
    handleSelectRoute(name)
  }

  const onDayDateClick = (date: string) => {
    setMobileMediaView('map')
    handleDayDateClick(date)
  }

  const galleryContent = mediaEnabled ? (
    <PictureCarousel pictures={pictureUrls} />
  ) : (
    <div className="gallery-teaser">
      <p className="gallery-teaser-eyebrow">Photos coming soon</p>
      <p className="gallery-teaser-title">
        Follow along for more from the trail
      </p>
      <p className="gallery-teaser-copy">
        New pictures will show up here as they go up. Until then, catch them on
        Instagram.
      </p>
      <a
        className="gallery-teaser-link"
        href="https://www.instagram.com/earths.jpegs"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          className="gallery-teaser-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <circle
            cx="12"
            cy="12"
            r="4"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
        <span className="gallery-teaser-handle">@earths.jpegs</span>
      </a>
    </div>
  )

  return (
    <div className="app-layout">
      <Sidebar
        fullRoutes={fullRoutes}
        dayRoutes={dayRoutesSortedByDate}
        routeMeta={routeMeta}
        selected={selectedRouteName}
        selectedDayDate={selectedDayDate}
        onSelect={onSelectRoute}
        onDayDateClick={onDayDateClick}
        mobileMediaView={mobileMediaView}
        onMobileMediaViewChange={setMobileMediaView}
      />

      <div
        className={`app-main${showGallery ? ' is-gallery-view' : ''}`}
      >
        <div
          className={`app-map${showGallery ? ' is-mobile-hidden' : ''
            }`}
        >
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

        <div
          className={`app-gallery-mobile${mobileMediaView === 'map' ? ' is-mobile-hidden' : ''
            }`}
          aria-label="Gallery"
          aria-hidden={mobileMediaView === 'map'}
        >
          {galleryContent}
        </div>

        <div className="app-pictures" aria-label="Pictures">
          {galleryContent}
        </div>

        <div className="app-chart">
          {hasRoute && (
            <ElevationChart
              data={elevationProfile}
              title={chartTitle}
              date={chartDate}
              day={chartDay}
              distanceKm={chartDistanceKm}
              hideGraph={showGallery}
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
      </div>
    </div>
  )
}
