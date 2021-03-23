import React from 'react';
import mapboxGl from 'mapbox-gl';
import style from './data/style.json';

// If there are issues, replace with your token
const ACCESS_TOKEN =
	'pk.eyJ1IjoiZGFzdWxpdCIsImEiOiJjaXQzYmFjYmkwdWQ5MnBwZzEzZnNub2hhIn0.EDJ-lIfX2FnKhPw3nqHcqg';

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
		}
	};

	render() {
		return <div ref={this.mapContainer} className="map-container" />;
	}
}

export { MapView };
