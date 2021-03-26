import React, { useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapView from './MapView';
import OverlayUI from './OverlayUI';

const App = () => {
	const [map, setMap] = useState();
	const [favorites, setFavorites] = useState([]);
	const [results, setResults] = useState([]);

	return (
		<div className="App">
			<MapView
				map={map}
				setMap={setMap}
				favorites={favorites}
				setFavorites={setFavorites}
				results={results}
				setResults={setResults}
			/>
			<OverlayUI
				map={map}
				favorites={favorites}
				setFavorites={setFavorites}
				results={results}
				setResults={setResults}
			/>
		</div>
	);
};

export { App };
