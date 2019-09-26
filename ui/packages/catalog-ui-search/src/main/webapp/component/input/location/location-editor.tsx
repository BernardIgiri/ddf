import * as React from 'react'
import { geometry, shapes, coordinates } from 'geospatialdraw'
const Button = require('../../../react-component/button')
const Dropdown = require('../../../react-component/dropdown')
const { Menu, MenuItem } = require('../../../react-component/menu')
import styled from 'styled-components'

const {
  LineGeoEditor,
  PolygonGeoEditor,
  CircleGeoEditor,
  BBoxGeoEditor,
} = coordinates

const TabRow = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-start;
`

const Tab = styled.div<{ isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.minimumFontSize};
  padding: ${({ theme }) => theme.minimumSpacing};
  cursor: pointer;
  color: black;
  background-color: white;
  border: 1px solid grey;
  border-bottom: 1px solid ${props => (props.isSelected ? 'white' : 'grey')};
  :hover {
    background-color: ${props => (props.isSelected ? 'white' : 'silver')};
  }
`

type LocationComponentProps = {
  keyword: string | null
  geo: geometry.GeometryJSON
  coordinateUnit: coordinates.CoordinateUnit
  onUpdateGeo: (geo: geometry.GeometryJSON) => void
}

type LocationType = 'Keyword' | shapes.Shape
type LocationTypeOption = {
  label: string
  Component: React.ComponentType<LocationComponentProps>
}
const locationTypeList: LocationType[] = [
  'Line',
  'Polygon',
  'Point Radius',
  'Bounding Box',
  'Keyword',
]

type Props = {
  hasKeyword: boolean
  keyword?: string
  geo: geometry.GeometryJSON
  shape: shapes.Shape
  coordinateUnit: coordinates.CoordinateUnit
  onUpdateGeo: (geo: geometry.GeometryJSON) => void
  onChangeLocationType: (locationType: LocationType) => void
  onChangeCoordinateUnit: (coordinateUnit: coordinates.CoordinateUnit) => void
  onDraw: () => void
}

class LocationEditor extends React.Component<Props> {
  locationDescriptiontMap: Map<LocationType, LocationTypeOption>

  constructor(props: Props) {
    super(props)
    this.locationDescriptiontMap = new Map()
    this.locationDescriptiontMap.set('Keyword', {
      label: 'Keyword',
      Component: ({ keyword, ...rest }) => <LineGeoEditor {...rest} />,
    })
    this.locationDescriptiontMap.set('Line', {
      label: 'Line',
      Component: ({ keyword, ...rest }) => <LineGeoEditor {...rest} />,
    })
    this.locationDescriptiontMap.set('Polygon', {
      label: 'Polygon',
      Component: ({ keyword, ...rest }) => <PolygonGeoEditor {...rest} />,
    })
    this.locationDescriptiontMap.set('Point Radius', {
      label: 'Point-Radius',
      Component: ({ keyword, ...rest }) => <CircleGeoEditor {...rest} />,
    })
    this.locationDescriptiontMap.set('Bounding Box', {
      label: 'Bounding Box',
      Component: ({ keyword, ...rest }) => <BBoxGeoEditor {...rest} />,
    })
  }
  renderTab(tabUnit: coordinates.CoordinateUnit): React.ReactNode {
    return (
      <Tab
        isSelected={tabUnit === this.props.coordinateUnit}
        onClick={() => this.props.onChangeCoordinateUnit(tabUnit)}
      >
        {tabUnit}
      </Tab>
    )
  }
  render() {
    const {
      hasKeyword,
      keyword,
      geo,
      shape,
      coordinateUnit,
      onUpdateGeo,
      onChangeLocationType,
      onDraw,
    } = this.props
    const locationType: LocationType = hasKeyword ? 'Keyword' : shape
    const locationOption = this.locationDescriptiontMap.get(locationType)
    const hasDrawing = locationType !== 'Keyword'
    if (locationOption === undefined) {
      throw new Error(`Invalid location type "${locationType}"!`)
    }
    const Editor = locationOption.Component
    return (
      <React.Fragment>
        <Dropdown label={locationOption.label || 'Select Location Option'}>
          <Menu value={locationType} onChange={onChangeLocationType}>
            {locationTypeList.map(key => (
              <MenuItem key={key} value={key}>
                {(this.locationDescriptiontMap.get(key) || { label: '' }).label}
              </MenuItem>
            ))}
          </Menu>
        </Dropdown>
        {
          hasDrawing ? (
            <TabRow>
              {this.renderTab(coordinates.LAT_LON)}
              {this.renderTab(coordinates.LAT_LON_DMS)}
              {this.renderTab(coordinates.USNG)}
              {this.renderTab(coordinates.UTM)}
            </TabRow>
          ) : null
        }
        <Editor
          keyword={keyword || null}
          geo={geo}
          coordinateUnit={coordinateUnit}
          onUpdateGeo={onUpdateGeo}
        />
        {
          hasDrawing ? (
            <Button className="location-draw is-primary" onClick={onDraw}>
              <span className="fa fa-globe" />
              <span>Draw</span>
            </Button>
          ) : null
        }
      </React.Fragment>
    )
  }
}

export default LocationEditor
