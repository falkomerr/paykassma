import { useUnit } from 'effector-react';
import { useEffect } from 'react';
import './App.css';
import { BackgroundVideo } from './components/layout/BackgroundVideo';
import { SectionsContainer } from './components/layout/SectionsContainer';
import { appMounted } from './models/app-model';
import './styles/sections.css';

export const App = () => {
  const mountApp = useUnit(appMounted);

  useEffect(() => {
    mountApp();
  }, [mountApp]);

  return (
    <div
      style={{
        minHeight: '100vh',
        color: '#fff',
        overflow: 'hidden',
      }}>
      <SectionsContainer />
      <BackgroundVideo />
    </div>
  );
};
