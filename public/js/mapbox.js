/* eslint-disable */
export const displayMap = locations => {
  const mapElement = document.getElementById('map');
  const token = mapElement?.dataset?.mapboxToken;
  
  if (!token) {
    console.error('Mapbox token not found');
    return;
  }
  
  mapboxgl.accessToken = token;

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  // Fallback in case a style fails to load in specific token/account setups.
  map.on('error', e => {
    if (
      e &&
      e.error &&
      typeof e.error.message === 'string' &&
      e.error.message.includes('style')
    ) {
      map.setStyle('mapbox://styles/mapbox/light-v10');
    }
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};