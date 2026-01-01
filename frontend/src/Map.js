import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_API_KEY_HERE" // IMPORTANT: Replace with your actual API key
  })

  const [map, setMap] = React.useState(null)
  const [vehicles, setVehicles] = React.useState([
    { id: 'bus1', lat: -3.745, lng: -38.523 },
    { id: 'bus2', lat: -3.750, lng: -38.530 },
  ]);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  // Simulate real-time vehicle updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(currentVehicles =>
        currentVehicles.map(vehicle => ({
          ...vehicle,
          lat: vehicle.lat + (Math.random() - 0.5) * 0.001,
          lng: vehicle.lng + (Math.random() - 0.5) * 0.001,
        }))
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {vehicles.map(vehicle => (
          <Marker
            key={vehicle.id}
            position={{ lat: vehicle.lat, lng: vehicle.lng }}
          />
        ))}
      </GoogleMap>
  ) : <></>
}

export default React.memo(Map)
