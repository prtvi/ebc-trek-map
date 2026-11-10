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
        url: window.location.href,
        src: new URLSearchParams(window.location.search).get('src'),
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

  useEffect(() => {
    if (!mediaEnabled && mobileMediaView !== 'map') {
      setMobileMediaView('map')
    }
  }, [mediaEnabled, mobileMediaView])

  const showGallery =
    mediaEnabled && mobileMediaView === 'gallery'

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
        mobileMediaView={mobileMediaView}
        onMobileMediaViewChange={setMobileMediaView}
        mediaEnabled={mediaEnabled}
      />

      <div
        className={`app-main${showGallery ? ' is-gallery-view' : ''
          }${mediaEnabled ? '' : ' is-media-disabled'}`}
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

        {mediaEnabled && (
          <>
            <div
              className={`app-gallery-mobile${mobileMediaView === 'map' ? ' is-mobile-hidden' : ''
                }`}
              aria-label="Gallery"
              aria-hidden={mobileMediaView === 'map'}
            >
              <PictureCarousel pictures={pictureUrls} />
            </div>

            <div className="app-pictures" aria-label="Pictures">
              <PictureCarousel pictures={pictureUrls} />
            </div>
          </>
        )}

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
