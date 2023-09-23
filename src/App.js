import { MapContainer, TileLayer } from 'react-leaflet';
import Ruler from '../src/ruler/Ruler';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100vh' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Ruler />
    </MapContainer>
  );
}

export default App;
