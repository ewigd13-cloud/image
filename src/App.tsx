import React, { useRef, useState, useEffect } from 'react';
import { drawWhiteboard } from './utils/drawWhiteboard';
import { WhiteboardGridInput } from './components/WhiteboardGridInput';

const NUM_ROWS = 5;
const NUM_COLS = 2;

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [texts, setTexts] = useState<string[]>(() => {
    const initial = Array(NUM_ROWS * NUM_COLS).fill('');
    initial[0] = '設備';
    initial[2] = '対象';
    initial[4] = '種類';
    initial[6] = '日付';
    initial[8] = '会社名';
    initial[9] = 'キュッセキAQUA（株）';
    const today = new Date();
    initial[7] = today.toISOString().split('T')[0];
    return initial;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawWhiteboard(ctx, canvas.width, canvas.height, texts);
  }, [texts]);

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Whiteboard Photo Booth</h1>

      {/* Canvas表示 */}
      <div className="bg-black rounded-lg p-4 mb-6 shadow-lg">
        <canvas ref={canvasRef} width={800} height={600} className="border border-white" />
      </div>

      {/* 入力欄 */}
      <WhiteboardGridInput texts={texts} setTexts={setTexts} />
    </main>
  );
};

export default App;