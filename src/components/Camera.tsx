import React, { useRef, useEffect } from 'react';
import { FormState } from './InputPanel';

type Props = {
  onCapture: (dataUrl: string) => void;
  overlayText: FormState;
};

const Camera: React.FC<Props> = ({ onCapture, overlayText }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const boardX = 20;
    const boardY = canvas.height - 300;
    const cellWidth = 200;
    const cellHeight = 50;

    ctx.fillStyle = 'white';
    ctx.fillRect(boardX - 4, boardY - 4, cellWidth * 2 + 8, cellHeight * 5 + 8);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 2; col++) {
        const x = boardX + col * cellWidth;
        const y = boardY + row * cellHeight;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      }
    }

    const values = [
      overlayText.date,
      overlayText.vehicle,
      overlayText.type,
      overlayText.subject,
      overlayText.record,
      '', '', '', '', ''
    ];
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = 'black';
    values.forEach((text, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = boardX + col * cellWidth + 10;
      const y = boardY + row * cellHeight + 30;
      ctx.fillText(text, x, y);
    });

    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
  };

  return (
    <div className="flex w-full justify-center items-start gap-4">
      {/* カメラ映像・ホワイトボード・canvas を1つの relative コンテナにまとめる */}
      <div className="relative w-[60%] h-[240px] bg-black rounded overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* ホワイトボード枠（オーバーレイ） */}
        <div className="absolute bottom-4 left-4 z-10 bg-white p-2 rounded shadow grid grid-cols-2 grid-rows-5 gap-2 w-[420px]">
          <div className="border p-1 text-xs font-bold">{overlayText.date}</div>
          <div className="border p-1 text-xs font-bold">{overlayText.vehicle}</div>
          <div className="border p-1 text-xs font-bold">{overlayText.type}</div>
          <div className="border p-1 text-xs font-bold">{overlayText.subject}</div>
          <div className="border p-1 text-xs font-bold">{overlayText.record}</div>
          <div className="border p-1 text-xs font-bold">（空欄）</div>
          <div className="border p-1 text-xs font-bold">（空欄）</div>
          <div className="border p-1 text-xs font-bold">（空欄）</div>
          <div className="border p-1 text-xs font-bold">（空欄）</div>
          <div className="border p-1 text-xs font-bold">（空欄）</div>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* シャッターボタン */}
      <button
        onClick={handleCapture}
        className="h-[240px] w-[80px] bg-red-600 text-white rounded shadow flex items-center justify-center"
      >
        撮影
      </button>
    </div>
  );
};

export default Camera;