const Marionette = require('marionette')
import * as React from 'react'
import LocationEditor from './location-editor'
import {
  modelToGeo,
  modelToShape,
  modelToCoordinateUnit,
} from './model-to-geo-adapter'

const reactToMarionetteAdapter = Marionette.ItemView.extend({
  template(props) {
    const geoJSON = modelToGeo(props)
    const shape = modelToShape(props)
    const coordinateUnit = modelToCoordinateUnit(props)
    const onUpdateGeo = geo => console.log(geo)
    return (
      <LocationEditor
        hasKeyword={props.hasKeyword === true}
        keyword={props.keyword}
        geometry={geoJSON}
        shape={shape}
        coordinateUnit={coordinateUnit}
        onUpdateGeo={onUpdateGeo}
      />
    )
  },
})

export default reactToMarionetteAdapter
