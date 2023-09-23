import { useLeafletContext, createControlComponent } from '@react-leaflet/core';
import L from 'leaflet';
import './Ruler.css';

function Ruler() {
  const context = useLeafletContext();
  const layer = L.layerGroup().addTo(context.map);
  const markers = [];
  let totalDistance = 0;
  let clickCount = 0;
  let enabled = false;

  const handleButtonClick = () => {
    enabled = !enabled;
    const container = context.map.getContainer();
    const buttonStyle = document.querySelector('.ruler-button');

    if (enabled) {
      container.style.cursor = 'crosshair';
      buttonStyle.classList.add('enabled');
      context.map.on('click', handleMapClick);
    } else {
      buttonStyle.classList.remove('enabled');
      container.style.cursor = '';
      context.map.off('click', handleMapClick);
      clickCount = 0;
      markers.length = 0;
      totalDistance = 0;
      layer.clearLayers();
    }
  };

  const handleMapClick = (e) => {
    clickCount++;
    if (clickCount === 1) {
      return;
    }

    const circleMarker = L.circleMarker(e.latlng, {
      color: 'red',
      radius: 2,
    });

    if (markers.length < 1) {
      markers.push(e.latlng);
      circleMarker.addTo(layer);
    } else {
      markers.push(e.latlng);
      const currentDistance = calculateDistance(
        markers[markers.length - 2],
        markers[markers.length - 1]
      );
      totalDistance += currentDistance;
      const text =
        totalDistance > 1
          ? `distance : ${totalDistance.toFixed(2)} km`
          : `distance : ${(totalDistance * 1000).toFixed(2)} m`;

      circleMarker
        .addTo(layer)
        .bindTooltip(text, { permanent: true, className: 'result-tooltip' });

      L.polyline(markers, {
        color: 'red',
        weight: 2,
        dashArray: '1,5',
        smoothFactor: 1,
      }).addTo(layer);
    }
  };

  const calculateDistance = (firstMarker, lastMarker) => {
    const EARTH_RADIUS_KM = 6371;
    const TO_RADIAN = Math.PI / 180;
    const deltaF = (lastMarker.lat - firstMarker.lat) * TO_RADIAN;
    const deltaL = (lastMarker.lng - firstMarker.lng) * TO_RADIAN;
    const angle =
      Math.sin(deltaF / 2) * Math.sin(deltaF / 2) +
      Math.cos(firstMarker.lat * TO_RADIAN) *
        Math.cos(lastMarker.lat * TO_RADIAN) *
        Math.sin(deltaL / 2) *
        Math.sin(deltaL / 2);
    const distance =
      2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle)) * EARTH_RADIUS_KM;

    return distance;
  };

  const createRulerControl = (props) => {
    const RulerControl = L.Control.extend({
      onAdd: function () {
        const container = L.DomUtil.create(
          'div',
          'leaflet-bar leaflet-control'
        );
        const button = L.DomUtil.create('button', 'ruler-button', container);
        L.DomEvent.on(button, 'click', handleButtonClick);
        return container;
      },
    });
    return new RulerControl(props);
  };

  const RulerControlComponent = createControlComponent(createRulerControl);

  return <RulerControlComponent position="topleft" />;
}

export default Ruler;
