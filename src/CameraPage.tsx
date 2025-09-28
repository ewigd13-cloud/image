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
  const dragRef = useRef<HTMLDivElement>(null);

  const [boardScale, setBoardScale] = useState(1);
  const [position, setPosition] = useState({ x: 20, y: 300 });

  const boardW = 220;
  const boardH = 120;
  const margin = 4;

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
  }, []);

  useEffect(() => {
    const el = dragRef.current;
    if (!el) return;

    const getRelativePosition = (clientX: number, clientY: number) => {
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return position;
      const scaledW = boardW * boardScale;
      const scaledH = boardH * boardScale;
      const x = Math.max(0, Math.min(clientX - rect.left - scaledW / 2, rect.width - scaledW));
      const y = Math.max(0, Math.min(clientY - rect.top - scaledH / 2, rect.height - scaledH));
      return { x, y };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setPosition(getRelativePosition(touch.clientX, touch.clientY));
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const move = (ev: MouseEvent) => setPosition(getRelativePosition(ev.clientX, ev.clientY));
      const up = () => {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', up);
      };
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
    };

    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('mousedown', handleMouseDown);

    return () => {
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('mousedown', handleMouseDown);
    };
  }, [boardScale]);

  const playShutterSound = () => {
    const audio = new Audio('/shutter.mp3');
    audio.play().catch(err => console.warn('シャッター音失敗:', err));
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2 || video.videoWidth === 0) {
      alert('カメラ映像がまだ読み込まれていません。');
      return;
    }

    playShutterSound();

    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);

    const boardX = position.x + margin;
    const boardY = position.y + margin;
    const scaledW = boardW * boardScale - margin * 2;
    const scaledH = boardH * boardScale - margin * 2;
    const cellHeight = scaledH / 5;
    const labelWidth = scaledW * 0.4;

    ctx.fillStyle = 'white';
    ctx.fillRect(boardX, boardY, scaledW, scaledH);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(boardX, boardY, scaledW, scaledH);
    ctx.beginPath();
    ctx.moveTo(boardX + labelWidth, boardY);
    ctx.lineTo(boardX + labelWidth, boardY + scaledH);
    ctx.stroke();

    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      const y = boardY + i * cellHeight;
      ctx.beginPath();
      ctx.moveTo(boardX, y);
      ctx.lineTo(boardX + scaledW, y);
      ctx.stroke();
    }

    const labels = ['設備', '対象', '種類', '日付', ''];
    const values = [
      overlayText.vehicle,
      overlayText.subject,
      overlayText.type,
      overlayText.date,
      overlayText.record,
    ];

    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.font = `bold ${Math.round(14 * boardScale)}px sans-serif`;

    for (let row = 0; row < 5; row++) {
      const y = boardY + row * cellHeight + cellHeight / 2;
      ctx.textAlign = 'center';
      ctx.fillText(labels[row], boardX + labelWidth / 2, y);
      ctx.textAlign = 'left';
      ctx.fillText(values[row], boardX + labelWidth + 4, y);
    }

    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[640px] mt-4">
      <div className="relative w-full aspect-[4/3] bg-black overflow-hidden rounded">
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
        <div
          ref={dragRef}
          style={{
            position: 'absolute',
            left: position.x + margin,
            top: position.y + margin,
            width: `${boardW * boardScale - margin * 2}px`,
            height: `${boardH * boardScale - margin * 2}px`,
            padding: `${margin}px`,
            backgroundColor: 'white',
            display: 'grid',
            gridTemplateColumns: '64px 1fr',
            gridTemplateRows: 'repeat(5, 1fr)',
            border: '2px solid black',
            zIndex: 10,
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          {[
            ['設備', overlayText.vehicle],
            ['対象', overlayText.subject],
            ['種類', overlayText.type],
            ['日付', overlayText.date],
            ['', overlayText.record],
          ].map(([label, value], i) => (
            <React.Fragment key={i}>
              <div className="border border-black flex items-center justify-center bg-gray-100 text-[10px] font-bold">{label}</div>
              <div className="border border-black flex items-center justify-center text-[10px] font-bold">{value}</div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <input
          type="range"
          min={70}
          max={150}
          value={Math.round(boardScale * 100)}
          onChange={(e) => setBoardScale(Number(e.target.value) / 100)}
          className="w-32"
        />
        <button onClick={handleCapture} className="px-4 py-2 bg-red-600 text-white rounded shadow">
          撮影
        </button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Camera;