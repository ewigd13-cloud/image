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

    const text = `${overlayText.date}\n${overlayText.vehicle}\n${overlayText.type} / ${overlayText.subject}\n${overlayText.record}`;
    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    const x = 20;
    let y = canvas.height - 120;
    text.split('\n').forEach(line => {
      ctx.strokeText(line, x, y);
      ctx.fillText(line, x, y);
      y += 36;
    });

    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
  };

  return (
    <div className="relative w-full h-[400px] bg-black rounded overflow-visible">
      {/* カメラ映像 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* ホワイトボード表示（リアルタイム） */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/80 p-2 rounded text-xs font-bold whitespace-pre-wrap leading-tight shadow-md pointer-events-none">
        {overlayText.date || overlayText.vehicle || overlayText.record
          ? `${overlayText.date}\n${overlayText.vehicle}\n${overlayText.type} / ${overlayText.subject}\n${overlayText.record}`
          : '（ホワイトボードに表示する内容が未入力です）'}
      </div>

      {/* 撮影ボタン */}
      <button
        onClick={handleCapture}
        className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow z-20"
      >
        撮影
      </button>

      {/* 非表示のcanvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Camera;