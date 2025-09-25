import { useRef, useEffect, useState } from 'react';

const Camera = ({ onCapture }: { onCapture: (dataUrl: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    });
  }, []);

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    const timer = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(timer);
        setCountdown(null);
        capture();
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      onCapture(dataUrl);
    }
  };

  return (
    <div className="relative">
      {countdown !== null && (
        <div className="countdown-overlay">{countdown}</div>
      )}
      <video ref={videoRef} className="w-full rounded shadow" />
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={startCountdown}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        撮影する
      </button>
    </div>
  );
};

export default Camera;