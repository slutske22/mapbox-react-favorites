import React from 'react';
import mapboxGl, { Marker, LngLatBounds, Popup } from 'mapbox-gl';
import style from '../data/style.json';
import { ACCESS_TOKEN, buildQueryParams } from '../constants';

class MapView extends React.Component {
	state = { map: null, results: [] };

	mapContainer = React.createRef();

	componentDidMount() {
		if (this.mapContainer?.current) {
			mapboxGl.accessToken = ACCESS_TOKEN;
			const map = new mapboxGl.Map({
				container: this.mapContainer.current,
				style: style,
				center: [-122.396449, 37.791256],
				zoom: 15,
			});
			this.setState({ map });

			map.on('click', (e) => {
				const { lng, lat } = e.lngLat;
				map.panTo(e.lngLat);

				fetch(
					`https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${lng},${lat}.json?${buildQueryParams()}`
				)
					.then((res) => res.json())
					.then((res) => {
						const results = res.features.map((feature) =>
							this.createMarker(feature)
						);
						console.log('results', results);
						this.setState({ results });
					})
					.catch((e) => console.log(e));
			});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const prevResults = prevState?.results;
		const prevFavorites = prevProps?.favorites;
		const { results } = this.state;
		const { favorites } = this.props;
		const { map } = this.state;
		/**
		 * Check if query results have changed:
		 */
		if (prevResults !== results) {
			console.log('results udpated');

			// Remove previous query markers from map (if there are any)
			if (prevResults?.length) {
				prevResults.forEach((result) => {
					result.marker.remove();
				});
			}

			// Add new query markers to map
			if (results?.length) {
				// fit map to bounds of the features returned
				var bounds = new LngLatBounds();
				results.forEach((result) => {
					bounds.extend(result.feature.geometry.coordinates);
				});
				map.fitBounds(bounds, { padding: 300 });

				// Place markers on the map for each feature
				results.forEach((result) => {
					result.marker.addTo(map);
				});
			}
		}

		/**
		 * Check if favorites have changed:
		 */
		if (prevFavorites !== favorites) {
			prevFavorites.forEach((favorite) => {
				favorite.marker.remove();
			});
			favorites.forEach((favorite) => {
				favorite.marker.addTo(map);
			});
		}
	}

	/**
	 * Function to create marker on map when tilequery results come back
	 * along with popup, and handler to add place to favorites
	 */
	createMarker = (feature) => {
		const { setFavorites } = this.props;
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

		// Different color marker and different popup behavior for favorite
		const favMarker = new Marker({ color: '#000094' }).setLngLat(
			feature.geometry.coordinates
		);
		const favPopup = new Popup()
			.setHTML(
				`${name ? `<h5>${name}</h5>` : ''}
				 ${category_en ? `<p>${category_en}</p>` : ''}`
			)
			.setMaxWidth('500px');
		favMarker.setPopup(favPopup);

		// Set mouseover handlers on query markers
		marker.getElement().addEventListener('mouseenter', () => {
			marker.getPopup().addTo(this.state.map);
		});
		marker.getElement().addEventListener('mouseleave', () => {
			marker.getPopup().remove();
		});

		// Add event listener on marker click to add to favorites
		marker.getElement().addEventListener('click', (e) => {
			const { results } = this.state;

			e.stopPropagation();
			console.log('results from click', results);
			results.forEach((result) => result.marker.remove());
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
				return [
					...prevFavs,
					{
						feature,
						marker: favMarker,
					},
				];
			});
		});

		// Dont run query when user clicks on a favorited marker
		favMarker.getElement().addEventListener('click', (e) => {
			favMarker.getPopup().addTo(this.state.map);
			e.stopPropagation();
		});

		return {
			feature,
			marker,
		};
	};

	render() {
		return <div ref={this.mapContainer} className="map-container" />;
	}
}

export default MapView;
