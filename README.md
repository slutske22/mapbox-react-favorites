# Dev Notes

## Organization

- **Components** <br>
  I immediately saw this application as having two major components - a `Map` or `MapView` component, and a UI or `OverlayUI` component. The `Map` would handle all map logic and behavior, and respond to any state or prop changes. The `UI` would contain things like a title, UI queues to let the user know what to do, as well as the list of favorites, with which they can interact based on the specs in the README.md.

- **State Management** <br>
  Because the UI and the Map would affect one another, a synchronized state management was needed. This app is too tiny to bring in something like redux or even react context, so I opted for a few state variables and their setters held in the parent component `App`, and passed down as props to the `Map` and `UI` components.

## Packages added

- `node-sass`: because sass is easier than css
- `react-icons`: because everyone loves icons

## Interesting challenges

1.  **JSX in a popup?**<br>
    I initially wanted to have the UI such that when a user clicks on the map, and several options for points of interest (POI) close by appear as blue markers, that each marker would have an interactive popup. They could hover over the popup, and _within_ the popup would be a button to say "Add To Favorites". But, creating interactive popups in mapbox gl, while using react logic in the markup, is quite challenging! This was [initially an issue with react-leaflet](https://github.com/PaulLeCam/react-leaflet/issues/11), though it seems it [was resolved](https://stackoverflow.com/questions/42894803/rendering-react-components-inside-popup-of-react-leaflet-draw-drawn-layer-on-rea). Basically, JSX does not work in a mapbox popup.<br><br> In the interest of time, I made a compromise. I opted to simply show the information about each query result in a popup when the user hovers over the marker, and have that result be added to favorites when the user clicks the marker.

2.  **Functional components and closures**<br>
    You may notice that I chose to use functional components for `App` and `OverlayUI`. These are relatively simple components. I initially thought that a functional component would also prove useful for the `MapView`, as `useEffects` can help make communication between react state variables and external libraries easier. (And its sometimes clearner and easier to read than `componentDidUpdate` prop comparison statements.) But I was running into problems. On component mount, I create the map and set up a click handler to run a query for points of POI. Within the callback of that handler is a fetch. Within the fetch is a `.then`, and within the `.then`, makers are created, which get their _own_ event handlers, and within _those_ callbacks, I need to access the most recent state or prop variables. In this deepest level, my state variables were stale. This is because with so many callbacks, my state variables were encapsulated in multiple closures. Rather than spending too much time trying to make this work, I switched back to class components, where getting `this.props` or `this.state` always gives my latest values, even in nested closures.

3.  **Testing**:<br>
    This was probably the most challenging. Despite my experience with testing libraries like jest, mocha, chai, cypress, etc, this one threw me for a loop:
    ```javascript
    TypeError: window.URL.createObjectURL is not a function
    ```
    Ok, so clearly mapbox-gl is so browser-dependent that I can't create a breathing map instance to play with in a testing environment. This was also hinted at in the boilerplate test file, where `mapbox-gl`'s `Map` is a mock function. I suppose I never tried unit testing my web maps before. Unfortunately noneof the [mapbox-react-examples](https://github.com/mapbox/mapbox-react-examples) had _any_ unit tests, nor do the mapbox docs have any hints or guides for unit testing a mapbox map (I think Esri's [got us beat there](https://www.google.com/search?q=arcgis+js+api+unit+testing&oq=arcgis+js+api+unit+testing&aqs=chrome..69i57j0i22i30.3313j0j7&sourceid=chrome&ie=UTF-8)). [mapbox-gl-js-mock](https://github.com/mapbox/mapbox-gl-js-mock) looked promising until I saw the big <span style="color: darkred; font-weight: bold">FAILED</span> tag on there 😭. After spending \*way too\* much time on github and stack overflow, I was hard pressed to find a _single_ unit test written anywhere that actually set up a real map and tested its behavior in response to user actions.<br><br>
    Unfortunately I could not dedicate much more time to chasing this problem down the rabbit hole, for now. Based on my conversation with Eli Fitch, it seems the Mapbox team is pretty heavy on unit testing, so as a show of good faith, I wrote a handful of non-map-related unit tests for the `OverlayUI`.

### Other notes:

- I know the prompt said to add a POI to the list when the user clicks on the map, but that seemed like it may create a frustrating UX. What if they click the wrong thing? Instead of opted to query their click for 5 POI nearby, then give them the option to pick one to add to the list, or clear those options and try again.
