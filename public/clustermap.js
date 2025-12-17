mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/standard",
  config: {
    basemap: {
      lightPreset: "dawn",
    },
  },
  center: [-103.5917, 40.6699],
  zoom: 3,
});

map.addControl(new mapboxgl.NavigationControl());

map.on("load", () => {
  map.loadImage("/campgroundMapPointer.png", (error, image) => {
    if (error) throw error;
    map.addImage("custom-campground-icon", image);

    map.addSource("campgrounds", {
      type: "geojson",
      generateId: true,
      data: campData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "campgrounds",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#adff2f ",
          30,
          "#f1f075",
          50,
          "#FFDBBB ",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
        "circle-emissive-strength": 1,
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "campgrounds",
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    });

    map.addLayer({
      id: "unclustered-point",
      type: "symbol",
      source: "campgrounds",
      filter: ["!", ["has", "point_count"]],
      layout: {
        "icon-image": "custom-campground-icon",
        "icon-size": 0.05,
        "icon-padding": 10,
        "icon-anchor": "center",
        "icon-allow-overlap": true,
      },
    });

    //  click handler for the UNCLUSTERED points (custom markers)
    map.on("click", "unclustered-point", (e) => {
      const feature = e.features[0];
      const popuplayout = feature.properties.popuplayout;
      const coordinates = feature.geometry.coordinates.slice();

      new mapboxgl.Popup({ offset: 25 })
        .setLngLat(coordinates)
        .setHTML(popuplayout)
        .addTo(map);
    });

    // Click handler for CLUSTERS
    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties.cluster_id;
      map
        .getSource("campgrounds")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });

    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseenter", "unclustered-point", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "unclustered-point", () => {
      map.getCanvas().style.cursor = "";
    });
  });
});
