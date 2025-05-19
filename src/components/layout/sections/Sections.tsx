import { goToNextSection, goToPrevSection } from '@/models/journey';
import { useUnit } from 'effector-react';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children?: ReactNode;
  className?: string;
}

export const Section = ({ children, className = '' }: SectionProps) => {
  return (
    <section
      className={`relative z-50 flex h-fit h-screen w-fit flex-col items-start justify-center gap-y-6 px-[3.75rem] ${className}`}>
      <div>{children}</div>
    </section>
  );
};

export const FeatureBlock = ({ children }: { children: ReactNode }) => {
  return (
    <div className="gilroy relative z-10 w-fit rounded-xl border-1 border-[#9E8C38] px-[24px] py-[16px] text-[1.0741666667vw] whitespace-nowrap text-white shadow-[inset_0_0_15px_#9E8C38]">
      {children}
    </div>
  );
};

export const Section1 = () => {
  return (
    <Section id="section1" title="Секция 1">
      <ChapterText>Глава 1: Преимущества</ChapterText>
      <SectionText>
        Мы масштабируем <br /> вашу прибыль <br />
        <CarrotSpan>в Igaming</CarrotSpan>
      </SectionText>
    </Section>
  );
};

export const Section2 = () => {
  return (
    <Section id="section2" title="Секция 2">
      <SectionText>
        <CarrotSpan>Знаем ГЕО</CarrotSpan> с которых <br /> прямо сейчас идет{' '}
        <br /> профит
      </SectionText>
      <img
        src="/our-anwser.png"
        alt="our-anwser"
        draggable={false}
        className="aspect-square w-[19vw]"
      />
    </Section>
  );
};

export const Section3 = () => {
  return (
    <Section id="section3" title="Секция 3">
      <SectionText>
        <CarrotSpan>Знаем ГЕО</CarrotSpan> с которых <br /> прямо сейчас идет{' '}
        <br /> профит
      </SectionText>
      <img
        src="/our-reklams.png"
        alt="our-reklams"
        draggable={false}
        className="aspect-square w-[19vw]"
      />
    </Section>
  );
};

export const Section4 = () => {
  return (
    <Section id="section4" title="Секция 4">
      <SectionText>
        Более <CarrotSpan>300 офферов</CarrotSpan> <br /> от топовых <br />
        рекламодателей в одном <br /> месте
      </SectionText>

      <div className="mt-6 flex max-w-[35.5rem] flex-wrap gap-6">
        <FeatureBlock>Диверсифицируй риски</FeatureBlock>
        <FeatureBlock>Переключай потоки</FeatureBlock>
        <FeatureBlock>Тестируй топовые офферы без KPI</FeatureBlock>
        <FeatureBlock>Получай гарантированные выплаты</FeatureBlock>
      </div>
    </Section>
  );
};

export const Section5 = () => {
  return (
    <Section id="section5" title="Секция 5">
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

export const Section6 = () => {
  return (
    <Section id="section6" title="Секция 6">
      <ChapterText>Глава 2: Конференции</ChapterText>
      <SectionText>
        Место встречи изменить нельзя, <br />
        <CarrotSpan>увидимся </CarrotSpan> на конференциях
      </SectionText>
    </Section>
  );
};

// Новый компонент карточки для карусели
interface CardProps {
  imgSrc: string;
  imgAlt: string;
  position: 'left' | 'center' | 'right' | 'hidden';
}

const FinanceCard = ({
  imgSrc,
  imgAlt,
  position,
}: Omit<CardProps, 'isActive'>) => {
  let cardClasses = 'absolute transition-all duration-300 ease-in-out w-[19vw]';

  // Применяем стили в зависимости от позиции
  if (position === 'left') {
    cardClasses += ' z-30 opacity-100 translate-x-0 scale-100';
  } else if (position === 'center') {
    cardClasses += ' z-20 opacity-20 translate-x-[80%] scale-[0.85] rotate-6';
  } else if (position === 'right') {
    cardClasses += ' z-10 opacity-20 translate-x-[160%] scale-[0.7] rotate-12';
  } else if (position === 'hidden') {
    cardClasses += ' z-10 opacity-0 scale-50';
  }

  return (
    <div className={cardClasses}>
      <img
        src={imgSrc}
        alt={imgAlt}
        draggable={false}
        className="aspect-square w-full"
      />
    </div>
  );
};

// Объединенные секции 7, 8 и 9 в виде карусели
export const FinanceCarousel = () => {
  const { prevSection, nextSection } = useUnit({
    prevSection: goToPrevSection,
    nextSection: goToNextSection,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const skippedFirstScroll = useRef(false);

  // Используем простые и понятные флаги состояния скролла
  const carouselRef = useRef<HTMLDivElement>(null);

  const cards = [
    { imgSrc: '/pay-models.svg', imgAlt: 'pay-models' },
    { imgSrc: '/comfortable-payments.svg', imgAlt: 'comfortable-payments' },
    { imgSrc: '/fast-payments.svg', imgAlt: 'fast-payments' },
  ];

  useEffect(() => {
    console.log('activeIndex', activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    const handleDirection = debounce((direction: 'up' | 'down') => {
      if (!skippedFirstScroll.current) {
        skippedFirstScroll.current = true;
        return;
      }

      if (direction === 'down' && activeIndex < 2) {
        setActiveIndex((prev) => prev + 1);
      } else if (direction === 'up' && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      } else if (direction === 'down' && activeIndex === 2) {
        nextSection();
      } else if (direction === 'up' && activeIndex === 0) {
        prevSection();
      }
    }, 80);

    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const scrollDirection = e.deltaY > 0 ? 'down' : 'up';
      handleDirection(scrollDirection);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'ArrowDown') {
        handleDirection('down');
      } else if (e.key === 'ArrowUp') {
        handleDirection('up');
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function debounce<T extends (...args: any[]) => any>(
      func: T,
      wait: number,
    ): (...args: Parameters<T>) => void {
      let timeout: ReturnType<typeof setTimeout> | null = null;

      return function (...args: Parameters<T>) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    }

    document.addEventListener('wheel', handleScroll, { passive: false });
    document.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, nextSection, prevSection]);

  return (
    <Section id="finance-carousel" title="Финансовая карусель">
      <CarrotSpan>Глава 3: Финансовые взаимодействия</CarrotSpan>
      <SectionText>
        <CarrotSpan>Наша вариативность</CarrotSpan>
        <br />
        финансовых
        <br />
        взаимодействий
      </SectionText>

      <div ref={carouselRef} className="relative mt-8 h-[20vw] w-[40vw]">
        {cards.map((card, index) => {
          // Определяем позицию карточки в зависимости от активного индекса
          let position: 'left' | 'center' | 'right' | 'hidden' = 'hidden';

          // Активная карточка всегда слева
          if (index === activeIndex) {
            position = 'left';
          }
          // Карточка после активной - в центре
          else if (
            // Если активная карточка не последняя, то следующая будет в центре
            activeIndex < cards.length - 1 &&
            index === activeIndex + 1
          ) {
            position = 'center';
          }
          // Карточка через одну после активной - справа
          else if (
            // Если активная не предпоследняя и не последняя, то через одну будет справа
            activeIndex < cards.length - 2 &&
            index === activeIndex + 2
          ) {
            position = 'right';
          }

          return (
            <FinanceCard
              key={card.imgAlt}
              imgSrc={card.imgSrc}
              imgAlt={card.imgAlt}
              position={position}
            />
          );
        })}
      </div>
    </Section>
  );
};

// Заменяем старые секции 7, 8 и 9 на карусель - удаляем Section8 и Section9
export const Section7 = FinanceCarousel;
// Удаляем Section8 и Section9, оставляем только Section10
export const Section10 = () => {
  return (
    <Section id="section10" title="Секция 10">
      <ChapterText>Глава 4: Типы трафика</ChapterText>
      <SectionText>
        <CarrotSpan>Монетизируем</CarrotSpan> следующие типы трафика
      </SectionText>
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
    <p className="daysone text-[1.9vw] text-white uppercase drop-shadow-[0px_5.72px_48.66px_#FECF4D66]">
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
