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
  const [vehicles, setVehicles] = React.useState({});

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  // Fetch vehicle data from the backend
  React.useEffect(() => {
    const fetchVehicles = () => {
      fetch('/api/vehicles')
        .then(res => res.json())
        .then(data => setVehicles(data))
        .catch(err => console.error("Error fetching vehicles:", err));
    };

    fetchVehicles(); // Initial fetch
    const interval = setInterval(fetchVehicles, 2000); // Poll every 2 seconds

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
        {Object.keys(vehicles).map(id => (
          <Marker
            key={id}
            position={vehicles[id]}
          />
        ))}
      </GoogleMap>
  ) : <></>
}

export default React.memo(Map)