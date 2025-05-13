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
  return (
    <div className="h-screen w-screen">
      <Spline scene="https://prod.spline.design/VAo5BWPUJeLtMWz0/scene.splinecode" />
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
