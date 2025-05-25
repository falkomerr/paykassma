import {
  MOBILE_BACKWARDS_SOURCE,
  MOBILE_FORWARDS_SOURCE,
  VIDEO_BACKWARD_ID,
  VIDEO_BACKWARD_SOURCE,
  VIDEO_FORWARD_ID,
  VIDEO_FORWARD_SOURCE,
} from '@/constants';
import { appMounted } from '@/models/app-model';
import { timeUpdated, videoElementMounted } from '@/models/video';
import { trackMediaQuery } from '@withease/web-api';
import { useUnit } from 'effector-react';
import { useEffect } from 'react';

const { $matches } = trackMediaQuery('(min-width: 1024px)', {
  setup: appMounted,
});

export const BackgroundVideo: React.FC = () => {
  const mountVideo = useUnit(videoElementMounted);
  const { handleTimeUpdate } = useUnit({
    handleTimeUpdate: timeUpdated,
  });

  const isDesktop = useUnit($matches);

  console.log('desktop', isDesktop);

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
            style={{ opacity: 1, visibility: 'visible' }}>
            <source src={VIDEO_FORWARD_SOURCE} type="video/mp4" />
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
            style={{ opacity: 1, visibility: 'visible' }}>
            <source src={VIDEO_BACKWARD_SOURCE} type="video/mp4" />
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
            style={{ opacity: 1, visibility: 'visible' }}>
            <source src={MOBILE_FORWARDS_SOURCE} type="video/mp4" />
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
            style={{ opacity: 1, visibility: 'visible' }}>
            <source src={MOBILE_BACKWARDS_SOURCE} type="video/mp4" />
            Ваш браузер не поддерживает видео-тег.
          </video>
        </>
      )}
    </>
  );
};
