import { geometry, shapes, coordinates } from 'geospatialdraw'
import { GEOMETRY_ID } from './constants'

type Mode = 'line' | 'poly' | 'circle' | 'bbox' | 'keyword'

type Model = {
  // drawing: boolean
  polygon: [number, number][]
  line: [number, number][]
  bbox: string
  lat: number
  lon: number
  hasKeyword: boolean
  keywordValue: string
  lineUnits: geometry.LengthUnit
  lineWidth: number
  polygonBufferUnits: geometry.LengthUnit
  polygonBufferWidth: number
  radiusUnits: geometry.LengthUnit
  radius: number
  locationType: 'latlon' | 'usng' | 'utmUps' | 'dms'
  mode: Mode
}

const modelToGeo = (model: Model): geometry.GeometryJSON => {
  switch (model.mode) {
    case 'line': {
      return geometry.makeLineGeo(
        GEOMETRY_ID,
        model.line,
        model.lineWidth,
        model.lineUnits
      )
    }
    case 'poly': {
      return geometry.makePolygonGeo(
        GEOMETRY_ID,
        model.polygon,
        model.polygonBufferWidth,
        model.polygonBufferUnits
      )
    }
    case 'circle': {
      return geometry.makePointRadiusGeo(
        GEOMETRY_ID,
        model.lat,
        model.lon,
        model.radius,
        model.radiusUnits
      )
    }
    case 'bbox': {
      const extent = model.bbox
        .split(',')
        .map(v => parseFloat(v)) as geometry.Extent
      return geometry.makeBBoxGeo(GEOMETRY_ID, extent)
    }
    case 'keyword': {
      if (model.hasKeyword) {
        const geoJSON = geometry.makePolygonGeo(
          GEOMETRY_ID,
          model.polygon,
          model.polygonBufferWidth,
          model.polygonBufferUnits
        )
        geoJSON.properties = {
          ...geoJSON.properties,
          keyword: model.keywordValue,
        }
        return geoJSON
      }
    }
  }
  return geometry.makeEmptyGeometry(GEOMETRY_ID, 'Polygon')
}

interface ModeShapeMap {
  [key: string]: shapes.Shape
}

const modeToShape: ModeShapeMap = {
  line: 'Line',
  poly: 'Polygon',
  circle: 'Point Radius',
  bbox: 'Bounding Box',
  keyword: 'Polygon',
}

const modelToShape = ({ mode }: Model): shapes.Shape =>
  modeToShape[mode] || 'Polygon'

interface LocationTypeCoordinateUniteMap {
  [key: string]: coordinates.CoordinateUnit
}

const locationTypeToCoordinateUnit: LocationTypeCoordinateUniteMap = {
  latlon: coordinates.LAT_LON,
  usng: coordinates.USNG,
  utmUps: coordinates.UTM,
  dms: coordinates.LAT_LON_DMS,
}

const modelToCoordinateUnit = ({
  locationType,
}: Model): coordinates.CoordinateUnit =>
  locationTypeToCoordinateUnit[locationType] || coordinates.LAT_LON

export { modelToGeo, modelToShape, modelToCoordinateUnit }
