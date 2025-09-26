import React from 'react';

type Props = {
  savedImages: string[];
};

const SavedPage: React.FC<Props> = ({ savedImages }) => {
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h2 className="text-2xl font-bold">保存された画像</h2>
      {savedImages.length === 0 ? (
        <p className="text-gray-600">まだ保存された画像はありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`保存画像${i + 1}`}
              className="border rounded shadow w-full max-w-[320px]"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;