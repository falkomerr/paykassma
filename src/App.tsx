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
import {
  $activeSection,
  $animationPlaying,
  $gateOpened,
  $sections,
} from './models/journey';

import { Hero } from './components/layout/Hero';
import { AudioVilence } from './components/ui/AudioVilence';
import { Button } from './components/ui/Button';
import { cn } from './lib/utils';
import { $volume, volumeChanged } from './models/audio';
import './styles/sections.css';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const isGateOpened = useUnit($gateOpened);
  const [fadeIn, setFadeIn] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [heroOpacity, setHeroOpacity] = useState(1);

  useEffect(() => {
    if (isGateOpened) {
      // Анимация исчезновения Hero
      setHeroOpacity(0);
      // Удаляем Hero из DOM через 1 секунду (длительность анимации)
      setTimeout(() => {
        setShowHero(false);
      }, 1000);

      // Анимация появления BackgroundVideo и AudioContainer
      setTimeout(() => {
        setFadeIn(true);
      }, 100);
    } else {
      setFadeIn(false);
      setShowHero(true);
      setHeroOpacity(1);
    }
  }, [isGateOpened]);

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      <Header />
      {showHero && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out"
          style={{ opacity: heroOpacity }}>
          <Hero />
        </div>
      )}
      {children}
      {isGateOpened && (
        <div
          className={`transition-opacity duration-1000 ease-in-out ${fadeIn ? '!opacity-100' : '!opacity-0'}`}>
          <SectionsContainer />
          <BackgroundVideo />
          <AudioContainer />
        </div>
      )}
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
    <div className="h-screen w-screen overflow-hidden bg-black">
      <Spline
        scene="https://prod.spline.design/VesmLhzpdoKoAkRX/scene.splinecode"
        className="scale-[1.125]"
      />
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
    <div className="fixed bottom-[1.6875rem] z-40 flex h-[5.625rem] w-full items-center justify-between px-[3.75rem]">
      <div className="relative z-50 ml-[2.75rem] flex items-center justify-center">
        <ChipIcon
          className={cn('absolute', isAnimationPlaying && 'animate-ease-spin')}
        />
        <p className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white">
          <span className={gradientText}>{showCurrentSection}</span>/
          <span>{sections.length}</span>
        </p>
      </div>
      <img
        src="/audio-line.svg"
        className="absolute inset-0 top-1/2 h-[3px] w-full translate-y-1/2"
        width={1802}
        height={3}
      />
      <div className="absolute top-1/2 right-0 z-50 mr-[3.75rem] flex -translate-y-[17.5%] items-start justify-center gap-x-4 object-cover">
        <p className="text-[1rem] font-medium">
          SOUND{' '}
          <span className={gradientText}>{volume === 0 ? 'OFF' : 'ON'}</span>
        </p>
        <Button
          onClick={() => changeVolume(volume === 0 ? 1 : 0)}
          variant="transparent"
          className="-[4rem] relative z-[999] size-[4rem] -translate-y-1/4 cursor-pointer">
          <AudioVilence />
        </Button>
      </div>
    </div>
  );
};
