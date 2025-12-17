const coordinates = JSON.parse(campData);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/standard",
  config: {
    basemap: {
      lightPreset: "dawn",
    },
  },
  center: coordinates,
  zoom: 9,
});

map.addControl(new mapboxgl.NavigationControl());

const el = document.createElement("div");
el.className = "custom-marker";

el.style.backgroundImage = 'url("/campgroundMapPointer.png")';

const markerOffset = [0, -25];

const marker = new mapboxgl.Marker(el, { offset: markerOffset })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup().setHTML(`<h3>${campTitle}</h3><p>${campLocation}</p>`)
  )
  .addTo(map);
