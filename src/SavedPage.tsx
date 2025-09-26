import React from 'react';

const SavedPage = ({ savedImages }: { savedImages: string[] }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold">保存された画像</h2>
      {savedImages.length === 0 ? (
        <p>まだ保存された画像はありません。</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {savedImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`保存画像${i + 1}`}
              className="border rounded shadow w-[320px]"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;