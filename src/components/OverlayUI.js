import React from 'react';
import { GrFavorite } from 'react-icons/gr';
import { ImCross } from 'react-icons/im';
import './OverlayUI.scss';

const OverlayUI = ({ results, favorites, setFavorites }) => {
	return (
		<div className="overlay-ui-container">
			<div className="title-container card">
				<h3>
					<GrFavorite style={{ marginRight: '10px' }} />
					Favorite Keeper
				</h3>
				{results.length ? (
					<p>Click one of the result markers to add it to your favorites</p>
				) : (
					<p>Click on the map to see points of interest in the area.</p>
				)}
			</div>
			<div className="favorites-container card">
				<h3>Favorite Places</h3>
				{!favorites.length ? (
					<p>Choose some favorites!</p>
				) : (
					<ul>
						{favorites.map((favorite) => {
							const {
								id,
								properties: { name, category_en },
							} = favorite.feature;
							return (
								<li>
									<h5>{name}</h5>
									{category_en && <p>{category_en}</p>}
									<button>
										<ImCross size={18} />
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
};

export default OverlayUI;
