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
import styled from 'styled-components'
import { CustomElement } from '../styles/mixins'
import { ChangeBackground } from '../styles/mixins'
import { transparentize, readableColor } from 'polished'
import NavigationLeftComponent from '../navigation-left'
import NavigationRightComponent from '../navigation-right'
import Routes from '../routes'
import { menu, geometry, shapes } from 'geospatialdraw'
import MAP_STYLE from './map-style'

const { DrawingMenu } = menu

interface Props {
  shape: shapes.Shape
  map: ol.Map
  geo: geometry.GeometryJSON
  onCancel: () => void
  onOk: () => void
  onSetShape: (shape: shapes.Shape) => void
  onUpdate: (geoJSON:geometry.GeometryJSON) => void
  isDrawing: boolean
  hasUnavailable: boolean
  hasUnsaved: boolean
  hasLogo: boolean
  logo: string
  turnOffDrawing: Function
  routeDefinitions: object
}

const NavigationRight = styled.div`
  position: absolute;
  right: 0px;
  max-width: calc(4 * ${props => props.theme.minimumButtonSize} + 9rem);
  transition: width ${props => props.theme.coreTransitionTime} ease-in-out;
`

const NavigationMiddle = styled.div<Props>`
  width: ${props => {
    if (props.hasLogo) {
      if (props.hasUnavailable || props.hasUnsaved) {
        return `calc(100% - 6*${props.theme.minimumButtonSize} - 9rem - 1rem)`
      } else {
        return `calc(100% - 6*${props.theme.minimumButtonSize} - 9rem)`
      }
    } else if (props.hasUnavailable || props.hasUnsaved) {
      return `calc(100% - 5*${props.theme.minimumButtonSize} - 9rem - 1rem)`
    } else {
      return `calc(100% - 5*${props.theme.minimumButtonSize} - 9rem)`
    }
  }};
  overflow-x: auto;
  overflow-y: hidden;
  text-overflow: ellipsis;
`

const Navigation = styled.div`
  ${CustomElement} ${props =>
    ChangeBackground(props.theme.backgroundNavigation)}
    position: relative;
  vertical-align: top;
  overflow: hidden;
  white-space: nowrap;
  border-bottom: 1px solid
    ${props =>
      transparentize(0.9, readableColor(props.theme.backgroundNavigation))};

  > div {
    display: inline-block;
    vertical-align: top;
    font-size: ${props => props.theme.mediumFontSize};
    line-height: ${props =>
      props.theme.multiple(2, props.theme.minimumLineSize)};
    height: ${props => props.theme.multiple(2, props.theme.minimumLineSize)};
  }
`

const DrawingMenuContainer = styled.div`
  position: absolute;
  z-index: ${props => props.theme.zIndexMenubar};
  height: 100%;
  line-height: ${props => props.theme.multiple(2, props.theme.minimumLineSize)};
  width: 100%;
  transition: transform ${props => props.theme.coreTransitionTime} ease-in-out;
  transform: ${(props: Props) => {
    if (props.isDrawing) {
      return 'translateY(0%)'
    } else {
      return 'translateY(-100%)'
    }
  }};
`

export default (props: Props) => {
  const {
    shape,
    map,
    isDrawing,
    geo,
    onCancel,
    onOk,
    onSetShape,
    onUpdate,
    logo,
    hasLogo,
    hasUnavailable,
    hasUnsaved,
    routeDefinitions
  } = props
  return (
    <Navigation>
      <DrawingMenuContainer className="is-negative" {...props}>
        <DrawingMenu
        shape={shape}
        map={map}
        isActive={isDrawing}
        geometry={geo}
        onCancel={onCancel}
        onOk={onOk}
        onSetShape={onSetShape}
        onUpdate={onUpdate}
        mapStyle={MAP_STYLE}
        disabledShapes={['Point']}
        />
      </DrawingMenuContainer>
      <NavigationLeftComponent
        logo={logo}
        hasLogo={hasLogo}
        hasUnavailable={hasUnavailable}
        hasUnsaved={hasUnsaved}
      />
      <NavigationMiddle {...props}>
        <Routes isMenu={true} routeDefinitions={routeDefinitions} />
      </NavigationMiddle>
      <NavigationRight>
        <NavigationRightComponent />
      </NavigationRight>
    </Navigation>
  )
}
