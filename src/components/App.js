import React, { useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapView from './MapView';
import OverlayUI from './OverlayUI';

const App = () => {
	const [favorites, setFavorites] = useState([]);

	return (
		<div className="App">
			<MapView setFavorites={setFavorites} />
			<OverlayUI favorites={favorites} />
		</div>
	);
};

export { App };
