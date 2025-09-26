import React, { useRef, useEffect, useState } from 'react';
import { FormState } from './InputPanel';

type Props = {
  onCapture: (dataUrl: string) => void;
  overlayText: FormState;
};

const Camera: React.FC<Props> = ({ onCapture, overlayText }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boardScale, setBoardScale] = useState(1); // ホワイトボード枠の拡大倍率

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

    // ホワイトボード枠の描画
    const boardWidth = 160 * boardScale;
    const boardHeight = 400 * boardScale;
    const boardX = 20;
    const boardY = canvas.height - boardHeight - 20;
    const cellHeight = boardHeight / 5;
    const labelWidth = boardWidth * 0.4;
    const valueWidth = boardWidth * 0.6;

    ctx.fillStyle = 'white';
    ctx.fillRect(boardX - 2, boardY - 2, boardWidth + 4, boardHeight + 4);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    for (let row = 0; row < 5; row++) {
      const y = boardY + row * cellHeight;
      ctx.strokeRect(boardX, y, labelWidth, cellHeight);
      ctx.strokeRect(boardX + labelWidth, y, valueWidth, cellHeight);
    }

    const labels = ['設備', '対象', '種類', '日付', '備考'];
    const values = [
      overlayText.vehicle,
      overlayText.subject,
      overlayText.type,
      overlayText.date,
      overlayText.record,
    ];

    ctx.font = `${Math.round(14 * boardScale)}px sans-serif`;
    ctx.fillStyle = 'black';
    for (let row = 0; row < 5; row++) {
      const y = boardY + row * cellHeight + cellHeight / 2 + 5;
      ctx.fillText(labels[row], boardX + 8, y);
      ctx.fillText(values[row], boardX + labelWidth + 8, y);
    }

    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
  };

  return (
    <div className="flex w-full justify-center items-start gap-4">
      {/* カメラ映像とホワイトボード枠 */}
      <div className="relative w-[60%] h-[240px] bg-black rounded overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* ホワイトボード枠（オーバーレイ） */}
        <div
          className="absolute bottom-4 left-4 z-10 origin-bottom-left"
          style={{
            transform: `scale(${boardScale})`,
            transformOrigin: 'bottom left',
          }}
        >
          <div
            className="bg-white rounded shadow pointer-events-none"
            style={{
              width: '160px',
              height: '400px',
              fontSize: '12px',
              display: 'grid',
              gridTemplateColumns: '64px 1fr',
              gridTemplateRows: 'repeat(5, 1fr)',
              overflow: 'hidden',
            }}
          >
            {[
              ['設備', overlayText.vehicle],
              ['対象', overlayText.subject],
              ['種類', overlayText.type],
              ['日付', overlayText.date],
              ['備考', overlayText.record],
            ].map(([label, value], i) => (
              <React.Fragment key={i}>
                <div className="border flex items-center justify-center bg-gray-100">{label}</div>
                <div className="border flex items-center justify-center">{value}</div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* 撮影ボタンと拡大操作 */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleCapture}
          className="h-[240px] w-[80px] bg-red-600 text-white rounded shadow flex items-center justify-center"
        >
          撮影
        </button>

        <button
          onClick={() => setBoardScale(prev => Math.min(prev + 0.2, 3))}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          ＋拡大
        </button>
        <button
          onClick={() => setBoardScale(prev => Math.max(prev - 0.2, 0.5))}
          className="px-2 py-1 bg-gray-500 text-white rounded"
        >
          −縮小
        </button>
      </div>
    </div>
  );
};

export default Camera;