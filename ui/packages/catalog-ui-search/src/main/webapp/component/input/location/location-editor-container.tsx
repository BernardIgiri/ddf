import * as React from 'react'
import LocationEditor from './location-editor'
import { geometry, shapes, coordinates } from 'geospatialdraw'
import * as map from '../../../js/events/map'
const wreqr = require('../../../js/wreqr.js')

type State = {
  hasKeyword: boolean
  keyword?: string
  geo: geometry.GeometryJSON | null
  shape: shapes.Shape
  coordinateUnit: coordinates.CoordinateUnit
  isDrawing: boolean
}

type Props = {
  keyword?: string
  geo?: geometry.GeometryJSON
}

class LocationEditorContainer extends React.Component<Props, State> {
  onUpdateGeo: (geo: geometry.GeometryJSON) => void
  onChangeLocationType: (locationType: string) => void
  onChangeCoordinateUnit: (coordinateUnit: coordinates.CoordinateUnit) => void
  onDraw: () => void
  onDrawEnd: (geo: geometry.GeometryJSON | null) => void
  onSetShape: (shape: shapes.Shape | null) => void
  constructor(props: Props) {
    super(props)
    this.state = {
      hasKeyword: false,
      keyword: '',
      geo: null,
      shape: 'Polygon',
      coordinateUnit: coordinates.LAT_LON,
      isDrawing: false,
    }
    this.onDrawEnd = (geo: geometry.GeometryJSON | null = null) => {
      if (geo !== null) {
        this.setState({ isDrawing: false, geo })
      }
    }
    this.onSetShape = (shape: shapes.Shape | null = null) => {
      if (shape !== null) {
        this.setState({ shape })
      }
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
        const geo = null
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
      this.setState({ isDrawing: true }, () => {
        wreqr.vent.trigger(map.DRAW_START, this.state.shape, this.state.geo)
      })
    }
  }
  cancelDrawing() {
    if (this.state.isDrawing) {
      this.setState({ isDrawing: false }, () => {
        wreqr.vent.trigger(map.DRAW_END)
      })
    }
  }
  componentDidMount() {
    const { keyword = this.state.keyword, geo = this.state.geo } = this.props
    this.setState({
      keyword,
      geo,
    })
    wreqr.vent.on(map.DRAW_END, this.onDrawEnd)
    wreqr.vent.on(map.SET_SHAPE, this.onSetShape)
  }
  componentWillUnmount() {
    wreqr.vent.off(map.DRAW_END, this.onDrawEnd)
    wreqr.vent.off(map.SET_SHAPE, this.onSetShape)
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
