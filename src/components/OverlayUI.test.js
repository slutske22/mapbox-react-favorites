import React from 'react';
import OverlayUI from './OverlayUI';
import { mount } from 'enzyme';
import * as mockdata from '../__mocks__/mockdata';

describe('The OverlayUI component', () => {
	it('Renders consistently', () => {
		const wrapper = mount(
			<OverlayUI results={mockdata.results} favorites={mockdata.favorites} />
		).html();
		expect(wrapper).toMatchSnapshot();
	});

	it('Renders the "Click the map" message when there are no results present', () => {
		const wrapper = mount(
			<OverlayUI results={[]} favorites={mockdata.favorites} />
		);
		expect(wrapper.find('#click-the-map').exists()).toBeTruthy();
	});

	it('Renders the "Select a result" message when there are results present', () => {
		const wrapper = mount(
			<OverlayUI results={mockdata.results} favorites={mockdata.favorites} />
		);
		expect(wrapper.find('#select-a-result').exists()).toBeTruthy();
		expect(wrapper.find('#clear-results').exists()).toBeTruthy();
	});

	it('Calls the clear results method when the user clicks the "Clear results" button', () => {
		const setResults = jest.fn();
		const wrapper = mount(
			<OverlayUI
				results={mockdata.results}
				favorites={mockdata.favorites}
				setResults={setResults}
			/>
		);
		wrapper.find('#clear-results').simulate('click');
		expect(setResults).toHaveBeenCalledWith([]);
	});

	it('Displays a list item for every favorite', () => {
		const wrapper = mount(
			<OverlayUI results={[]} favorites={mockdata.results} />
		);

		mockdata.results.forEach((item) => {
			expect(
				wrapper.find(`#favorite-li-${item.feature.id}`).exists()
			).toBeTruthy();
		});
	});

	it('Calls the setFavorites function when the user clicks to remove a favorite', () => {
		const favorites = mockdata.results;
		const newFavorites = [...mockdata.results];
		newFavorites.shift();
		const setFavorites = jest.fn();

		const wrapper = mount(
			<OverlayUI
				results={[]}
				favorites={favorites}
				setFavorites={setFavorites}
			/>
		);

		wrapper
			.find(`#favorite-li-${mockdata.results[0].feature.id} button`)
			.simulate('click');

		expect(setFavorites).toHaveBeenCalledWith(newFavorites);
	});
});
