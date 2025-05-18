import {
  VIDEO_BACKWARD_ID,
  VIDEO_BACKWARD_SOURCE,
  VIDEO_FORWARD_ID,
  VIDEO_FORWARD_SOURCE,
} from '@/constants';
import { timeUpdated, videoElementMounted } from '@/models/video';
import { useUnit } from 'effector-react';
import { useEffect } from 'react';

export const BackgroundVideo: React.FC = () => {
  const mountVideo = useUnit(videoElementMounted);
  const { handleTimeUpdate } = useUnit({
    handleTimeUpdate: timeUpdated,
  });

  useEffect(() => {
    mountVideo();
  }, [mountVideo]);

  return (
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
        <source src={VIDEO_FORWARD_SOURCE} type="video/mp4" />
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
        <source src={VIDEO_BACKWARD_SOURCE} type="video/mp4" />
        Ваш браузер не поддерживает видео-тег.
      </video>
    </>
  );
};
