import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import exifr from 'exifr';

type ImageWithPos = {
  url: string;
  position: [number, number] | null;
}

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
  const [images, setImages] = useState<ImageWithPos[] | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages : ImageWithPos[] = [];

    for (const file of files) {
      const url = URL.createObjectURL(file);
      let position : [number, number] | null = null;
      
      try {
        const exifData = await exifr.gps(file);
        if (exifData.latitude && exifData.longitude) {
          position = [exifData.latitude, exifData.longitude];
        } else {
          position = null;
        }
      } catch (error) {
        console.error('EXIF 읽기 실패', error);
        position = null;
      }

      newImages.push({url, position});
    }

    setImages(newImages);
    console.log(images);
  };

  // [DEBUGGING]
  useEffect(() => console.log(images), [images]);

  return (
    <div>
      <input type='file' multiple onChange={handleFileChange} />
      <MapContainer center={[36, 127.7]} zoom={6.5} scrollWheelZoom={false} className={'map'}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {images?.filter((img) => img.position).map((img) => 
            <div>
              {/* <Recenter position={img.position!} /> */}
              <Marker
                position={img.position!}
                icon={L.icon({
                  iconUrl: img.url,
                  iconSize: [40, 40],
                  iconAnchor: [20, 40],
                  popupAnchor: [0, -40],
                })}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </div>
        )}
      </MapContainer>
    </div>
  )
}

export default App;