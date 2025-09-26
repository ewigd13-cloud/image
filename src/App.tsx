import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import CameraPage from './CameraPage';
import SavedPage from './SavedPage';

function App() {
  // 撮影された画像を保存する状態
  const [savedImages, setSavedImages] = useState<string[]>([]);

  return (
    <BrowserRouter>
      <Routes>
        {/* カメラページ（撮影＋保存） */}
        <Route
          path="/"
          element={
            <CameraPage
              savedImages={savedImages}
              setSavedImages={setSavedImages}
            />
          }
        />

        {/* 保存ページ（画像一覧表示） */}
        <Route
          path="/saved"
          element={<SavedPage savedImages={savedImages} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;