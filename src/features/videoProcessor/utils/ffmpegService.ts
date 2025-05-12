import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// Инициализация FFmpeg
let ffmpeg: FFmpeg | null = null;

/**
 * Сервис для работы с FFmpeg
 */
export const FFmpegService = {
  /**
   * Загрузка FFmpeg
   */
  async load() {
    if (!ffmpeg) {
      ffmpeg = new FFmpeg();
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          'text/javascript',
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          'application/wasm',
        ),
      });
    }
    return ffmpeg;
  },

  /**
   * Реверсирует видео файл
   * @param videoFile - Файл видео для обработки
   * @param startTime - Время начала фрагмента (в секундах)
   * @param duration - Длительность фрагмента (в секундах)
   * @returns Объект URL для реверсированного видео
   */
  async reverseVideo(
    videoFile: File,
    startTime?: number,
    duration?: number,
  ): Promise<string> {
    try {
      const ffmpegInstance = await this.load();

      // Имя входного файла
      const inputFileName = 'input.mp4';

      // Имя выходного файла
      const outputFileName = 'output.mp4';

      // Загрузка файла в память FFmpeg
      await ffmpegInstance.writeFile(inputFileName, await fetchFile(videoFile));

      // Команды для FFmpeg
      let command = ['-i', inputFileName];

      // Если указано время начала и длительность, вырезаем фрагмент
      if (startTime !== undefined && duration !== undefined) {
        command = command.concat([
          '-ss',
          String(startTime),
          '-t',
          String(duration),
        ]);
      }

      // Добавляем команду для реверсирования видео
      command = command.concat([
        '-vf',
        'reverse', // Реверс видео
        '-af',
        'areverse', // Реверс аудио
        '-preset',
        'ultrafast',
        outputFileName,
      ]);

      // Запуск FFmpeg
      await ffmpegInstance.exec(command);

      // Чтение обработанного файла
      const data = await ffmpegInstance.readFile(outputFileName);

      // Создание URL для обработанного видео
      let blob: Blob;

      // Проверяем тип данных, возвращаемых FFmpeg
      if (typeof data === 'string') {
        // Если это строка, конвертируем её в Uint8Array
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(data);
        blob = new Blob([uint8Array], { type: 'video/mp4' });
      } else if (data instanceof Uint8Array) {
        // Если это уже Uint8Array, создаем Blob напрямую
        blob = new Blob([data], { type: 'video/mp4' });
      } else {
        throw new Error('Неподдерживаемый формат данных из FFmpeg');
      }

      const url = URL.createObjectURL(blob);

      // Очистка файлов
      await ffmpegInstance.deleteFile(inputFileName);
      await ffmpegInstance.deleteFile(outputFileName);

      return url;
    } catch (error) {
      console.error('Ошибка при обработке видео:', error);
      throw error;
    }
  },
};
