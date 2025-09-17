require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend",
  "esri/widgets/LayerList",
  "esri/Camera"
], function(Map, SceneView, FeatureLayer, Legend, LayerList, Camera) {

  // Neighborhoods layer (extruded)
  const neighborhoodsLayer = new FeatureLayer({
    url: "https://services2.arcgis.com/bB9Y1bGKerz1PTl5/ArcGIS/rest/services/STL_Neighborhood/FeatureServer/0",
    title: "Neighborhoods",
    outFields: ["NHD_NAME", "U18_Pop", "Minority", "EcoDis"],
    renderer: {
      type: "simple",
      symbol: {
        type: "polygon-3d",
        symbolLayers: [{
          type: "extrude",
          material: { color: [100, 150, 240, 0.6] },
          edges: { type: "solid", color: [0, 0, 0, 0.5] }
        }]
      }
    },
    popupTemplate: {
      title: "{NHD_NAME}",
      content: `
        <b>Population under 18:</b> {U18_Pop}<br>
        <b>Minority %:</b> {Minority}<br>
        <b>Economic Disadvantage:</b> {EcoDis}
      `
    }
  });

  // Schools layer (3D points)
  const schoolsLayer = new FeatureLayer({
    url: "https://services2.arcgis.com/yL7v93RXrxlqkeDx/arcgis/rest/services/STL_City_Schools_2021_Students_6_6_2022/FeatureServer/0",
    title: "Schools",
    outFields: ["SchoolName", "Enroll_K12", "FRL_Pct", "School_Lev"],
    elevationInfo: { mode: "on-the-ground" },
    renderer: {
      type: "simple",
      symbol: {
        type: "point-3d",
        symbolLayers: [{
          type: "icon",
          size: 12,
          resource: { primitive: "sphere" },
          material: { color: "orange" }
        }]
      }
    },
    popupTemplate: {
      title: "{SchoolName}",
      content: `
        <b>School Level:</b> {School_Lev}<br>
        <b>Enrollment K-12:</b> {Enroll_K12}<br>
        <b>Free/Reduced Lunch %:</b> {FRL_Pct}
      `
    }
  });

  // Create map
  const map = new Map({
    basemap: "streets",
    ground: "world-elevation",
    layers: [neighborhoodsLayer, schoolsLayer]
  });

  // SceneView
  const view = new SceneView({
    container: "viewDiv",
    map: map,
    center: [-90.1994, 38.6270], // St. Louis
    zoom: 12,
    tilt: 45
  });

  // Widgets
  const legend = new Legend({ view });
  const layerList = new LayerList({ view });
  view.ui.add(legend, "bottom-left");
  view.ui.add(layerList, "top-right");

  // Center button
  stlCenter.addEventListener("click", () => {
    view.goTo({
      center: [-90.1994, 38.6270],
      zoom: 12,
      tilt: 45
    });
  });

});