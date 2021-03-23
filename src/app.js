import React from 'react';
import './app.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapView } from './map-view';

function App() {
	return (
		<div className="App">
			<MapView />
		</div>
	);
}

export { App };
