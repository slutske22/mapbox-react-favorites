import React, { useRef, useState, useEffect } from 'react';
import mapboxGl, { Marker, LngLatBounds, Popup } from 'mapbox-gl';
import style from '../data/style.json';
import { ACCESS_TOKEN, buildQueryParams } from '../constants';
import { usePrevious } from '../utils';

const MapView = ({ results, setResults }) => {
	const mapContainer = useRef();
	const [map, setMap] = useState();

	const prevResults = usePrevious(results);

	/**
	 * On component mount:
	 * Create map using map container div, set up click handler
	 */
	useEffect(() => {
		if (mapContainer?.current) {
			mapboxGl.accessToken = ACCESS_TOKEN;
			const map = new mapboxGl.Map({
				container: mapContainer.current,
				style: style,
				center: [-122.396449, 37.791256],
				zoom: 15,
			});
			setMap(map);

			map.on('click', (e) => {
				console.log(e.lngLat);
				const { lng, lat } = e.lngLat;
				map.panTo(e.lngLat);

				fetch(
					`https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${lng},${lat}.json?${buildQueryParams()}`
				)
					.then((res) => res.json())
					.then((res) => {
						const results = res.features.map((feature) => {
							const { name, category_en } = feature.properties;

							const marker = new Marker().setLngLat(
								feature.geometry.coordinates
							);
							const popup = new Popup({ closeButton: false })
								.setHTML(
									`${name ? `<h5>${name}</h5>` : ''}
									 ${category_en ? `<p>${category_en}</p>` : ''}`
								)
								.setMaxWidth('500px');
							marker.setPopup(popup);

							marker.getElement().addEventListener('mouseenter', () => {
								console.log('yuppp');
								marker.getPopup().addTo(map);
							});
							marker.getElement().addEventListener('mouseleave', () => {
								marker.getPopup().remove();
							});
							marker.getElement().addEventListener('click', (e) => {
								e.stopPropagation();
								console.log('yuppp');
							});

							return {
								feature,
								marker,
							};
						});
						setResults(results);
						console.log(res);
					})
					.catch((e) => console.log(e));
			});
		}
	}, []);

	/**
	 * Manage markers for results when results change
	 */
	useEffect(
		() => {
			if (results?.length && map) {
				console.log('results', results);

				// fit map to bounds of the features returned
				var bounds = new LngLatBounds();
				results.forEach((result) => {
					bounds.extend(result.feature.geometry.coordinates);
				});
				map.fitBounds(bounds, { padding: 300 });

				// Remove previous markers from map
				if (prevResults?.length) {
					prevResults.forEach((result) => {
						result.marker.remove();
					});
				}

				// Place markers on the map for each feature
				results.forEach((result) => {
					result.marker.addTo(map);
				});
			}
		},
		[map, results]
	);

	return <div ref={mapContainer} className="map-container" />;
};

export default MapView;
