import React from 'react';
import mapboxGl, { Marker } from 'mapbox-gl';
import style from '../data/style.json';
import { ACCESS_TOKEN, buildQueryParams } from '../constants';

class MapView extends React.Component {
	constructor() {
		super();
		this.mapContainer = React.createRef();
		this.state = {
			map: null,
		};
	}

	componentDidMount = () => {
		const containerEl = this.mapContainer;
		if (containerEl && containerEl.current) {
			mapboxGl.accessToken = ACCESS_TOKEN;
			const map = new mapboxGl.Map({
				container: containerEl.current,
				style: style,
				center: [-122.396449, 37.791256],
				zoom: 15,
			});
			this.setState({ map });

			map.on('click', (e) => {
				console.log(e.lngLat);
				const { lng, lat } = e.lngLat;
				map.panTo(e.lngLat);

				fetch(
					`https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${lng},${lat}.json?${buildQueryParams()}`
				)
					.then((res) => res.json())
					.then((res) => {
						console.log(res);
						res.features.forEach((feature) => {
							const marker = new Marker()
								.setLngLat(feature.geometry.coordinates)
								.addTo(map);
						});
					})
					.catch((e) => console.log(e));
			});
		}
	};

	render() {
		return <div ref={this.mapContainer} className="map-container" />;
	}
}

export default MapView;
