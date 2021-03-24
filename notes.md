# Dev Notes

## First steps

1. Apply prettier for formatting consistency
2. `git init` to keep track of my changes locally
3. Organize `src` with `components` folder

## Packages added

- `node-sass`: because sass is easier than css

## Interesting challenges

1.  I initially wanted to have the UI such that when a user clicks on the map, and several options for POI close by appear as blue markers, that each marker would have an interactive popup. They could hover over the popup, and _within_ the popup would be a button to say "Add To Favorites". But, creating interactive popups in mapbox gl, while using react logic in the markup, is quite challenging! This was [initially an issue with react-leaflet](https://github.com/PaulLeCam/react-leaflet/issues/11), though it seems it [was resolved](https://stackoverflow.com/questions/42894803/rendering-react-components-inside-popup-of-react-leaflet-draw-drawn-layer-on-rea). JSX does not work in a mapbox popup.<br><br>Rather than trying to invent react-mapboxgl (a tempting project to start), I opted to simply show the information about each query result in a popup when the user hovers over the marker, and have that result be added to favorites when the user clicks the marker.
