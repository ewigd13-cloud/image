import React, { useState, useEffect } from 'react';
import Camera from './Camera';

const InputPanel = () => {
  const [overlayText, setOverlayText] = useState({
    vehicle: '',
    subject: '',
    type: '',
    date: '',
    record: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('overlayText');
    if (saved) setOverlayText(JSON.parse(saved));
  }, []);

  const handleChange = (key: string, value: string) => {
    const updated = { ...overlayText, [key]: value };
    setOverlayText(updated);
    localStorage.setItem('overlayText', JSON.stringify(updated));
  };

  const handleCapture = (dataUrl: string) => {
    localStorage.setItem('capturedImage', dataUrl);
    window.location.href = '/saved';
  };

  return (
    <div className="max-w-[640px] mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">入力欄</h2>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {[
          ['設備', 'vehicle'],
          ['対象', 'subject'],
          ['種類', 'type'],
          ['日付', 'date'],
          ['    ', 'record'],
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

      <Camera overlayText={overlayText} onCapture={handleCapture} />

      <div className="mt-6 text-center">
        <button
          onClick={() => window.location.href = '/saved'}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow"
        >
          保存ページへ
        </button>
      </div>
    </div>
  );
};

export default InputPanel;