import React from 'react';

interface WhiteboardGridInputProps {
  texts: string[];
  setTexts: (texts: string[]) => void;
}

const LABELS: { [key: number]: string } = {
  0: '設備',
  2: '対象',
  4: '種類',
  6: '日付',
  8: '会社名',
};

const INPUT_LABELS: { [key: number]: string } = {
  1: '設備',
  3: '対象',
  5: '種類',
  7: '日付',
  9: '会社名',
};

export const WhiteboardGridInput: React.FC<WhiteboardGridInputProps> = ({ texts, setTexts }) => {
  const handleTextChange = (index: number, value: string) => {
    const updated = [...texts];
    updated[index] = value;
    setTexts(updated);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-inner w-full max-w-3xl">
      <h2 className="text-center text-lg font-bold text-gray-700 mb-4">ホワイトボード入力欄</h2>
      <div className="grid grid-cols-[1fr_3fr] gap-x-4 gap-y-3">
        {texts.map((text, index) => (
          <React.Fragment key={index}>
            <label className="text-sm font-bold text-gray-700 text-right pt-2">
              {LABELS[index] || INPUT_LABELS[index]}
            </label>
            {index === 7 ? (
              <input
                type="date"
                value={text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white"
              />
            ) : (
              <textarea
                value={text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                rows={1}
                className="w-full px-3 py-2 border rounded-md bg-white resize-none"
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-6">
        <button
          onClick={() => alert('エクスポート処理をここに実装')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          エクスポート
        </button>
        <button
          onClick={() => alert('インポート処理をここに実装')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          インポート
        </button>
      </div>
    </div>
  );
};