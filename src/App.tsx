import { useState } from 'react';
import Camera from './components/Camera';

const App = () => {
  const [photos, setPhotos] = useState<string[]>([]);

  const handleCapture = (dataUrl: string) => {
    const updated = [...photos, dataUrl];
    setPhotos(updated);
    localStorage.setItem('photos', JSON.stringify(updated));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Whiteboard Photo Booth</h1>
      <Camera onCapture={handleCapture} />
      <div className="grid grid-cols-2 gap-4 mt-6">
        {photos.map((url, i) => (
          <img key={i} src={url} className="rounded shadow" />
        ))}
      </div>
    </div>
  );
};

export default App;