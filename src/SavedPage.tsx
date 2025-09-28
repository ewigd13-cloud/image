import React, { useState } from 'react';

type Props = {
  onBack: () => void;
};

const SavedPage: React.FC<Props> = ({ onBack }) => {
  const [images, setImages] = useState<string[]>(
    JSON.parse(localStorage.getItem('capturedImages') || '[]')
  );

  const handleDelete = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
    localStorage.setItem('capturedImages', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (confirm('すべての保存画像を削除しますか？')) {
      setImages([]);
      localStorage.removeItem('capturedImages');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="px-4 py-2 bg-gray-600 text-white rounded">
          戻る
        </button>
        <button onClick={handleClearAll} className="px-4 py-2 bg-red-600 text-white rounded">
          全削除
        </button>
      </div>

      {images.length === 0 ? (
        <p className="text-center text-gray-500">保存された画像はありません。</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {images.map((src, i) => (
            <div key={i} className="relative border rounded overflow-hidden">
              <img src={src} alt={`保存画像${i + 1}`} className="w-full h-auto" />
              <button
                onClick={() => handleDelete(i)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
              >
                削除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;