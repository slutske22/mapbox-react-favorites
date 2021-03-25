import React, { useRef, useState, useEffect } from 'react';
import mapboxGl, { Marker, LngLatBounds, Popup } from 'mapbox-gl';
import style from '../data/style.json';
import { ACCESS_TOKEN, buildQueryParams } from '../constants';
import { usePrevious } from '../utils';

const MapView = ({ results, setResults, favorites, setFavorites }) => {
	const prevResults = usePrevious(results);
	const mapContainer = useRef();
	const [map, setMap] = useState();

	const removeResultsMarkers = React.useCallback(
		() => {
			console.log('results', results);
			// prevResults && prevResults.forEach((result) => result.marker.remove());
			results.forEach((result) => result.marker.remove());
		},
		[results]
	);

	/**
	 * Function to create marker on map when tilequery results come back
	 * along with popup, and handler to add place to favorites
	 */
	const createMarker = (feature, map) => {
		const { name, category_en } = feature.properties;

		// Create marker and popup
		const marker = new Marker({ color: '#C0C0C0' }).setLngLat(
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
			marker.getPopup().addTo(map);
		});
		marker.getElement().addEventListener('mouseleave', () => {
			marker.getPopup().remove();
		});

		const item = {
			feature,
			marker,
		};

		// Add event listener on marker click to add to favorites
		marker.getElement().addEventListener('click', (e) => {
			e.stopPropagation();
			removeResultsMarkers();
			setFavorites((prevFavs) => {
				// See if user already has this location in their favorites
				const preexistingFavorite = prevFavs.find(
					(fav) => fav.feature.id === feature.id
				);
				if (preexistingFavorite) {
					// Trigger some UI actions to let user know this is already in their list
					return prevFavs;
				}
				// Add to list
				return [...prevFavs, item];
			});
		});

		return item;
	};

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
				const { lng, lat } = e.lngLat;
				map.panTo(e.lngLat);

				fetch(
					`https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${lng},${lat}.json?${buildQueryParams()}`
				)
					.then((res) => res.json())
					.then((res) => {
						const results = res.features.map((feature) =>
							createMarker(feature, map)
						);
						setResults(results);
						console.log(res);
					})
					.catch((e) => console.log(e));
			});
		}
	}, []);

	/**
	 * Manage markers for tilequery results when results change
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

	useEffect(
		() => {
			favorites.forEach((favorite) => {
				favorite.marker.remove();
				favorite.marker.addTo(map);
			});
		},
		[map, favorites]
	);

	return <div ref={mapContainer} className="map-container" />;
};

export default MapView;
