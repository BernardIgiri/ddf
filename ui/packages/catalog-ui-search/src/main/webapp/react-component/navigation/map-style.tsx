import * as ol from 'openlayers'
import { geometry } from 'geospatialdraw'

const featureColor = (feature: ol.Feature, alpha: Number = 1) =>
  feature.get('hidden') ? 'rgba(0, 0, 0, 0)' : `rgba(200, 150, 0, ${alpha})`

const {
  CIRCLE_BUFFER_PROPERTY_VALUE,
  POLYGON_LINE_BUFFER_PROPERTY_VALUE,
  BUFFER_SHAPE_PROPERTY,
} = geometry

const LINE_WIDTH = 1.5
const POINT_SIZE = 2.5
const SCALE_FACTOR = 1.25

const RENDERER_STYLE = (feature: ol.Feature): ol.style.Style =>
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: featureColor(feature),
      width: LINE_WIDTH,
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0)',
    }),
    ...(feature.get(BUFFER_SHAPE_PROPERTY) === CIRCLE_BUFFER_PROPERTY_VALUE
      ? {}
      : {
          image: new ol.style.Circle({
            radius: POINT_SIZE,
            fill: new ol.style.Fill({
              color: featureColor(feature),
            }),
          }),
        }),
  })

const CIRCLE_DRAWING_STYLE = (feature: ol.Feature): ol.style.Style =>
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 0)',
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 0, 0)',
    }),
    image: new ol.style.Circle({
      radius: POINT_SIZE,
      fill: new ol.style.Fill({
        color: featureColor(feature),
      }),
    }),
  })

const CIRCLE_BUFFER_PROPERTY_VALUE_DRAWING_STYLE = (
  feature: ol.Feature
): ol.style.Style =>
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: featureColor(feature),
      width: LINE_WIDTH * SCALE_FACTOR,
    }),
    fill: new ol.style.Fill({
      color: featureColor(feature, 0.05),
    }),
  })

const GENERIC_DRAWING_STYLE = (feature: ol.Feature): ol.style.Style[] => [
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: featureColor(feature),
      width: LINE_WIDTH * SCALE_FACTOR,
    }),
    fill: new ol.style.Fill({
      color: featureColor(feature, 0.05),
    }),
    ...(feature.getGeometry().getType() === 'Point' && feature.get('buffer') > 0
      ? {}
      : {
          image: new ol.style.Circle({
            radius: POINT_SIZE * SCALE_FACTOR,
            fill: new ol.style.Fill({
              color: featureColor(feature),
            }),
          }),
        }),
  }),
  new ol.style.Style({
    image: new ol.style.Circle({
      radius: POINT_SIZE,
      fill: new ol.style.Fill({
        color: featureColor(feature),
      }),
    }),
    geometry: (feature: ol.Feature): ol.geom.Geometry => {
      const geometry = feature.getGeometry()
      let coordinates: [number, number][] = []
      if (geometry.getType() === 'Polygon') {
        coordinates = (geometry as ol.geom.Polygon).getCoordinates()[0]
      } else if (geometry.getType() === 'LineString') {
        coordinates = (geometry as ol.geom.LineString).getCoordinates()
      }
      return new ol.geom.MultiPoint(coordinates)
    },
  }),
]

const DRAWING_STYLE = (
  feature: ol.Feature
): ol.style.Style[] | ol.style.Style => {
  if (feature.getGeometry().getType() === 'Circle') {
    return CIRCLE_DRAWING_STYLE(feature)
  } else {
    const bufferShape = feature.get(BUFFER_SHAPE_PROPERTY)
    switch (bufferShape) {
      case POLYGON_LINE_BUFFER_PROPERTY_VALUE:
        return RENDERER_STYLE(feature)
      case CIRCLE_BUFFER_PROPERTY_VALUE:
        return CIRCLE_BUFFER_PROPERTY_VALUE_DRAWING_STYLE(feature)
      default:
        return GENERIC_DRAWING_STYLE(feature)
    }
  }
}

export { RENDERER_STYLE, DRAWING_STYLE }
