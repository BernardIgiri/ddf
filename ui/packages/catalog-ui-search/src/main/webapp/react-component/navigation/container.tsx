/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
import * as React from 'react'
import * as ol from 'openlayers'
import Navigation from './presentation'
import withListenTo, { WithBackboneProps } from '../backbone-container'
import { geometry, shapes } from 'geospatialdraw'
import { GEOMETRY_ID } from '../../component/input/location'

const store = require('../../js/store.js')
const wreqr = require('../../js/wreqr.js')
const sources = require('../../component/singletons/sources-instance.js')
const properties = require('../../js/properties.js')

const hasLogo = () => {
  return properties.showLogo && properties.ui.vendorImage !== ''
}

const hasUnavailable = () => {
  return sources.some(function(source: Backbone.Model) {
    return !source.get('available')
  })
}

const hasUnsaved = () => {
  return store.get('workspaces').some(function(workspace: any) {
    return !workspace.isSaved()
  })
}

const isDrawing = () => {
  return store.get('content').get('drawing')
}

const turnOffDrawing = () => {
  wreqr.vent.trigger('search:drawend', store.get('content').get('drawingModel'))
}

type Props = {
  routeDefinitions: object
} & WithBackboneProps

type State = {
  shape: shapes.Shape
  geo: geometry.GeometryJSON
  hasLogo: boolean
  hasUnavailable: boolean
  hasUnsaved: boolean
  isDrawing: boolean
  logo: string
}

class NavigationContainer extends React.Component<Props, State> {
  onCancel: () => void
  onOk: () => void
  onSetShape: (shape: shapes.Shape) => void
  onUpdate: (geo:geometry.GeometryJSON) => void
  constructor(props: Props) {
    super(props)
    this.state = {
      shape: 'Polygon',
      geo: geometry.makeEmptyGeometry(GEOMETRY_ID, 'Polygon'),
      hasLogo: hasLogo(),
      hasUnavailable: hasUnavailable(),
      hasUnsaved: hasUnsaved(),
      isDrawing: isDrawing(),
      logo: properties.ui.vendorImage,
    }
    // TODO fill these out
    this.onCancel = () => {

    }
    this.onOk = () => {

    }
    this.onSetShape = () => {

    }
    this.onUpdate = (_geo:geometry.GeometryJSON) => {

    }
  }
  componentDidMount() {
    this.props.listenTo(
      store.get('workspaces'),
      'change:saved update add remove',
      this.handleSaved.bind(this)
    )
    this.props.listenTo(sources, 'all', this.handleSources.bind(this))
    this.props.listenTo(
      store.get('content'),
      'change:drawing',
      this.handleDrawing.bind(this)
    )
  }
  handleSaved() {
    this.setState({
      hasUnsaved: hasUnsaved(),
    })
  }
  handleSources() {
    this.setState({
      hasUnavailable: hasUnavailable(),
    })
  }
  handleDrawing() {
    this.setState({
      isDrawing: isDrawing(),
    })
  }
  render() {
    // TODO somehow I need a reference to the openlayers map here
    const map = new ol.Map({})
    return (
      <Navigation
        shape={this.state.shape}
        map={map}
        geo={this.state.geo}
        onCancel={this.onCancel}
        onOk={this.onOk}
        onSetShape={this.onSetShape}
        onUpdate={this.onUpdate}
        isDrawing={this.state.isDrawing}
        hasUnavailable={this.state.hasUnavailable}
        hasUnsaved={this.state.hasUnsaved}
        hasLogo={this.state.hasLogo}
        logo={this.state.logo}
        turnOffDrawing={() => {
          turnOffDrawing()
        }}
        {...this.props}
      />
    )
  }
}

export default withListenTo(NavigationContainer)
