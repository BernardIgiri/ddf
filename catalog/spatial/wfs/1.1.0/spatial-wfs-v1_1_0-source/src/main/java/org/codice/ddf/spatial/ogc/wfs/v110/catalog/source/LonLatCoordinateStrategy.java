/**
 * Copyright (c) Codice Foundation
 *
 * <p>This is free software: you can redistribute it and/or modify it under the terms of the GNU
 * Lesser General Public License as published by the Free Software Foundation, either version 3 of
 * the License, or any later version.
 *
 * <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details. A copy of the GNU Lesser General Public
 * License is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 */
package org.codice.ddf.spatial.ogc.wfs.v110.catalog.source;

import static java.util.Arrays.asList;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Envelope;
import java.util.List;

class LonLatCoordinateStrategy implements CoordinateStrategy {
  @Override
  public String toString(final Coordinate coordinate) {
    return coordinate.x + "," + coordinate.y;
  }

  @Override
  public List<Double> lowerCorner(final Envelope envelope) {
    return asList(envelope.getMinX(), envelope.getMinY());
  }

  @Override
  public List<Double> upperCorner(final Envelope envelope) {
    return asList(envelope.getMaxX(), envelope.getMaxY());
  }
}
