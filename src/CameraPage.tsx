import React, { useState } from 'react';
import Camera from './components/Camera';
import InputPanel from './InputPanel';
import { useNavigate } from 'react-router-dom';

const CameraPage = ({ savedImages, setSavedImages }) => {
  const [formState, setFormState] = useState({
    vehicle: '',
    subject: '',
    type: '',
    date: '',
    record: '',
  });

  const navigate = useNavigate();

  const handleCapture = (dataUrl: string) => {
    setSavedImages([...savedImages, dataUrl]);
  };

  return (
    <main className="flex flex-col items-center gap-8">
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