import { ChangeEvent, useState } from 'react';
import { ScrollReverseVideo } from './ScrollReverseVideo';

export const ScrollVideoPlayer = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверяем формат файла
    if (!file.type.startsWith('video/')) {
      setError('Пожалуйста, выберите видеофайл');
      return;
    }

    // Сбрасываем предыдущие результаты
    if (videoUrl) URL.revokeObjectURL(videoUrl);

    setVideoUrl(URL.createObjectURL(file));
    setError(null);
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold">Скролл Видео Плеер</h1>

      <div className="mb-6">
        <label className="mb-2 block font-medium">
          Выберите видео файл
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
          />
        </label>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {videoUrl && (
        <div className="mb-6">
          <div className="mb-6 rounded-md bg-blue-100 p-4 text-blue-700">
            <p>
              Скролльте вверх, чтобы видео проигрывалось в обратном порядке.
            </p>
            <p>Скролльте вниз, чтобы видео проигрывалось в обычном порядке.</p>
          </div>

          {/* Добавляем пустое пространство для возможности скролла */}
          <div className="h-[100vh]"></div>

          <ScrollReverseVideo
            videoSrc={videoUrl}
            className="max-h-[80vh] rounded bg-black object-contain"
          />

          {/* Добавляем пустое пространство внизу для скролла */}
          <div className="h-[100vh]"></div>
        </div>
      )}
    </div>
  );
};
