import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import exifr from 'exifr';

function Recenter({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return null;
}

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    setImageUrl(blobUrl);

    try {
      const exifData = await exifr.gps(file);
      if (exifData?.latitude && exifData?.longitude) {
        setPosition([exifData.latitude, exifData.longitude]);
      } else {
        console.log('GPS 정보 없음');
      }
    } catch (error) {
      console.error('EXIF 읽기 실패', error);
    }
  };

  const imageIcon = imageUrl
    ? L.icon({
        iconUrl: imageUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      })
    : undefined;

  return (
    <div>
      <input type='file' onChange={handleFileChange} />
      <MapContainer center={position || [37.5, 127]} zoom={13} scrollWheelZoom={false} className={'map'}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && (
          <>
            <Recenter position={position} />
            <Marker position={position} icon={imageIcon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  )
}

export default App;