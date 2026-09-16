import {
  Map,
  AdvancedMarker,
  InfoWindow,
  Polyline,
  useMap,
} from "@vis.gl/react-google-maps";

import { useEffect, useMemo, useState } from "react";

import { FaLocationArrow, FaMapMarkerAlt } from "react-icons/fa";

const DEFAULT_CENTER = {
  lat: 25.693022,
  lng: 85.238826,
};

const MapAutoFit = ({ map, currentLocation, destinations }) => {
  useEffect(() => {
    if (!map) return;

    const points = [];

    if (
      currentLocation?.latitude != null &&
      currentLocation?.longitude != null
    ) {
      points.push({
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
      });
    }

    destinations.forEach((destination) => {
      if (destination.latitude != null && destination.longitude != null) {
        points.push({
          lat: destination.latitude,
          lng: destination.longitude,
        });
      }
    });

    if (points.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    points.forEach((point) => {
      bounds.extend(point);
    });

    if (points.length === 1) {
      map.setCenter(points[0]);
      map.setZoom(15);
      return;
    }

    map.fitBounds(bounds, {
      top: 80,
      right: 80,
      bottom: 80,
      left: 80,
    });
  }, [
    map,
    currentLocation?.latitude,
    currentLocation?.longitude,
    destinations,
  ]);

  return null;
};

const CurrentLocationMarker = ({ location , driver }) => {
  if (location?.latitude == null || location?.longitude == null) {
    return null;
  }

  return (
    <AdvancedMarker
      position={{
        lat: location.latitude,
        lng: location.longitude,
      }}
      title={`Current vehicle location \n ${driver}`}
      zIndex={1000}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 shadow-lg">
        <FaLocationArrow size={17} className="text-white" />
      </div>
    </AdvancedMarker>
  );
};

const DestinationMarker = ({ destination, index, active, onClick }) => {
  if (destination?.latitude == null || destination?.longitude == null) {
    return null;
  }

  return (
    <AdvancedMarker
      position={{
        lat: destination.latitude,
        lng: destination.longitude,
      }}
      title={destination.name || `Destination ${index + 1}`}
      zIndex={active ? 900 : 500}
      onClick={onClick}
    >
      <div
        className={`flex h-10 min-w-10 items-center justify-center rounded-full border-4 border-white px-2 shadow-lg ${
          active ? "bg-green-600" : "bg-red-600"
        }`}
      >
        <span className="font-bold text-white">{index + 1}</span>
      </div>
    </AdvancedMarker>
  );
};

const RecenterButton = ({ location, map }) => {
  if (!location || !map) return null;

  const recenter = () => {
    map.panTo({
      lat: location.latitude,
      lng: location.longitude,
    });

    map.setZoom(16);
  };

  return (
    <button
      type="button"
      onClick={recenter}
      className="absolute left-4 top-4 z-10 rounded-xl bg-white p-3 shadow-lg transition hover:bg-gray-100"
      title="My location"
    >
      <FaLocationArrow size={20} className="text-gray-700" />
    </button>
  );
};

const MapController = ({ onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
};

const TripMap = ({
  currentLocation: externalLocation,
  destinations = [],
  route = [],
  onMapClick,
  activeDestinationId,
  driver,
  height = "500px",
}) => {
  const [map, setMap] = useState(null);

  const [currentLocation, setCurrentLocation] = useState(
    externalLocation || null,
  );

  const [roadRoute, setRoadRoute] = useState([]);

  const [roadDistanceKm, setRoadDistanceKm] = useState(null);

  const [roadDurationMinutes, setRoadDurationMinutes] = useState(null);

  const [selectedDestination, setSelectedDestination] = useState(null);

  /*
   * External location
   */
  useEffect(() => {
    if (externalLocation) {
      setCurrentLocation(externalLocation);
    }
  }, [externalLocation]);

  /*
   * Live GPS
   */
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported.");

      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,

          longitude: position.coords.longitude,

          accuracy: position.coords.accuracy,

          capturedAt: new Date(position.timestamp).toISOString(),
        };

        setCurrentLocation(location);
      },

      (error) => {
        console.error("GPS error:", error);
      },

      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  /*
   * Active destination
   */
  const activeDestination = useMemo(() => {
    return (
      destinations.find(
        (destination) =>
          String(destination._id) === String(activeDestinationId),
      ) ||
      destinations.find((destination) => destination.status === "CURRENT") ||
      destinations.find((destination) => destination.status === "PENDING")
    );
  }, [destinations, activeDestinationId]);

  /*
   * Google route
   *
   * NOTE:
   * This currently uses the Google Maps
   * JavaScript Routes library.
   */
  useEffect(() => {
    let cancelled = false;

    const getRoute = async () => {
      if (!currentLocation) {
        setRoadRoute([]);
        setRoadDistanceKm(null);
        setRoadDurationMinutes(null);
        return;
      }

      if (!activeDestination) {
        setRoadRoute([]);
        setRoadDistanceKm(null);
        setRoadDurationMinutes(null);
        return;
      }

      if (
        activeDestination.latitude == null ||
        activeDestination.longitude == null
      ) {
        setRoadRoute([]);
        return;
      }

      try {
        const { DirectionsService } = await google.maps.importLibrary("routes");

        const directionsService = new DirectionsService();

        const result = await directionsService.route({
          origin: {
            lat: currentLocation.latitude,
            lng: currentLocation.longitude,
          },

          destination: {
            lat: activeDestination.latitude,
            lng: activeDestination.longitude,
          },

          travelMode: google.maps.TravelMode.DRIVING,

          provideRouteAlternatives: true,
        });

        if (cancelled) return;

        const selectedRoute = result.routes?.[0];

        if (!selectedRoute) {
          setRoadRoute([]);
          setRoadDistanceKm(null);
          setRoadDurationMinutes(null);
          return;
        }

        /*
         * Google route geometry
         */
        const path = selectedRoute.overview_path.map((point) => ({
          lat: point.lat(),
          lng: point.lng(),
        }));

        /*
         * Calculate total road distance
         */
        const distanceMeters = selectedRoute.legs.reduce(
          (total, leg) => total + (leg.distance?.value || 0),
          0,
        );

        /*
         * Calculate road duration
         */
        const durationSeconds = selectedRoute.legs.reduce(
          (total, leg) => total + (leg.duration?.value || 0),
          0,
        );

        setRoadRoute(path);

        setRoadDistanceKm(distanceMeters / 1000);

        setRoadDurationMinutes(durationSeconds / 60);
      } catch (error) {
        console.error("Google route error:", error);

        if (!cancelled) {
          setRoadRoute([]);
          setRoadDistanceKm(null);
          setRoadDurationMinutes(null);
        }
      }
    };

    getRoute();

    return () => {
      cancelled = true;
    };
  }, [
    currentLocation?.latitude,
    currentLocation?.longitude,
    activeDestination?.latitude,
    activeDestination?.longitude,
  ]);

  /*
   * Convert external route format
   * into Google Maps format.
   *
   * Existing route may currently be:
   *
   * [lat, lng]
   */
  const existingRoute = useMemo(() => {
    if (!Array.isArray(route)) {
      return [];
    }

    return route
      .filter((point) => Array.isArray(point) && point.length >= 2)
      .map(([lat, lng]) => ({
        lat,
        lng,
      }));
  }, [route]);

  /*
   * Map center
   */
  const center = currentLocation
    ? {
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
      }
    : DEFAULT_CENTER;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ height }}
    >
      <Map
        defaultCenter={center}
        defaultZoom={13}
        mapId="DEMO_MAP_ID"
        gestureHandling
        disableDefaultUI={false}
        zoomControl={true}
        streetViewControl={true}
        fullscreenControl
       cameraControl={false}
        mapTypeControl={false}
        className="h-full w-full"
        onClick={(event) => {
          if (!onMapClick) return;

          const lat = event.detail.latLng?.lat();

          const lng = event.detail.latLng?.lng();

          if (lat == null || lng == null) {
            return;
          }

          onMapClick({
            latitude: lat,
            longitude: lng,
            source: "MAP",
          });
        }}
      >
        <MapController onMapReady={setMap} />

        <MapAutoFit
          map={map}
          currentLocation={currentLocation}
          destinations={destinations}
        />

        {/* Current vehicle GPS */}
        <CurrentLocationMarker location={currentLocation} driver={driver}/>

        {/* Destination markers */}
        {destinations.map((destination, index) => (
          <DestinationMarker
            key={destination._id || destination.tempId || index}
            destination={destination}
            index={index}
            active={String(destination._id) === String(activeDestinationId)}
            onClick={() => setSelectedDestination(destination)}
          />
        ))}

        {/* Google road route */}
        {roadRoute.length > 1 && (
          <Polyline
            path={roadRoute}
            strokeColor="#2563eb"
            strokeOpacity={0.9}
            strokeWeight={6}
          />
        )}

        {/* Existing/backend route */}
        {existingRoute.length > 1 && (
          <Polyline
            path={existingRoute}
            strokeColor="#6b7280"
            strokeOpacity={0.6}
            strokeWeight={4}
          />
        )}

        {/* Destination information */}
        {selectedDestination && (
          <InfoWindow
            position={{
              lat: selectedDestination.latitude,
              lng: selectedDestination.longitude,
            }}
            onCloseClick={() => setSelectedDestination(null)}
          >
            <div className="min-w-[200px] p-1">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-600" />

                <strong>{selectedDestination.name}</strong>
              </div>

              {selectedDestination.address && (
                <p className="mt-2 text-sm text-gray-600">
                  {selectedDestination.address}
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </Map>

      <RecenterButton location={currentLocation} map={map} />

      {/* Route information */}
      {(roadDistanceKm != null || roadDurationMinutes != null) && (
        <div className="absolute bottom-4 left-4 z-10 rounded-xl bg-white px-4 py-3 shadow-lg">
          {roadDistanceKm != null && (
            <div className="text-sm font-semibold text-gray-800">
              Road distance: {roadDistanceKm.toFixed(1)} km
            </div>
          )}

          {roadDurationMinutes != null && (
            <div className="text-xs text-gray-500">
              Approx. {Math.round(roadDurationMinutes)} min
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TripMap;
