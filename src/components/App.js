import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapView from './MapView';
import OverlayUI from './OverlayUI';

const App = () => {
	return (
		<div className="App">
			<MapView />
			<OverlayUI />
		</div>
	);
};

export { App };
