import React, { useRef, useEffect, useState } from 'react';

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  return (
    <div className="relative w-[600px] h-[400px] bg-black overflow-hidden">
      {/* カメラ映像 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ホワイトボード枠（左下） */}
      <div
        className="absolute bottom-4 left-4 bg-white border shadow"
        style={{
          width: `${160 * scale}px`,
          height: `${400 * scale}px`,
          fontSize: `${12 * scale}px`,
          display: 'grid',
          gridTemplateColumns: '80px 1fr',
          gridTemplateRows: 'repeat(5, 1fr)',
        }}
      >
        <div className="border flex items-center justify-center bg-gray-100">設備</div>
        <div className="border flex items-center justify-center">A</div>
        <div className="border flex items-center justify-center bg-gray-100">対象</div>
        <div className="border flex items-center justify-center">B</div>
        <div className="border flex items-center justify-center bg-gray-100">種類</div>
        <div className="border flex items-center justify-center">C</div>
        <div className="border flex items-center justify-center bg-gray-100">日付</div>
        <div className="border flex items-center justify-center">D</div>
        <div className="border flex items-center justify-center bg-gray-100">備考</div>
        <div className="border flex items-center justify-center">E</div>
      </div>

      {/* 拡大・縮小ボタン */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setScale(prev => Math.min(prev + 0.2, 3))}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          ＋拡大
        </button>
        <button
          onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
          className="px-2 py-1 bg-gray-500 text-white rounded"
        >
          −縮小
        </button>
      </div>
    </div>
  );
};

export default Camera;