const Marionette = require('marionette')
import { GEOMETRY_ID } from './constants'
import * as React from 'react'
import LocationEditorContainer from './location-editor-container'

const reactToMarionetteAdapter = Marionette.ItemView.extend({
  template() {
    return <LocationEditorContainer />
  },
})

export { GEOMETRY_ID }
export default reactToMarionetteAdapter
