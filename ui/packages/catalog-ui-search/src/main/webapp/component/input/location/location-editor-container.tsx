import * as React from 'react'
import LocationEditor from './location-editor'
import { GEOMETRY_ID } from './constants'
import { geometry, shapes, coordinates } from 'geospatialdraw'
const wreqr = require('../../../js/wreqr.js')

const DRAW_START_PREFIX = 'search:draw'
const DRAW_END_COMMAND = 'search:drawend'

type State = {
  hasKeyword: boolean
  keyword?: string
  geo: geometry.GeometryJSON
  shape: shapes.Shape
  coordinateUnit: coordinates.CoordinateUnit
  isDrawing: boolean
}

type Props = {
  keyword?: string
  geo?: geometry.GeometryJSON
}

const makeDefaultGeo = () => geometry.makeEmptyGeometry(GEOMETRY_ID, 'Polygon')

class LocationEditorContainer extends React.Component<Props, State> {
  onUpdateGeo: (geo: geometry.GeometryJSON) => void
  onChangeLocationType: (locationType: string) => void
  onChangeCoordinateUnit: (coordinateUnit: coordinates.CoordinateUnit) => void
  onDraw: () => void
  constructor(props: Props) {
    super(props)
    this.state = {
      hasKeyword: false,
      keyword: '',
      geo: makeDefaultGeo(),
      shape: 'Polygon',
      coordinateUnit: coordinates.LAT_LON,
      isDrawing: false,
    }
    this.onUpdateGeo = geo => {
      this.setState({ geo })
    }
    this.onChangeLocationType = locationType => {
      this.cancelDrawing()
      if (locationType === 'Keyword') {
        this.setState({ hasKeyword: true })
      } else {
        const shape = locationType as shapes.Shape
        const geo = geometry.makeEmptyGeometry(GEOMETRY_ID, shape)
        this.setState({
          hasKeyword: false,
          shape,
          geo,
        })
      }
    }
    this.onChangeCoordinateUnit = (
      coordinateUnit: coordinates.CoordinateUnit
    ) => {
      this.setState({ coordinateUnit })
    }
    this.onDraw = () => {
      let drawCommand = DRAW_START_PREFIX
      switch (this.state.shape) {
        case 'Line': {
          drawCommand += 'line'
          break
        }
        case 'Polygon': {
          drawCommand += 'poly'
          break
        }
        case 'Bounding Box': {
          drawCommand += 'bbox'
          break
        }
        case 'Point Radius': {
          drawCommand += 'circle'
          break
        }
        default: {
          throw new Error(`Invalid shape "${this.state.shape}"!`)
        }
      }
      this.setState({ isDrawing: true }, () => {
        wreqr.vent.trigger(drawCommand, this.state.geo)
      })
    }
  }
  cancelDrawing() {
    if (this.state.isDrawing) {
      this.setState({ isDrawing: false }, () => {
        wreqr.vent.trigger(DRAW_END_COMMAND)
      })
    }
  }
  componentDidMount() {
    const { keyword = this.state.keyword, geo = this.state.geo } = this.props
    this.setState({
      keyword,
      geo,
    })
  }
  componentDidUpdate(prevProps: Props) {
    if (
      this.props.keyword !== undefined &&
      prevProps.keyword !== this.props.keyword &&
      this.props.keyword !== this.state.keyword
    ) {
      this.setState({ keyword: this.props.keyword })
    }
    if (
      this.props.geo !== undefined &&
      prevProps.geo !== this.props.geo &&
      this.props.geo !== this.state.geo
    ) {
      this.setState({ geo: this.props.geo })
    }
  }
  render() {
    return (
      <LocationEditor
        {...this.state}
        onUpdateGeo={this.onUpdateGeo}
        onChangeLocationType={this.onChangeLocationType}
        onChangeCoordinateUnit={this.onChangeCoordinateUnit}
        onDraw={this.onDraw}
      />
    )
  }
}

export default LocationEditorContainer
