import { ChangeEvent, useRef, useState } from 'react';
import { FFmpegService } from '../utils/ffmpegService';

export const VideoReverser = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalVideo, setOriginalVideo] = useState<string | null>(null);
  const [reversedVideo, setReversedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [startTime, setStartTime] = useState<number | undefined>(undefined);
  const [duration, setDuration] = useState<number | undefined>(undefined);

  const originalVideoRef = useRef<HTMLVideoElement>(null);
  const reversedVideoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Сбрасываем предыдущие результаты
    if (originalVideo) URL.revokeObjectURL(originalVideo);
    if (reversedVideo) URL.revokeObjectURL(reversedVideo);

    setOriginalVideo(URL.createObjectURL(file));
    setReversedVideo(null);
    setError(null);
    setStartTime(undefined);
    setDuration(undefined);
  };

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setStartTime(isNaN(value) ? undefined : value);
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setDuration(isNaN(value) ? undefined : value);
  };

  const processVideo = async () => {
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      setError('Пожалуйста, выберите видео файл');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Реверсируем видео
      const reversedVideoUrl = await FFmpegService.reverseVideo(
        file,
        startTime,
        duration,
      );

      setReversedVideo(reversedVideoUrl);
    } catch (err) {
      setError(
        `Ошибка при обработке видео: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold">Реверсирование видео</h1>

      <div className="mb-6">
        <label className="mb-2 block font-medium">
          Выберите видео файл
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            disabled={isProcessing}
          />
        </label>
      </div>

      {originalVideo && (
        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">Оригинальное видео:</h2>
          <video
            ref={originalVideoRef}
            src={originalVideo}
            controls
            className="max-h-80 w-full rounded bg-black object-contain"
          />

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-medium">
                Время начала (сек):
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={startTime ?? ''}
                  onChange={handleStartTimeChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                  disabled={isProcessing}
                />
              </label>
            </div>
            <div>
              <label className="mb-2 block font-medium">
                Длительность (сек):
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={duration ?? ''}
                  onChange={handleDurationChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                  disabled={isProcessing}
                />
              </label>
            </div>
          </div>

          <button
            onClick={processVideo}
            disabled={isProcessing}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:bg-blue-300">
            {isProcessing ? 'Обработка...' : 'Реверсировать видео'}
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {reversedVideo && (
        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold">Перевернутое видео:</h2>
          <video
            ref={reversedVideoRef}
            src={reversedVideo}
            controls
            className="max-h-80 w-full rounded bg-black object-contain"
          />

          <a
            href={reversedVideo}
            download="reversed-video.mp4"
            className="mt-4 inline-block rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none">
            Скачать видео
          </a>
        </div>
      )}
    </div>
  );
};
