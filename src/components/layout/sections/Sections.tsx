import { ScrollArea } from '@/components/components/ui/scrollarea';
import { cn } from '@/lib/utils';
import { goToNextSection, goToPrevSection } from '@/models/journey';
import { useUnit } from 'effector-react';
import { motion } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

interface SectionProps {
  id: string;
  title: string;
  children?: ReactNode;
  className?: string;
}

export const Section = ({ children, className = '' }: SectionProps) => {
  return (
    <section
      className={cn(
        'relative z-40 flex h-fit h-screen w-full flex-col items-start justify-start bg-gradient-to-b from-black from-30% to-transparent to-50% px-5 max-lg:py-[8rem] lg:w-fit lg:justify-center lg:from-transparent lg:px-[3.75rem]',
        className,
      )}>
      {children}
    </section>
  );
};

export const Section1 = () => {
  const { t } = useTranslation();

  return (
    <Section id="section1" title={t('sections.section1.title')}>
      <ChapterText>{t('sections.chapters.advantages')}</ChapterText>
      <SectionText>
        {t('sections.section1.content')} <br />
        <CarrotSpan>{t('sections.common.igaming')}</CarrotSpan>
      </SectionText>
    </Section>
  );
};

// Универсальный компонент карточки для карусели
interface UniversalCardProps {
  imgSrc: string;
  imgAlt: string;
  position: 'left-2' | 'left-1' | 'left' | 'center' | 'right' | 'hidden';
  isSquare?: boolean;
  width?: string;
  lgWidth?: string;
}

const UniversalCard = ({
  imgSrc,
  imgAlt,
  position,
  isSquare = false,
  width = 'w-[70vw]',
  lgWidth = 'lg:w-[19vw]',
}: UniversalCardProps) => {
  let cardClasses = `absolute transition-all duration-300 ease-in-out ${width} ${lgWidth}`;

  // Применяем стили в зависимости от позиции
  if (position === 'left') {
    cardClasses += ' z-30 backdrop-blur-xl opacity-100 translate-x-0 scale-100';
  } else if (position === 'center') {
    cardClasses +=
      ' z-20 opacity-[0.2] backdrop-blur-xl translate-x-[15%] translate-y-[3%] rotate-6';
  } else if (position === 'right') {
    cardClasses +=
      ' z-10 opacity-[0.2] backdrop-blur-xl translate-x-[30%] translate-y-[6%] rotate-12';
  } else if (position === 'left-1') {
    cardClasses +=
      ' z-20 opacity-[0.3] backdrop-blur-xl translate-x-[-15%] translate-y-[3%] rotate-[-6deg]';
  } else if (position === 'left-2') {
    cardClasses +=
      ' z-10 opacity-[0.2] backdrop-blur-xl translate-x-[-30%] translate-y-[6%] rotate-[-12deg]';
  } else if (position === 'hidden') {
    cardClasses += ' z-10 opacity-0 scale-50';
  }

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: position === 'hidden' ? 0 : 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <img
        src={imgSrc}
        alt={imgAlt}
        draggable={false}
        className={`w-full cursor-pointer overflow-hidden rounded-[30px] object-cover backdrop-blur-xl ${
          isSquare ? 'aspect-square' : 'aspect-[302/320]'
        }`}
      />
    </motion.div>
  );
};

// Универсальная карусель
interface UniversalCarouselProps {
  id: string;
  title: string;
  cards: Array<{ imgSrc: string; imgAlt: string }>;
  chapterText?: string;
  textProvider: (activeIndex: number) => ReactNode;
  isSquareCards?: boolean;
  cardWidth?: string;
  cardLgWidth?: string;
  className?: string;
}

const UniversalCarousel = ({
  id,
  title,
  cards,
  chapterText,
  textProvider,
  isSquareCards = false,
  cardWidth = 'w-[70vw]',
  cardLgWidth = 'lg:w-[19vw]',
  className = '',
}: UniversalCarouselProps) => {
  const { prevSection, nextSection } = useUnit({
    prevSection: goToPrevSection,
    nextSection: goToNextSection,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const skippedFirstScroll = useRef(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDirection = debounce((direction: 'up' | 'down') => {
      if (!skippedFirstScroll.current) {
        skippedFirstScroll.current = true;
        return;
      }

      if (direction === 'down' && activeIndex < cards.length - 1) {
        setActiveIndex((prev) => prev + 1);
      } else if (direction === 'up' && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      } else if (direction === 'down' && activeIndex === cards.length - 1) {
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
  }, [activeIndex, nextSection, prevSection, cards.length]);

  return (
    <Section id={id} title={title} className={className}>
      {chapterText && <ChapterText>{chapterText}</ChapterText>}
      <SectionText>{textProvider(activeIndex)}</SectionText>

      <div ref={carouselRef} className="relative mt-8 h-[20vw] w-[40vw]">
        {cards.map((card, index) => {
          // Определяем позицию карточки в зависимости от активного индекса
          let position:
            | 'left-2'
            | 'left-1'
            | 'left'
            | 'center'
            | 'right'
            | 'hidden' = 'hidden';

          // Активная карточка всегда по центру
          if (index === activeIndex) {
            position = 'left';
          }
          // Карточка после активной - справа-1
          else if (
            activeIndex < cards.length - 1 &&
            index === activeIndex + 1
          ) {
            position = 'center';
          }
          // Карточка через одну после активной - справа-2
          else if (
            activeIndex < cards.length - 2 &&
            index === activeIndex + 2
          ) {
            position = 'right';
          }
          // Карточка до активной - слева-1
          else if (activeIndex > 0 && index === activeIndex - 1) {
            position = 'left-1';
          }
          // Карточка за две до активной - слева-2
          else if (activeIndex > 1 && index === activeIndex - 2) {
            position = 'left-2';
          }

          return (
            <UniversalCard
              key={card.imgAlt}
              imgSrc={card.imgSrc}
              imgAlt={card.imgAlt}
              position={position}
              isSquare={isSquareCards}
              width={cardWidth}
              lgWidth={cardLgWidth}
            />
          );
        })}
      </div>
    </Section>
  );
};

// Объединенная секция 2 и 3 с географической каруселью
export const Section2 = () => {
  const { t } = useTranslation();

  const geoCards = [
    { imgSrc: '/our-anwser.svg', imgAlt: 'our-anwser' },
    { imgSrc: '/our-reklams.svg', imgAlt: 'our-reklams' },
  ];

  const geoTextProvider = (activeIndex: number) => (
    <>
      <CarrotSpan>{t('sections.common.knowGeo')}</CarrotSpan>
      {activeIndex === 0
        ? t('sections.section2.content')
        : t('sections.section3.content')}
    </>
  );

  return (
    <UniversalCarousel
      id="geo-carousel"
      title={t('sections.section2.title')}
      cards={geoCards}
      chapterText={t('sections.chapters.advantages')}
      textProvider={geoTextProvider}
    />
  );
};

export const Section4 = () => {
  const { t } = useTranslation();

  return (
    <Section id="section4" title={t('sections.section4.title')}>
      <SectionText>
        {t('sections.section4.content').split('300 офферов')[0]}
        <CarrotSpan>{t('sections.common.offers300')}</CarrotSpan>
        {t('sections.section4.content').split('300 офферов')[1]}
      </SectionText>

      <div className="mt-6 flex max-w-[35.5rem] flex-wrap gap-6">
        {[
          t('sections.section4.features.diversify'),
          t('sections.section4.features.switchTraffic'),
          t('sections.section4.features.testOffers'),
          t('sections.section4.features.guaranteedPayments'),
        ].map((feature, index) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.75 }}
            key={index}
            className="gilroy relative z-10 w-fit rounded-xl border-1 border-[#9E8C38] px-[24px] py-[16px] text-[3.5vw] whitespace-nowrap text-white shadow-[inset_0_0_15px_#9E8C38] backdrop-blur-lg lg:text-[1.0741666667vw] xl:backdrop-blur-none">
            {feature}
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export const Section5 = () => {
  const { t } = useTranslation();

  return (
    <Section id="section5" title={t('sections.section5.title')}>
      <SectionText>
        <CarrotSpan>{t('sections.common.strengthen')}</CarrotSpan>
        {t('sections.section5.content').split('Усиливаем')[1]}
      </SectionText>
      <SectionDescription>
        {t('sections.section5.description')}
      </SectionDescription>
    </Section>
  );
};

export const Section6 = () => {
  const { t } = useTranslation();

  return (
    <Section
      id="section6"
      title={t('sections.section6.title')}
      className="mx-auto flex w-fit flex-col items-center !px-0">
      <ChapterText className="w-full text-center">
        {t('sections.chapters.conferences')}
      </ChapterText>
      <SectionText className="w-full text-center text-[2.8645833333vw]">
        {t('sections.section6.content').split('увидимся')[0]}
        <CarrotSpan>{t('sections.common.meet')} </CarrotSpan>
        {t('sections.section6.content').split('увидимся')[1]}
      </SectionText>
      <ScrollArea className="mx-auto mt-8 flex h-[22vw] w-fit">
        <div className="flex h-fit w-fit gap-x-5 px-4">
          {Array.from({ length: 5 }).map((_, index) => {
            let delay = 0;
            let initialX = 0;
            let initialY = 0;

            switch (index) {
              case 0:
                delay = 0.8;
                initialX = -50;
                initialY = 0;
                break;
              case 1:
                delay = 1.1;
                initialX = -50;
                initialY = 0;
                break;
              case 2:
                delay = 1.3;
                initialX = 0;
                initialY = 75;
                break;
              case 3:
                delay = 1.1;
                initialX = 50;
                initialY = 0;
                break;
              case 4:
                delay = 0.8;
                initialX = 50;
                initialY = 0;
                break;
            }

            return (
              <motion.img
                initial={{ opacity: 0, x: initialX, y: initialY }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.35, delay: delay, repeat: 0 }}
                key={index}
                src="/meet-card.png"
                alt="meet-card"
                draggable={false}
                className="aspect-[435/389] max-h-[300px] w-[17.5vw] shrink-0 max-lg:min-w-[20.8125rem]"
              />
            );
          })}
        </div>
      </ScrollArea>
    </Section>
  );
};

// Используем универсальный компонент для создания финансовой карусели
export const Section7 = () => {
  const { t } = useTranslation();

  const financeCards = [
    { imgSrc: '/pay-models.svg', imgAlt: 'pay-models' },
    { imgSrc: '/comfortable-payments.png', imgAlt: 'comfortable-payments' },
    { imgSrc: '/fast-payments.svg', imgAlt: 'fast-payments' },
  ];

  const financeTextProvider = () => (
    <>
      <CarrotSpan>{t('sections.common.ourVariability')}</CarrotSpan>
      {t('sections.financeCarousel.content')}
    </>
  );

  return (
    <UniversalCarousel
      id="finance-carousel"
      title={t('sections.financeCarousel.title')}
      cards={financeCards}
      chapterText={t('sections.chapters.finance')}
      textProvider={financeTextProvider}
      isSquareCards={true}
      cardWidth="w-[50vw]"
      cardLgWidth="lg:w-[19vw]"
    />
  );
};

// Удаляем Section8 и Section9, оставляем только Section10
export const Section10 = () => {
  const { t } = useTranslation();

  return (
    <Section
      id="section10"
      title={t('sections.section10.title')}
      className="flex w-full flex-col items-center">
      <img
        src="/socials.png"
        alt="socials"
        draggable={false}
        className="absolute top-40 left-1/2 aspect-[2506-1024] w-full -translate-x-[40%] lg:top-20"
      />
      <ChapterText className="mt-50 w-full text-center lg:mt-20">
        {t('sections.chapters.trafficTypes')}
      </ChapterText>
      <SectionText className="w-full text-center text-[2.8645833333vw]">
        <CarrotSpan>{t('sections.common.monetize')}</CarrotSpan>{' '}
        {t('sections.section10.content').split('Монетизируем')[1]}
      </SectionText>
    </Section>
  );
};

export const ChapterText = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={`bg-gradient-to-r from-[#FFD01F] via-[#FFFD64] via-30% to-[#FFC61D] bg-clip-text text-[5vw] text-transparent lg:text-[1.3541666667vw] ${className}`}>
      {children}
    </p>
  );
};

export const SectionText = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={`daysone text-[6.4vw] leading-[1.15] tracking-tighter whitespace-pre-wrap text-white uppercase drop-shadow-[0px_5.72px_48.66px_#FECF4D66] lg:text-[1.9vw] ${className}`}>
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
    <p className="gilroy max-w-[60vw] text-[3vw] whitespace-pre-wrap text-white uppercase drop-shadow-[0px_5.72px_48.66px_#FECF4D66] lg:max-w-screen lg:text-[1.0741666667vw]">
      {children}
    </p>
  );
};
