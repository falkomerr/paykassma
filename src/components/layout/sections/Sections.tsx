import { ReactNode, useEffect, useRef, useState } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children?: ReactNode;
  className?: string;
  showContent?: boolean;
}

export const Section = ({
  id,
  children,
  className = '',
  showContent = false,
}: SectionProps) => {
  // Упрощенное состояние для отслеживания анимации контента
  const [contentState, setContentState] = useState<
    'hidden' | 'showing' | 'exiting'
  >('hidden');

  // Реф для отслеживания предыдущего значения showContent
  const prevShowContentRef = useRef<boolean>(false);

  // Таймер для анимации исчезновения
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Обработка изменения showContent и управление анимациями
  useEffect(() => {
    // Проверяем, изменилось ли значение showContent
    if (prevShowContentRef.current !== showContent) {
      console.log(`[Секция ${id}] showContent изменился: ${showContent}`);

      // Обновляем ссылку на предыдущее значение
      prevShowContentRef.current = showContent;

      if (showContent) {
        // Показываем контент с анимацией
        setContentState('showing');
      } else if (contentState === 'showing') {
        // Запускаем анимацию исчезновения только если контент был виден
        setContentState('exiting');

        // Очищаем предыдущий таймер если он есть
        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

        // После завершения анимации исчезновения скрываем контент полностью
        exitTimerRef.current = setTimeout(() => {
          setContentState('hidden');
          exitTimerRef.current = null;
        }, 600); // Должно соответствовать длительности CSS анимации исчезновения
      }
    }
  }, [id, showContent, contentState]);

  // Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  return (
    <section
      id={id}
      className={`section relative z-10 flex h-screen w-full flex-col items-start justify-center px-[3.75rem] ${className}`}>
      <div
        className={`section-content ${
          contentState === 'showing'
            ? 'show-content'
            : contentState === 'exiting'
              ? 'exiting-content'
              : ''
        }`}>
        {children}
      </div>
    </section>
  );
};

export const Section1 = ({
  showAnimation,
  showContent = false,
}: {
  showAnimation?: boolean;
  showContent?: boolean;
}) => {
  return (
    <Section
      id="section1"
      title="Секция 1"
      showContent={showContent}
      className={showAnimation ? 'animated-section' : ''}>
      <ChapterText>Глава 1: Преимущества</ChapterText>
      <SectionText>
        Мы масштабируем <br /> вашу прибыль <br />
        <CarrotSpan>в Igaming</CarrotSpan>
      </SectionText>
    </Section>
  );
};

export const Section2 = ({
  showContent = false,
}: {
  showContent?: boolean;
}) => {
  return (
    <Section id="section2" title="Секция 2" showContent={showContent}>
      <SectionText>
        <CarrotSpan>Знаем ГЕО</CarrotSpan> с которых <br /> прямо сейчас идет{' '}
        <br /> профит
      </SectionText>
      <img
        src="/our-anwser.png"
        alt="our-anwser"
        className="aspect-square w-[17.9166666667vw]"
      />
    </Section>
  );
};

export const Section3 = ({
  showContent = false,
}: {
  showContent?: boolean;
}) => {
  return (
    <Section id="section3" title="Секция 3" showContent={showContent}>
      <SectionText>
        <CarrotSpan>Знаем ГЕО</CarrotSpan> с которых <br /> прямо сейчас идет{' '}
        <br /> профит
      </SectionText>
      <img
        src="/our-reklams.png"
        alt="our-reklams"
        className="aspect-square w-[17.9166666667vw]"
      />
    </Section>
  );
};

export const Section4 = ({
  showContent = false,
}: {
  showContent?: boolean;
}) => {
  return (
    <Section id="section4" title="Секция 4" showContent={showContent}>
      <SectionText>
        Более <CarrotSpan>300 офферов</CarrotSpan> <br /> от топовых
        рекламодателей <br /> в одном месте
      </SectionText>
      <img
        src="/our-advantages.png"
        alt="our-advantages"
        className="aspect-[596/270] w-[31.0166666667vw]"
      />
    </Section>
  );
};

export const Section5 = ({
  showContent = false,
}: {
  showContent?: boolean;
}) => {
  return (
    <Section id="section5" title="Секция 5" showContent={showContent}>
      <SectionText>
        <CarrotSpan>Усиливаем</CarrotSpan> бюджеты <br /> арбитражных команд
      </SectionText>
      <SectionDescription>
        Масштабируем ваши успешные связки предоставляя бюджеты <br /> для
        получения максимального профита с рекламной кампании
      </SectionDescription>
    </Section>
  );
};

export const ChapterText = ({ children }: { children: ReactNode }) => {
  return (
    <p className="bg-gradient-to-r from-[#FFD01F] via-[#FFFD64] via-30% to-[#FFC61D] bg-clip-text text-[1.3541666667vw] text-transparent">
      {children}
    </p>
  );
};

export const SectionText = ({ children }: { children: ReactNode }) => {
  return (
    <p className="daysone text-[2.8645833333vw] text-white uppercase drop-shadow-[0px_5.72px_48.66px_#FECF4D66]">
      {children}
    </p>
  );
};

export const CarrotSpan = ({ children }: { children: ReactNode }) => {
  return (
    <span className="bg-[linear-gradient(179.15deg,_#FBD804_-14.57%,_rgba(242,_101,_2,_0.98)_118.53%)] bg-clip-text text-transparent">
      {children}
    </span>
  );
};

export const SectionDescription = ({ children }: { children: ReactNode }) => {
  return (
    <p className="gilroy text-[1.0741666667vw] text-white uppercase drop-shadow-[0px_5.72px_48.66px_#FECF4D66]">
      {children}
    </p>
  );
};
