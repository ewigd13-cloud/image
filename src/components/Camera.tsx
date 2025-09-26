import React, { useRef } from 'react';
import { FormState } from './InputPanel';

type Props = {
  onCapture: (dataUrl: string) => void;
  overlayText: FormState;
};

const Camera: React.FC<Props> = ({ onCapture, overlayText }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // カメラ起動
  React.useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  // 撮影処理（ホワイトボード文字列を合成）
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

    // ホワイトボード文字列描画
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
    <div className="relative w-full aspect-video bg-black rounded overflow-hidden">
      {/* カメラ映像 */}
      <video ref={videoRef} autoPlay playsInline className="absolute w-full h-full object-cover" />

      {/* ホワイトボード表示（リアルタイム） */}
      <div className="absolute bottom-4 left-4 bg-white/80 p-2 rounded text-xs font-bold whitespace-pre-wrap leading-tight z-10">
        {`${overlayText.date}\n${overlayText.vehicle}\n${overlayText.type} / ${overlayText.subject}\n${overlayText.record}`}
      </div>

      {/* 撮影ボタン */}
      <button
        onClick={handleCapture}
        className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow"
      >
        撮影
      </button>

      {/* 非表示のcanvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Camera;