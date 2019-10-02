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
import * as mapCommands from '../../js/events/map'

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
  wreqr.vent.trigger(
    mapCommands.DRAW_END,
    store.get('content').get('drawingModel')
  )
}

type Props = {
  routeDefinitions: object
} & WithBackboneProps

type State = {
  shape: shapes.Shape
  geo: geometry.GeometryJSON | null
  originalGeo: geometry.GeometryJSON
  hasLogo: boolean
  hasUnavailable: boolean
  hasUnsaved: boolean
  isDrawing: boolean
  logo: string
  map: ol.Map | null
}

class NavigationContainer extends React.Component<Props, State> {
  onCancel: () => void
  onOk: () => void
  onSetShape: (shape: shapes.Shape) => void
  onUpdate: (geo: geometry.GeometryJSON) => void
  onStartDrawing: (shape: shapes.Shape, geo: geometry.GeometryJSON) => void
  onMapLoaded: () => void
  constructor(props: Props) {
    super(props)
    this.state = {
      // @ts-ignore
      map: window.g_OpenLayersMap || null,
      shape: 'Polygon',
      geo: null,
      originalGeo: geometry.makeEmptyGeometry(GEOMETRY_ID, 'Polygon'),
      hasLogo: hasLogo(),
      hasUnavailable: hasUnavailable(),
      hasUnsaved: hasUnsaved(),
      isDrawing: isDrawing(),
      logo: properties.ui.vendorImage,
    }
    // TODO fill these out
    this.onMapLoaded = () => {
      // @ts-ignore
      const map = window.g_OpenLayersMap || null
      this.setState({ map })
    }
    this.onCancel = () => {
      this.setState(
        {
          isDrawing: false,
        },
        () => {
          wreqr.vent.trigger(mapCommands.DRAW_END, this.state.originalGeo)
        }
      )
    }
    this.onOk = () => {
      this.setState(
        {
          isDrawing: false,
        },
        () => {
          wreqr.vent.trigger(mapCommands.DRAW_END, this.state.geo)
        }
      )
    }
    this.onSetShape = (shape: shapes.Shape) => {
      const geo = null
      const originalGeo = geometry.makeEmptyGeometry(GEOMETRY_ID, shape)
      this.setState({ geo, originalGeo, shape }, () => {
        wreqr.vent.trigger(mapCommands.SET_SHAPE, shape)
      })
    }
    this.onUpdate = (geo: geometry.GeometryJSON) => {
      this.setState({ geo })
    }
    this.onStartDrawing = (shape: shapes.Shape, geo: geometry.GeometryJSON) => {
      this.setState({ geo, originalGeo: geo, shape })
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
    wreqr.vent.on(mapCommands.DRAW_START, this.onStartDrawing)
    wreqr.vent.on(mapCommands.OL_MAP_LOADED, this.onMapLoaded)
  }
  componentWillUnmount() {
    wreqr.vent.off(mapCommands.DRAW_START, this.onStartDrawing)
    wreqr.vent.off(mapCommands.OL_MAP_LOADED, this.onMapLoaded)
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
    const {
      map,
      shape,
      geo,
      isDrawing,
      hasUnavailable,
      hasUnsaved,
      hasLogo,
      logo,
    } = this.state
    const { onCancel, onOk, onSetShape, onUpdate } = this
    return (
      <Navigation
        shape={shape}
        map={map}
        geo={geo}
        onCancel={onCancel}
        onOk={onOk}
        onSetShape={onSetShape}
        onUpdate={onUpdate}
        isDrawing={isDrawing}
        hasUnavailable={hasUnavailable}
        hasUnsaved={hasUnsaved}
        hasLogo={hasLogo}
        logo={logo}
        turnOffDrawing={() => {
          turnOffDrawing()
        }}
        {...this.props}
      />
    )
  }
}

export default withListenTo(NavigationContainer)
