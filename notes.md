# Dev Notes

## First steps

1. Apply prettier for formatting consistency
2. `git init` to keep track of my changes locally
3. Organize `src` with `components` folder

## Packages added

- `node-sass`: because sass is easier than css
- `react-icons`: because everyone loves icons

## Interesting challenges

1.  **JSX in a popup?**<br>
    I initially wanted to have the UI such that when a user clicks on the map, and several options for points of interest (POI) close by appear as blue markers, that each marker would have an interactive popup. They could hover over the popup, and _within_ the popup would be a button to say "Add To Favorites". But, creating interactive popups in mapbox gl, while using react logic in the markup, is quite challenging! This was [initially an issue with react-leaflet](https://github.com/PaulLeCam/react-leaflet/issues/11), though it seems it [was resolved](https://stackoverflow.com/questions/42894803/rendering-react-components-inside-popup-of-react-leaflet-draw-drawn-layer-on-rea). Basically, JSX does not work in a mapbox popup.<br><br> In the interest of time, I made a compromise. Rather than trying to invent react-mapboxgl (a tempting project to start), I opted to simply show the information about each query result in a popup when the user hovers over the marker, and have that result be added to favorites when the user clicks the marker.

2.  **Functional components and closures**<br>
    You may notice that I chose to use functional components for `App` and `OverlayUI`. These are relatively simple components. I initially thought that a functional component would also prove useful for the `MapView`, as `useEffects` can help make communication between react state variables and external libraries easier. (And its sometimes clearner and easier to read than `componentDidUpdate` prop comparison statements.) But I was running into problems. On component mount, I create the map and set up a click handler to run a query for points of POI. Within the callback of that handler is a fetch. Within the fetch is a `.then`, and within the `.then`, makers are created, which get their _own_ event handlers, and within _those_ callbacks, I need to access the most recent state or prop variables. In this deepest level, my state variables were stale. This is because with so many callbacks, my state variables were encapsulated in multiple closures. Rather than spending too much time trying to make this work, I switched back to class components, where getting `this.props` or `this.state` always gives my latest values, even in nested closures.
