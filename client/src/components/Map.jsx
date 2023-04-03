import * as d3 from 'd3';
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../public/css/map.css';

// import province from '../data/thai.geojson';
import Legend from './Legend';

mapboxgl.accessToken = '';

// Map
const Map = (props) => {
  // console.log(props.stops);
  // console.log(props.property);
  // console.log(props.data);

  const mapContainerRef = useRef(null);
  const [lng, setLng] = useState(100.5018);
  const [lat, setLat] = useState(13.7563);
  const [zoom, setZoom] = useState(4);

  useEffect(() => {
    // Mabbox config
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Move handlers
    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    map.on('load', () => {
      if (map.isStyleLoaded()) {
      }
      // Add the GeoJSON data to the map
      map.addSource('covidData', {
        type: 'geojson',
        data: props.data,
      });

      // Add the fill layer for the provinces
      map.addLayer({
        id: 'provinces-fill',
        type: 'fill',
        source: 'covidData',
        paint: {
          'fill-color': {
            property: props.property,
            stops: props.stops,
          },
          'fill-opacity': 0.6,
        },
      });

      // Add the border layer for the provinces
      map.addLayer({
        id: 'provinces-line',
        type: 'line',
        source: 'covidData',
        paint: {
          'line-color': '#800026',
          'line-width': 1,
          'line-opacity': 1,
        },
      });

      // Calculate the maximum property value to use for scaling the circle sizes
      const maxPropertyValue = Math.max(
        ...props.data.features.map(
          (province) => province.properties[props.property]
        )
      );

      // Loop through the data features and add a marker for each province
      props.data.features.forEach((province) => {
        // Calculate the size of the marker using the interpolator function

        const markerSize = d3.interpolate(
          10,
          75
        )(province.properties[props.property] / maxPropertyValue);

        const marker = document.createElement('div');
        marker.className = 'marker';
        marker.style.width = `${markerSize}px`;
        marker.style.height = `${markerSize}px`;
        marker.style.borderRadius = '50%'; // make circle
        marker.style.backgroundColor = 'rgba(0, 128, 0, 0.5)';
        marker.style.opacity = '0.7';

        new mapboxgl.Marker({
          element: marker,
          anchor: 'center',
          // Set the marker location based on the province's LONG and LAT values
          // Reverse the order of coordinates to [LONG, LAT] for setLngLat()
          // See: https://docs.mapbox.com/mapbox-gl-js/api/markers/#lnglatlike
          lngLat: [province.properties.LONG, province.properties.LAT],
        })
          // Set the marker and popups
          .setLngLat([province.properties.LONG, province.properties.LAT])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML(
                `<h3>${province.properties.ADM1_EN}</h3><p>${
                  province.properties[props.property]
                }</p>`
              )
          )
          .addTo(map);
      });
    });

    // Clean up on unmount
    return () => map.remove();

    // Watching dependecies to re-render map
  }, [props.data, props.property, props.stops]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="map-container flex justify-center">
        <div id="map" ref={mapContainerRef}></div>
        <Legend stops={props.stops} />
      </div>
    </>
  );
};

export default Map;
