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

    // 映像描画
    ctx.drawImage(video, 0, 0);

    // ホワイトボード枠の描画（2列×5行）
    const boardX = 20;
    const boardY = canvas.height - 300;
    const cellWidth = 200;
    const cellHeight = 50;

    // 背景（透過なし）
    ctx.fillStyle = 'white';
    ctx.fillRect(boardX - 4, boardY - 4, cellWidth * 2 + 8, cellHeight * 5 + 8);

    // 枠線
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 2; col++) {
        const x = boardX + col * cellWidth;
        const y = boardY + row * cellHeight;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      }
    }

    // テキスト描画
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
    <div className="flex flex-col items-center">
      {/* カメラとシャッターボタン横並び */}
      <div className="flex w-full justify-center items-start gap-4">
        <div className="relative w-[60%] h-[240px] bg-black rounded overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        <button
          onClick={handleCapture}
          className="h-[240px] w-[80px] bg-red-600 text-white rounded shadow flex items-center justify-center"
        >
          撮影
        </button>
      </div>

      {/* ホワイトボード枠（2列×5行） */}
      <div className="grid grid-cols-2 grid-rows-5 gap-2 mt-6 bg-white p-4 rounded shadow w-[90%] max-w-xl">
        <div className="border p-2 font-bold">{overlayText.date}</div>
        <div className="border p-2 font-bold">{overlayText.vehicle}</div>
        <div className="border p-2 font-bold">{overlayText.type}</div>
        <div className="border p-2 font-bold">{overlayText.subject}</div>
        <div className="border p-2 font-bold">{overlayText.record}</div>
        <div className="border p-2 font-bold">（空欄）</div>
        <div className="border p-2 font-bold">（空欄）</div>
        <div className="border p-2 font-bold">（空欄）</div>
        <div className="border p-2 font-bold">（空欄）</div>
        <div className="border p-2 font-bold">（空欄）</div>
      </div>
    </div>
  );
};

export default Camera;