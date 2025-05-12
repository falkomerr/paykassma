import { useUnit } from 'effector-react';
import { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import { BackgroundVideo } from './components/layout/BackgroundVideo';
import { SectionsContainer } from './components/layout/SectionsContainer';
import { VideoReversePage } from './features/videoProcessor';
import { appMounted } from './models/app-model';
import './styles/sections.css';

export const App = () => {
  const mountApp = useUnit(appMounted);

  useEffect(() => {
    mountApp();
  }, [mountApp]);

  return (
    <BrowserRouter>
      <div className="fixed top-4 right-4 z-50">
        <nav className="rounded-lg bg-black/70 px-4 py-2 shadow-lg">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-white hover:text-blue-300">
                Главная
              </Link>
            </li>
            <li>
              <Link
                to="/video-reverse"
                className="text-white hover:text-blue-300">
                Реверс видео
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div
              style={{
                minHeight: '100vh',
                color: '#fff',
                overflow: 'hidden',
              }}>
              <SectionsContainer />
              <BackgroundVideo />
            </div>
          }
        />
        <Route path="/video-reverse" element={<VideoReversePage />} />
      </Routes>
    </BrowserRouter>
  );
};
