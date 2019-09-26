const Marionette = require('marionette')
import * as React from 'react'
import LocationEditorContainer from './location-editor-container'

const reactToMarionetteAdapter = Marionette.ItemView.extend({
  template(props) {
    return <LocationEditorContainer />
  },
})

export default reactToMarionetteAdapter
