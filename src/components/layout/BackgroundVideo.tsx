import {
  MOBILE_BACKWARDS_SOURCE,
  MOBILE_FORWARDS_SOURCE,
  VIDEO_BACKWARD_ID,
  VIDEO_BACKWARD_SOURCE,
  VIDEO_FORWARD_ID,
  VIDEO_FORWARD_SOURCE,
} from '@/constants';
import { bgBackwardLoaded, bgLoaded } from '@/models/app-model';
import { timeUpdated, videoElementMounted } from '@/models/video';
import { useUnit } from 'effector-react';
import { useEffect } from 'react';
import { $matches } from './matches';

export const BackgroundVideo: React.FC = () => {
  const mountVideo = useUnit(videoElementMounted);
  const { handleTimeUpdate, loadVideo, loadVideoBackward } = useUnit({
    handleTimeUpdate: timeUpdated,
    loadVideo: bgLoaded,
    loadVideoBackward: bgBackwardLoaded,
  });

  const isDesktop = useUnit($matches);

  useEffect(() => {
    mountVideo();
  }, [mountVideo]);

  return (
    <>
      {isDesktop ? (
        <>
          <video
            id={VIDEO_FORWARD_ID}
            onTimeUpdate={(e) => {
              handleTimeUpdate((e.target as HTMLVideoElement).currentTime);
            }}
            className="fixed top-0 h-screen w-screen object-cover"
            playsInline
            muted
            preload="auto"
            onLoadedData={() => {
              loadVideo();
              console.log('forward loaded');
            }}
            src={VIDEO_FORWARD_SOURCE}
            style={{ opacity: 1, visibility: 'visible' }}>
            Ваш браузер не поддерживает видео-тег.
          </video>
          <video
            id={VIDEO_BACKWARD_ID}
            onTimeUpdate={(e) => {
              handleTimeUpdate((e.target as HTMLVideoElement).currentTime);
            }}
            className="absolute h-full w-full object-cover"
            playsInline
            muted
            preload="auto"
            src={VIDEO_BACKWARD_SOURCE}
            onLoadedData={() => {
              loadVideoBackward();
              console.log('backward loaded');
            }}
            style={{ opacity: 1, visibility: 'visible' }}>
            Ваш браузер не поддерживает видео-тег.
          </video>
        </>
      ) : (
        <>
          <video
            id={VIDEO_FORWARD_ID}
            onTimeUpdate={(e) => {
              handleTimeUpdate((e.target as HTMLVideoElement).currentTime);
            }}
            className="fixed top-0 left-0 h-screen w-screen object-cover"
            playsInline
            muted
            preload="auto"
            onLoadedData={() => {
              loadVideo();
            }}
            src={MOBILE_FORWARDS_SOURCE}
            style={{ opacity: 1, visibility: 'visible' }}>
            Ваш браузер не поддерживает видео-тег.
          </video>
          <video
            id={VIDEO_BACKWARD_ID}
            onTimeUpdate={(e) => {
              handleTimeUpdate((e.target as HTMLVideoElement).currentTime);
            }}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
            muted
            preload="auto"
            src={MOBILE_BACKWARDS_SOURCE}
            onLoadedData={() => {
              loadVideoBackward();
              console.log('backward loaded');
            }}
            style={{ opacity: 1, visibility: 'visible' }}>
            Ваш браузер не поддерживает видео-тег.
          </video>
        </>
      )}
    </>
  );
};
