import React, { useRef, useEffect, useState } from 'react';

type Props = {
  overlayText: {
    vehicle: string;
    subject: string;
    type: string;
    date: string;
    record: string;
  };
  onCapture: (dataUrl: string) => void;
};

const Camera: React.FC<Props> = ({ overlayText, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [overlayPos, setOverlayPos] = useState({ x: 20, y: 20 });

  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setReady(true);
          };
        }
      })
      .catch(err => {
        alert('カメラにアクセスできませんでした');
        console.error(err);
      });
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;

    draggingRef.current = true;
    offsetRef.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    const touch = e.touches[0];
    const container = videoRef.current?.getBoundingClientRect();
    if (!container) return;

    const newX = touch.clientX - container.left - offsetRef.current.x;
    const newY = touch.clientY - container.top - offsetRef.current.y;
    setOverlayPos({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    draggingRef.current = false;
  };

  const handleCapture = () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  const overlay = overlayRef.current;
  if (!video || !canvas || !overlay) return;

  // 表示サイズに合わせてCanvasを固定
  canvas.width = 640;
  canvas.height = 480;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 映像描画（表示サイズと一致）
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // オーバーレイ位置・サイズをそのまま使う
  const x = overlay.offsetLeft;
  const y = overlay.offsetTop;
  const w = overlay.offsetWidth;
  const h = overlay.offsetHeight;

  // ホワイトボード描画
  ctx.fillStyle = 'white';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  ctx.font = `${Math.round(h / 6)}px sans-serif`;
  ctx.fillStyle = 'black';
  ctx.textAlign = 'left';

  const lines = [
    `設備 ${overlayText.vehicle}`,
    `対象 ${overlayText.subject}`,
    `種類 ${overlayText.type}`,
    `日付 ${overlayText.date}`,
    ` ${overlayText.record}`,
  ];
  lines.forEach((text, i) => {
    ctx.fillText(text, x + 10, y + 20 + i * (h / 6));
  });

  const dataUrl = canvas.toDataURL('image/png');
  onCapture(dataUrl);
};

  return (
    <div className="relative w-full max-w-[640px] aspect-[4/3] bg-black rounded overflow-hidden">
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />

      <div
        ref={overlayRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'absolute',
          top: `${overlayPos.y}px`,
          left: `${overlayPos.x}px`,
          width: '220px',
          height: '120px',
          backgroundColor: 'white',
          border: '2px solid black',
          padding: '4px',
          fontSize: '10px',
          zIndex: 10,
          touchAction: 'none',
        }}
      >
        <div>設備: {overlayText.vehicle}</div>
        <div>対象: {overlayText.subject}</div>
        <div>種類: {overlayText.type}</div>
        <div>日付: {overlayText.date}</div>
        <div>記録: {overlayText.record}</div>
      </div>

      <button
        onClick={handleCapture}
        disabled={!ready}
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow z-20 ${
          ready ? 'bg-red-600 text-white' : 'bg-gray-400 text-gray-200'
        }`}
      >
        撮影
      </button>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Camera;