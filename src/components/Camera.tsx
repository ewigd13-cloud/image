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

    // ラベルと値のペア
    const labels = ['設備', '対象', '種類', '日付', '備考'];
    const values = [
      overlayText.vehicle,
      overlayText.subject,
      overlayText.type,
      overlayText.date,
      overlayText.record,
    ];

    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = 'black';

    for (let row = 0; row < 5; row++) {
      // 左列：ラベル
      const labelX = boardX + 10;
      const labelY = boardY + row * cellHeight + 30;
      ctx.fillText(labels[row], labelX, labelY);

      // 右列：入力値
      const valueX = boardX + cellWidth + 10;
      ctx.fillText(values[row], valueX, labelY);
    }

    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
  };

  return (
    <div className="flex w-full justify-center items-start gap-4">
      {/* カメラ映像・ホワイトボード・canvas を1つの relative コンテナにまとめる */}
      <div className="relative w-[60%] h-[240px] bg-black rounded overflow-hidden">
        {/* カメラ映像 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* ホワイトボード枠（オーバーレイ） */}
        <div className="absolute bottom-4 left-4 z-10 bg-white p-2 rounded shadow grid grid-cols-2 grid-rows-5 gap-2 w-[420px] pointer-events-none">
          <div className="border p-1 text-xs font-bold bg-gray-100">設備</div>
          <div className="border p-1 text-xs font-bold">{overlayText.vehicle}</div>

          <div className="border p-1 text-xs font-bold bg-gray-100">対象</div>
          <div className="border p-1 text-xs font-bold">{overlayText.subject}</div>

          <div className="border p-1 text-xs font-bold bg-gray-100">種類</div>
          <div className="border p-1 text-xs font-bold">{overlayText.type}</div>

          <div className="border p-1 text-xs font-bold bg-gray-100">日付</div>
          <div className="border p-1 text-xs font-bold">{overlayText.date}</div>

          <div className="border p-1 text-xs font-bold bg-gray-100">備考</div>
          <div className="border p-1 text-xs font-bold">{overlayText.record}</div>
        </div>

        {/* canvas（非表示） */}
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