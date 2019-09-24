import * as React from 'react'
import { geometry, shapes, coordinates } from 'geospatialdraw'

type Props = {
  hasKeyword: boolean
  keyword?: string
  geoJSON: geometry.GeometryJSON
  shape: shapes.Shape
  coordinateUnit: coordinates.CoordinateUnit
  onUpdateGeo: (geo: geometry.GeometryJSON) => void
}

class LocationEditor extends React.Component<Props> {
  render() {
    const {
      hasKeyword,
      keyword,
      geoJSON,
      shape,
      coordinateUnit,
      onUpdateGeo,
    } = this.props
    let Editor: any
    if (hasKeyword) {
      // TODO add back keyword selector
      return keyword || null
    } else {
      switch (shape) {
        case 'Line': {
          Editor = coordinates.LineGeoEditor
          break
        }
        case 'Polygon': {
          Editor = coordinates.PolygonGeoEditor
          break
        }
        case 'Point Radius': {
          Editor = coordinates.CircleGeoEditor
          break
        }
        case 'Bounding Box': {
          Editor = coordinates.BBoxGeoEditor
          break
        }
      }
      return (
        <Editor
          geo={geoJSON}
          coordinateUnit={coordinateUnit}
          onUpdateGeo={onUpdateGeo}
        />
      )
    }
  }
}

export default LocationEditor
