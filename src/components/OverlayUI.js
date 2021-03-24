import React from 'react';
import './OverlayUI.scss';

const OverlayUI = ({ results, favorites, setFavorites }) => {
	return (
		<div className="overlay-ui-container">
			<div className="title-container card">
				<h3>Favorite Keeper</h3>
				{results.length ? (
					<p>Click one of the result markers to add it to your favorites</p>
				) : (
					<p>Click on the map to see points of interest in the area.</p>
				)}
			</div>
			<div className="favorites-container card">
				<h3>Favorite Places</h3>
				{!favorites.length && <p>Choose some favorites!</p>}
			</div>
		</div>
	);
};

export default OverlayUI;
