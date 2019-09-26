import * as ol from 'openlayers'

const featureColor = (feature:ol.Feature) =>
  feature.get('hidden') ? 'rgba(0, 0, 0, 0)' : feature.get('color')

const STYLE:ol.StyleFunction = (feature:ol.Feature) =>
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: featureColor(feature),
      width: 2,
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0)',
    }),
    image: new ol.style.Circle({
      radius: 4,
      fill: new ol.style.Fill({
        color: featureColor(feature),
      }),
    }),
  })

export default STYLE
