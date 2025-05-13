import Spline from '@splinetool/react-spline';
import { useUnit } from 'effector-react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { ChipIcon } from './assets/chip-icon';
import { BackgroundVideo } from './components/layout/BackgroundVideo';
import { Header } from './components/layout/Header';
import { SectionsContainer } from './components/layout/SectionsContainer';
import { appMounted } from './models/app-model';
import { $activeSection, $animationPlaying, $sections } from './models/journey';

import { AudioLine } from './assets/audio-line';
import { AudioVilence } from './assets/audio-vilence';
import { Button } from './components/ui/Button';
import { cn } from './lib/utils';
import { $volume, volumeChanged } from './models/audio';
import './styles/sections.css';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        color: '#fff',
        overflow: 'hidden',
      }}>
      <Header />
      {children}
      <BackgroundVideo />
      <AudioContainer />
    </div>
  );
};

export const App = () => {
  const mountApp = useUnit(appMounted);

  useEffect(() => {
    mountApp();
  }, [mountApp]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <SectionsContainer />
            </AppLayout>
          }
        />
        <Route path="/spline" element={<SplineContainer />} />
      </Routes>
    </BrowserRouter>
  );
};

const SplineContainer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSplineLoad = () => {
    setLoading(false);
  };

  const handleSplineError = (e: Error | unknown) => {
    console.error('Spline error:', e);
    setError('Не удалось загрузить 3D модель');
    setLoading(false);
  };

  return (
    <div className="relative h-screen w-screen">
      {loading && (
        <div className="bg-opacity-50 absolute inset-0 z-10 flex items-center justify-center bg-black">
          <p className="text-xl text-white">Загрузка 3D модели...</p>
        </div>
      )}

      {error && (
        <div className="bg-opacity-80 absolute inset-0 z-10 flex flex-col items-center justify-center bg-black">
          <p className="mb-4 text-xl text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-white px-4 py-2 text-black">
            Попробовать снова
          </button>
        </div>
      )}

      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s' }}>
        <Spline
          scene="https://prod.spline.design/VAo5BWPUJeLtMWz0/scene.splinecode"
          onLoad={handleSplineLoad}
          onError={handleSplineError}
        />
      </div>
    </div>
  );
};

const AudioContainer = () => {
  const [showCurrentSection, setShowCurrentSection] = useState(1);

  const { changeVolume } = useUnit({
    changeVolume: volumeChanged,
  });

  const { currentSection, sections, isAnimationPlaying, volume } = useUnit({
    currentSection: $activeSection,
    sections: $sections,
    isAnimationPlaying: $animationPlaying,
    volume: $volume,
  });

  useEffect(() => {
    if (!isAnimationPlaying) {
      setShowCurrentSection(Number(currentSection.split('section').at(1)));
    }
  }, [isAnimationPlaying, currentSection]);

  const gradientText =
    'bg-gradient-to-t from-[#FFD01F] via-[#FFFD64] via-30% to-[#FFC61D] bg-clip-text text-transparent';

  return (
    <div className="fixed bottom-[1.6875rem] z-[999] flex h-[5.625rem] w-full items-center justify-between px-[3.75rem]">
      <div className="relative ml-[3.75rem] flex items-center justify-center">
        <ChipIcon
          className={cn('absolute', isAnimationPlaying && 'animate-ease-spin')}
        />
        <p className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white">
          <span className={gradientText}>{showCurrentSection}</span>/
          <span>{sections.length}</span>
        </p>
      </div>
      <AudioLine className="absolute inset-0 top-1/2" />
      <div className="absolute top-1/2 right-0 mr-[3.75rem] flex items-start justify-center gap-x-4">
        <p className="text-[1rem] font-medium">
          SOUND{' '}
          <span className={gradientText}>{volume === 0 ? 'OFF' : 'ON'}</span>
        </p>
        <Button
          onClick={() => changeVolume(volume === 0 ? 1 : 0)}
          variant="transparent"
          className="relative z-[999] cursor-pointer">
          <AudioVilence className="-translate-y-1/4" />
        </Button>
      </div>
    </div>
  );
};
