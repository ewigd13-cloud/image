import React, { useState } from 'react';
import Camera from './components/Camera';

const App = () => {
  const [images, setImages] = useState<string[]>([]);
  const [overlayText, setOverlayText] = useState({
    vehicle: '',
    subject: '',
    type: '',
    date: '',
    record: '',
  });

  const handleCapture = (dataUrl: string) => {
    setImages(prev => [...prev, dataUrl]);
  };

  const handleChange = (key: string, value: string) => {
    setOverlayText(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 flex flex-col items-center gap-6">
      <Camera overlayText={overlayText} onCapture={handleCapture} />

      <div className="grid grid-cols-[80px_1fr] gap-2 w-full max-w-[640px]">
        {[
          ['設備', 'vehicle'],
          ['対象', 'subject'],
          ['種類', 'type'],
          ['日付', 'date'],
          ['', 'record'],
        ].map(([label, key]) => (
          <React.Fragment key={key}>
            <div className="text-right font-semibold pr-2">{label}</div>
            <input
              type="text"
              value={overlayText[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="border px-2 py-1 w-full"
            />
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 w-full max-w-[640px]">
        {images.map((src, i) => (
          <div key={i} className="aspect-[4/3] bg-gray-100 rounded overflow-hidden">
            <img src={src} alt={`img-${i}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;