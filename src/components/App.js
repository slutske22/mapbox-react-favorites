import React, { useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapView from './MapView';
import OverlayUI from './OverlayUI';

const App = () => {
	const [favorites, setFavorites] = useState([]);
	const [results, setResults] = useState([]);

	return (
		<div className="App">
			<MapView
				favorites={favorites}
				setFavorites={setFavorites}
				results={results}
				setResults={setResults}
			/>
			<OverlayUI
				favorites={favorites}
				setFavorites={setFavorites}
				results={results}
			/>
		</div>
	);
};

export { App };
