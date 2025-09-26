import { useState, useEffect } from 'react';
import Camera from './components/Camera';
import InputPanel, { FormState } from './components/InputPanel';

const App = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>({
    record: '',
    subject: '',
    type: '',
    date: '',
    vehicle: '',
  });

  // 初期ロード時に localStorage から復元
  useEffect(() => {
    const saved = localStorage.getItem('photos');
    if (saved) setPhotos(JSON.parse(saved));
  }, []);

  const handleCapture = (dataUrl: string) => {
    const updated = [...photos, dataUrl];
    setPhotos(updated);
    localStorage.setItem('photos', JSON.stringify(updated));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Whiteboard Photo Booth</h1>

      {/* 入力欄 */}
      <InputPanel form={form} setForm={setForm} />

      {/* カメラとホワイトボード表示 */}
      <Camera onCapture={handleCapture} overlayText={form} />

      {/* 撮影画像一覧 */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {photos.map((url, i) => (
          <img key={i} src={url} className="rounded shadow" />
        ))}
      </div>
    </div>
  );
};

export default App;