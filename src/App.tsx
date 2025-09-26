import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import CameraPage from './CameraPage';
import SavedPage from './SavedPage';

function App() {
  const [savedImages, setSavedImages] = useState<string[]>([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <CameraPage
              savedImages={savedImages}
              setSavedImages={setSavedImages}
            />
          }
        />
        <Route
          path="/saved"
          element={<SavedPage savedImages={savedImages} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;