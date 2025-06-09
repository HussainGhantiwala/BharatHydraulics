"use client"

import React, { useRef, useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet" //npm install react-leaflet leaflet
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// Map Click Handler Component
const MapClickHandler: React.FC = () => {
  const latitude = 17.529417
  const longitude = 78.432583
  const googleMapsUrl = `https://www.google.com/maps/@${latitude},${longitude},18z/data=!3m1!1e3`

  useMapEvent("click", () => {
    window.open(googleMapsUrl, "_blank")
  })

  return null
}

const InteractiveMap: React.FC = () => {
  const latitude = 17.529417
  const longitude = 78.432583
  const position: L.LatLngExpression = [latitude, longitude]
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Delay to ensure map container is ready
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-64 rounded-lg overflow-hidden">
      {isLoading || !containerRef.current ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <span className="text-gray-600 dark:text-gray-300">Loading Map...</span>
        </div>
      ) : (
        <MapContainer
          center={position}
          zoom={18}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          className="cursor-pointer"
          whenReady={() => {
            if (!mapRef.current && containerRef.current) {
              // Access the map instance via leaflet's internal API if needed
              // For now, just mark as ready
              // mapRef.current = ... (if you need to set it, use leaflet's API)
            }
          }}
        >
          <TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; OpenStreetMap contributors'
/>
          <Marker position={position}>
            <Popup>Bharath Hydraulics and Engineering Co.</Popup>
          </Marker>
          <MapClickHandler />
        </MapContainer>
      )}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-mono">
        17°31'45.9"N 78°25'57.3"E
      </div>
      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
        Street View
      </div>
    </div>
  )
}

export default InteractiveMap