import React, { useRef, useEffect, useState } from 'react';

type Props = {
  overlayText: {
    vehicle: string;
    subject: string;
    type: string;
    date: string;
    record: string;
  };
  scale: number;
  onCapture: (dataUrl: string) => void;
};

const Camera: React.FC<Props> = ({ overlayText, scale, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [overlayPos, setOverlayPos] = useState({ x: 20, y: 20 });

  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const boardW = 220 * scale;
  const boardH = 120 * scale;

  const lines = [
    `設備: ${overlayText.vehicle}`,
    `対象: ${overlayText.subject}`,
    `種類: ${overlayText.type}`,
    `日付: ${overlayText.date}`,
    `記録: ${overlayText.record}`,
  ];

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setReady(true);
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

    const maxX = container.width - boardW;
    const maxY = container.height - boardH;

    setOverlayPos({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleTouchEnd = () => {
    draggingRef.current = false;
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const words = text.split('');
    let line = '';
    const lines: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        lines.push(line);
        line = words[i];
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    return lines;
  };

  const getFittingFontSize = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxHeight: number
  ): number => {
    let fontSize = Math.floor(maxHeight * 0.8);
    while (fontSize > 6) {
      ctx.font = `${fontSize}px sans-serif`;
      const lines = wrapText(ctx, text, maxWidth);
      if (lines.length * fontSize * 1.2 <= maxHeight) break;
      fontSize--;
    }
    return fontSize;
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) return;

    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const videoAspect = vw / vh;
    const targetAspect = canvas.width / canvas.height;

    let sx = 0, sy = 0, sw = vw, sh = vh;
    if (videoAspect > targetAspect) {
      sw = vh * targetAspect;
      sx = (vw - sw) / 2;
    } else if (videoAspect < targetAspect) {
      sh = vw / targetAspect;
      sy = (vh - sh) / 2;
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    const x = overlayPos.x;
    const y = overlayPos.y;
    const w = boardW;
    const h = boardH;

    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    const itemHeight = h / lines.length;
    lines.forEach((text, i) => {
      const fontSize = getFittingFontSize(ctx, text, w - 20, itemHeight);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = 'black';
      const wrapped = wrapText(ctx, text, w - 20);
      wrapped.forEach((line, j) => {
        ctx.fillText(line, x + 10, y + i * itemHeight + (j + 1) * fontSize * 1.2);
      });
    });

    onCapture(canvas.toDataURL('image/png'));
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
          width: `${boardW}px`,
          height: `${boardH}px`,
          backgroundColor: 'white',
          border: '2px solid black',
          padding: '4px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          zIndex: 10,
          touchAction: 'none',
        }}
      >
        {lines.map((text, i) => {
          const itemHeight = boardH / lines.length;
          const maxWidth = boardW - 20;
          const fontSize = (() => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return 10;
            let size = Math.floor(itemHeight * 0.8);
            while (size > 6) {
              ctx.font = `${size}px sans-serif`;
              const wrapped = wrapText(ctx, text, maxWidth);
              if (wrapped.length * size * 1.2 <= itemHeight) break;
              size--;
            }
            return size;
          })();

          return (
            <div
              key={i}
              style={{
                height: `${itemHeight}px`,
                fontSize: `${fontSize}px`,
                lineHeight: '1.2',
                overflow: 'hidden',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}
            >
              {text}
            </div>
          );
        })}
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

