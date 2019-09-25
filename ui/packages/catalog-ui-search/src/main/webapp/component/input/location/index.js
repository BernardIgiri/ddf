const Marionette = require('marionette')
import * as React from 'react'
import LocationEditor from './location-editor'
import { GEOMETRY_ID } from './constants'
import { geometry, shapes, coordinates } from 'geospatialdraw'

const reactToMarionetteAdapter = Marionette.ItemView.extend({
  template(props) {
    const {
      geo = geometry.makeEmptyGeometry(GEOMETRY_ID, 'Polygon'),
      shape = 'Polygon',
      coordinateUnit = coordinates.LAT_LON,
      hasKeyword = false,
      keyword = ''
    } = (props.value || {})
    const onUpdateGeo = geo => {
      this.model.set('value', {
        geo,
        shape,
        coordinateUnit,
        hasKeyword,
        keyword
      })
    }
    return (
      <LocationEditor
        hasKeyword={hasKeyword}
        keyword={keyword}
        geo={geo}
        shape={shape}
        coordinateUnit={coordinateUnit}
        onUpdateGeo={onUpdateGeo}
      />
    )
  },
})

export default reactToMarionetteAdapter
