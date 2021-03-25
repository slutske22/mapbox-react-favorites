import React from 'react';
import MapView from './MapView';
import { mount } from 'enzyme';
import { mountToJson } from 'enzyme-to-json';
import { Map } from 'mapbox-gl';

const mockInstantiationTracker = jest.fn();

jest.mock('mapbox-gl', () => ({
	Map: jest.fn(),
}));

describe('MapView', () => {
	let wrapper;
	let mockFn = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();

		Map.mockImplementation(() => ({
			mockMethod: mockFn,
			on: mockFn,
		}));

		wrapper = mount(<MapView />);
	});

	it('renders', () => {
		expect(mountToJson(wrapper)).toMatchSnapshot();
	});

	it('initializes mapbox gl', () => {
		expect(Map).toHaveBeenCalledTimes(1);
	});

	it('makes a tilequery api call when the map is clicked', () => {});
});
