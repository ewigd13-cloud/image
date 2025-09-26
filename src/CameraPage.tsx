import React, { useState } from 'react';
import Camera from './components/Camera'; // ← Camera.tsx が src/components にある場合
import InputPanel from './components/InputPanel'; // ← InputPanel.tsx も同じく
import { useNavigate } from 'react-router-dom';

type Props = {
  savedImages: string[];
  setSavedImages: React.Dispatch<React.SetStateAction<string[]>>;
};

const CameraPage: React.FC<Props> = ({ savedImages, setSavedImages }) => {
  const [formState, setFormState] = useState({
    vehicle: '',
    subject: '',
    type: '',
    date: '',
    record: '',
  });

  const navigate = useNavigate();

  const handleCapture = (dataUrl: string) => {
    setSavedImages([...savedImages, dataUrl]); // 自動保存
  };

  return (
    <main className="flex flex-col items-center gap-8 p-4">
      <Camera onCapture={handleCapture} overlayText={formState} />
      <InputPanel formState={formState} setFormState={setFormState} />
      <button
        onClick={() => navigate('/saved')}
        className="px-4 py-2 bg-green-600 text-white rounded shadow"
      >
        保存ページへ
      </button>
    </main>
  );
};

export default CameraPage;