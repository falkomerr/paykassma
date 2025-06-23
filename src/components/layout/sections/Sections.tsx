import { ScrollArea, ScrollBar } from '@/components/components/ui/scrollarea';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import {
  MOBILE_MONEY_BACKWARD_SOURCE,
  MOBILE_MONEY_FORWARD_SOURCE,
  MONEY_BACKWARD_ID,
  MONEY_BACKWARD_SOURCE,
  MONEY_FORWARD_ID,
  MONEY_FORWARD_SOURCE,
  TRAFFICS_BACKWARD_ID,
  TRAFFICS_BACKWARD_SOURCE,
  TRAFFICS_FORWARD_ID,
  TRAFFICS_FORWARD_SOURCE,
} from '@/constants';
import { cn } from '@/lib/utils';
import { playSwipeCardAudio } from '@/models/audio';
import {
  $activeSection,
  goToNextSection,
  goToPrevSection,
} from '@/models/journey';
import {
  $animationPlaying,
  exitSectionChanged,
  moneyTimeUpdated,
  moneyVideoElementMounted,
  nextSectionChanged,
  prevSectionChanged,
  sectionChanged,
} from '@/models/money-video';
import {
  handleScroll,
  trafficsTimeUpdated,
  trafficsVideoElementMounted,
} from '@/models/traffics-video';
import { useUnit } from 'effector-react';
import { motion } from 'framer-motion';
import { lazy, ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { sectionVariants, transition } from '../SectionsContainer';
import { $matches } from '../matches';

interface SectionProps {
  id: string;
  title: string;
  children?: ReactNode;
  className?: string;
  disableAnimation?: boolean;
}

export const Section = ({
  children,
  className = '',
  disableAnimation,
}: SectionProps) => {
  return (
    <motion.section
      variants={!disableAnimation ? sectionVariants : {}}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transition}
      className={cn(
        'relative z-40 flex h-fit h-screen w-full flex-col items-start justify-start bg-gradient-to-b from-black from-30% to-transparent to-50% px-5 max-lg:py-[8rem] lg:w-fit lg:justify-center lg:from-transparent lg:px-[3.75rem]',
        className,
      )}>
      {children}
    </motion.section>
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
  opacity?: number;
  className?: string;
}

const UniversalCard = ({
  imgSrc,
  imgAlt,
  position,
  isSquare = false,
  className,
}: UniversalCardProps) => {
  const [cardClasses, setCardClasses] = useState(
    `absolute transition-all duration-300 ease-in-out`,
  );
  // const [cardOpacity, setCardOpacity] = useState(0);

  useEffect(() => {
    const baseClasses =
      'absolute transition-all duration-300 ease-in-out will-change-[transform,opacity]';

    if (position === 'left') {
      // setCardOpacity(1);
      setCardClasses(
        `${baseClasses} z-40  backdrop-blur-xl rounded-[40px] md:rounded-[30px] opacity-100 translate-x-0 scale-100`,
      );
    } else if (position === 'center') {
      // setCardOpacity(0.2);
      setCardClasses(
        `${baseClasses} z-30 opacity-20 backdrop-blur-xl rounded-[40px] md:rounded-[30px] translate-x-[15%] translate-y-[3%] rotate-6`,
      );
    } else if (position === 'right') {
      // setCardOpacity(0.2);
      setCardClasses(
        `${baseClasses} z-20 opacity-20 backdrop-blur-xl rounded-[40px] md:rounded-[30px] translate-x-[30%] translate-y-[6%] rotate-12`,
      );
    } else if (position === 'left-1') {
      // setCardOpacity(0.2);
      setCardClasses(
        `${baseClasses} z-30 opacity-20 backdrop-blur-xl rounded-[40px] md:rounded-[30px] translate-x-[-15%] translate-y-[3%] rotate-[-6deg]`,
      );
    } else if (position === 'left-2') {
      // setCardOpacity(0.2);
      setCardClasses(
        `${baseClasses} z-20 opacity-20 backdrop-blur-xl rounded-[40px] md:rounded-[30px] translate-x-[-30%] translate-y-[6%] rotate-[-12deg]`,
      );
    } else if (position === 'hidden') {
      // setCardOpacity(0);
      setCardClasses(`${baseClasses} z-10 scale-50 opacity-0`);
    }
  }, [position]);

  return (
    <motion.div
      className={cardClasses}
      // initial={{ opacity: 0 }}
      // animate={{ opacity: cardOpacity }}
      // exit={{ opacity: 0 }}
      // transition={{ duration: 0.3 }}
    >
      <img
        src={imgSrc}
        alt={imgAlt}
        draggable={false}
        className={`w-full cursor-pointer overflow-hidden object-cover backdrop-blur-xl ${
          isSquare ? 'aspect-square' : 'aspect-[302/320]'
        } ${className}`}
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
  textProvider?: (activeIndex: number) => ReactNode;
  isSquareCards?: boolean;
  blockSwipe?: boolean;
  cardWidth?: string;
  cardLgWidth?: string;
  className?: string;
  sectionChanged?: (section: number) => void;
  children?: ReactNode;
  isAlreadySection?: boolean;
}

const UniversalCarousel = ({
  id,
  title,
  cards,
  blockSwipe = false,
  chapterText,
  textProvider,
  isSquareCards = false,
  cardWidth = 'w-[70vw]',
  cardLgWidth = 'lg:w-[19vw]',
  className = '',
  sectionChanged,
  children,
  isAlreadySection = false,
}: UniversalCarouselProps) => {
  const {
    prevSection,
    nextSection,
    prevSectionChange,
    nextSectionChange,
    exitSection,
    playAudio,
  } = useUnit({
    prevSection: goToPrevSection,
    nextSection: goToNextSection,
    prevSectionChange: prevSectionChanged,
    nextSectionChange: nextSectionChanged,
    exitSection: exitSectionChanged,
    playAudio: playSwipeCardAudio,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const skippedFirstScroll = useRef(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [animateHiding, setAnimateHiding] = useState(false);
  const isScrollLocked = useRef(false);

  useEffect(() => {
    const handleDirection = (direction: 'up' | 'down') => {
      if (blockSwipe) return;

      if (isScrollLocked.current) return;

      isScrollLocked.current = true;

      if (!skippedFirstScroll.current) {
        skippedFirstScroll.current = true;
        setAnimateHiding(false);
        setTimeout(() => {
          isScrollLocked.current = false;
        }, 1000);
        return;
      }

      playAudio();

      if (direction === 'down' && activeIndex < cards.length - 1) {
        nextSectionChange();

        setActiveIndex((prev) => prev + 1);
        setAnimateHiding(false);
        sectionChanged?.(activeIndex + 1);
      } else if (direction === 'up' && activeIndex > 0) {
        prevSectionChange();

        setActiveIndex((prev) => prev - 1);
        setAnimateHiding(false);
        sectionChanged?.(activeIndex - 1);
      } else if (direction === 'down' && activeIndex === cards.length - 1) {
        nextSection();
        setAnimateHiding(true);
        sectionChanged?.(activeIndex + 1);
        exitSection();
      } else if (direction === 'up' && activeIndex === 0) {
        prevSection();
        setAnimateHiding(true);
        sectionChanged?.(activeIndex - 1);
        exitSection();
      }

      setTimeout(() => {
        isScrollLocked.current = false;
      }, 1000);
    };

    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isScrollLocked.current) return;

      const scrollDirection = e.deltaY > 0 ? 'down' : 'up';
      handleDirection(scrollDirection);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isScrollLocked.current) return;

      if (e.key === 'ArrowDown') {
        handleDirection('down');
      } else if (e.key === 'ArrowUp') {
        handleDirection('up');
      }
    };

    // Переменные для отслеживания сенсорных событий
    let touchStartY = 0;
    let touchEndY = 0;
    const TOUCH_THRESHOLD = 80; // Порог для определения свайпа (в пикселях)
    let isTouchHandled = false;

    // Обработчик начала касания (для мобильных устройств)
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      isTouchHandled = false;
    };

    // Обработчик перемещения при касании
    const handleTouchMove = (e: TouchEvent) => {
      // Предотвращаем стандартный скролл страницы
      e.preventDefault();
      e.stopPropagation();
    };

    // Обработчик завершения касания
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isScrollLocked.current || isTouchHandled) return;

      touchEndY = e.changedTouches[0].clientY;

      // Определяем направление свайпа и его силу
      const touchDelta = touchStartY - touchEndY;

      // Свайп вниз (для перехода к предыдущей секции)
      if (touchDelta < -TOUCH_THRESHOLD) {
        isTouchHandled = true;
        handleDirection('up');
      }
      // Свайп вверх (для перехода к следующей секции)
      else if (touchDelta > TOUCH_THRESHOLD) {
        isTouchHandled = true;
        handleDirection('down');
      }
    };

    document.addEventListener('wheel', handleScroll, { passive: false });
    document.addEventListener('keydown', handleKeyDown, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('wheel', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    activeIndex,
    nextSection,
    prevSection,
    cards.length,
    playAudio,
    nextSectionChange,
    prevSectionChange,
    sectionChanged,
    blockSwipe,
    exitSection,
  ]);

  const content = () => (
    <>
      {chapterText && <ChapterText>{chapterText}</ChapterText>}
      {textProvider && <SectionText>{textProvider(activeIndex)}</SectionText>}
      {children}

      <div
        ref={carouselRef}
        className="relative mt-8 h-[22.7604166667vw] w-[17.9166666667vw] max-lg:w-[53.75vw]">
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
              className={className}
              opacity={animateHiding ? 0 : 1}
              key={card.imgSrc}
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
    </>
  );

  if (isAlreadySection) {
    return content();
  }

  return (
    <Section id={id} title={title}>
      {content()}
    </Section>
  );
};

// Объединенная секция 2 и 3 с географической каруселью
export const Section2 = () => {
  const { t } = useTranslation();

  const geoCards = [
    { imgSrc: '/our-anwser.png', imgAlt: 'our-anwser' },
    { imgSrc: '/our-reklams.png', imgAlt: 'our-reklams' },
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
      className="aspect-[344/341] max-w-[344px]"
    />
  );
};

export const Section3 = () => {
  const { t } = useTranslation();

  return (
    <Section id="section3" title={t('sections.section4.title')}>
      <SectionText>
        {t('sections.section4.more')}
        <CarrotSpan>{t('sections.section4.offers')}</CarrotSpan>
        {t('sections.section4.content')}
      </SectionText>
    </Section>
  );
};
export const Section4 = () => {
  const { t } = useTranslation();

  const geoCards = [
    { imgSrc: '/diversify.png', imgAlt: 'our-anwser' },
    { imgSrc: '/change-flow.png', imgAlt: 'our-anwser' },
    { imgSrc: '/test-new-offers.png', imgAlt: 'our-anwser' },
    { imgSrc: '/take-payments.png', imgAlt: 'our-anwser' },
  ];

  return (
    <Section
      id="section4"
      disableAnimation
      title={t('sections.section4.title')}>
      <UniversalCarousel
        isAlreadySection
        id="geo-carousel"
        title={t('sections.section2.title')}
        cards={geoCards}
        className="aspect-[344/341] max-w-[344px]"
      />
      {/* <div className="mt-6 flex max-w-[35.5rem] flex-wrap gap-6">
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
      </div> */}
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

      <img
        src="/scale-your.png"
        className="mt-4 aspect-[410/341] w-[21.3541666667vw] max-lg:w-[53.75vw]"
      />
    </Section>
  );
};

// const SplineBG = lazy(() => import('@splinetool/react-spline'));

export const Section6 = () => {
  const { t } = useTranslation();

  return (
    <Section
      id="section6"
      title={t('sections.section6.title')}
      className="mx-auto flex !w-full w-fit flex-col items-center !px-0">
      {/* <Suspense>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}>
          <SplineBG
            className="absolute -left-0 z-0 !w-screen opacity-40"
            scene="https://prod.spline.design/qdVHy93-5StPiPyX/scene.splinecode"
          />
        </motion.div>
      </Suspense> */}
      <ChapterText className="w-full text-center" animate>
        {t('sections.chapters.conferences')}
      </ChapterText>
      <SectionText className="w-full text-center text-[2.8645833333vw]" animate>
        {t('sections.section6.content').split('увидимся')[0]}
        <CarrotSpan>{t('sections.common.meet')} </CarrotSpan>
        {t('sections.section6.content').split('увидимся')[1]}
      </SectionText>
      <ScrollArea className="z-[9999] mx-auto -mt-12 ml-20 flex w-full overflow-x-hidden max-lg:pb-4 lg:h-[22vw]">
        <div className="relative z-[999] flex h-fit gap-x-5 px-4 max-lg:mt-20">
          {Array.from({ length: 5 }).map((_, index) => {
            return (
              <>
                <CardContainer key={index} className="max-lg:hidden">
                  <CardBody className="flex">
                    <CardItem translateZ={40}>
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: (index + 7) * 0.25,
                        }}
                        src="/meet-card.png"
                        alt="meet-card"
                        draggable={false}
                        className="relative z-[999] aspect-[435/389] w-[17.5vw] shrink-0 max-lg:w-[80vw] max-lg:min-w-[20.8125rem] lg:max-h-[300px]"
                      />
                    </CardItem>
                  </CardBody>
                </CardContainer>

                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: (index + 7) * 0.25,
                  }}
                  src="/meet-card.png"
                  alt="meet-card"
                  draggable={false}
                  className="relative z-[999] aspect-[435/389] w-[17.5vw] shrink-0 max-lg:w-[80vw] max-lg:min-w-[20.8125rem] lg:hidden lg:max-h-[300px]"
                />
              </>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Section>
  );
};

// Используем универсальный компонент для создания финансовой карусели
export const Section7 = () => {
  const isDesktop = useUnit($matches);
  const { t } = useTranslation();
  const [hideVideo, setHideVideo] = useState(false);
  const { animationPlaying } = useUnit({ animationPlaying: $animationPlaying });
  const { handleTimeUpdate, setActiveSection, moneyVideoMounted } = useUnit({
    handleTimeUpdate: moneyTimeUpdated,
    setActiveSection: sectionChanged,
    moneyVideoMounted: moneyVideoElementMounted,
  });

  const financeCards = [
    { imgSrc: '/pay-models.png', imgAlt: 'pay-models' },
    { imgSrc: '/comfortable-payments.png', imgAlt: 'comfortable-payments' },
    { imgSrc: '/fast-payments.png', imgAlt: 'fast-payments' },
  ];

  const financeTextProvider = () => (
    <>
      <CarrotSpan>{t('sections.common.ourVariability')}</CarrotSpan>
      {t('sections.financeCarousel.content')}
    </>
  );

  useEffect(() => {
    moneyVideoMounted();
  }, [moneyVideoMounted]);

  exitSectionChanged.watch(() => {
    setHideVideo(true);
  });

  return (
    <UniversalCarousel
      id="finance-carousel"
      title={t('sections.financeCarousel.title')}
      cards={financeCards}
      chapterText={t('sections.chapters.finance')}
      textProvider={financeTextProvider}
      isSquareCards={true}
      cardWidth="w-[50vw]"
      blockSwipe={animationPlaying}
      cardLgWidth="lg:w-[19vw]"
      sectionChanged={setActiveSection}>
      {isDesktop ? (
        <>
          <video
            id={MONEY_FORWARD_ID}
            onTimeUpdate={(e) => {
              handleTimeUpdate((e.target as HTMLVideoElement).currentTime);
            }}
            className="fixed z-30 h-screen w-screen object-cover transition-all duration-300"
            playsInline
            muted
            style={{ opacity: hideVideo ? 0 : 1 }}
            preload="auto">
            <source src={MONEY_FORWARD_SOURCE} type="video/mp4" />
            Ваш браузер не поддерживает видео-тег.
          </video>
          <video
            id={MONEY_BACKWARD_ID}
            onTimeUpdate={(e) => {
              handleTimeUpdate((e.target as HTMLVideoElement).currentTime);
            }}
            className="fixed z-30 h-screen w-screen object-cover transition-all duration-300"
            playsInline
            muted
            preload="auto"
            style={{ opacity: hideVideo ? 0 : 1 }}>
            <source src={MONEY_BACKWARD_SOURCE} type="video/mp4" />
            Ваш браузер не поддерживает видео-тег.
          </video>
        </>
      ) : (
        <>
          <video
            id={MONEY_FORWARD_ID}
            onTimeUpdate={(e) => {
              handleTimeUpdate((e.target as HTMLVideoElement).currentTime);
            }}
            className="fixed z-30 h-screen w-screen object-cover transition-all duration-300"
            playsInline
            muted
            style={{ opacity: hideVideo ? 0 : 1 }}
            preload="auto">
            <source src={MOBILE_MONEY_FORWARD_SOURCE} type="video/mp4" />
            Ваш браузер не поддерживает видео-тег.
          </video>
          <video
            id={MONEY_BACKWARD_ID}
            onTimeUpdate={(e) => {
              handleTimeUpdate((e.target as HTMLVideoElement).currentTime);
            }}
            className="fixed z-30 h-screen w-screen object-cover transition-all duration-300"
            playsInline
            muted
            preload="auto"
            style={{ opacity: hideVideo ? 0 : 1 }}>
            <source src={MOBILE_MONEY_BACKWARD_SOURCE} type="video/mp4" />
            Ваш браузер не поддерживает видео-тег.
          </video>
        </>
      )}
    </UniversalCarousel>
  );
};

// Удаляем Section8 и Section9, оставляем только Section10
export const Section8 = () => {
  const { t } = useTranslation();
  const { mountTrafficsVideo, updateTrafficsTime, scrollHandle } = useUnit({
    mountTrafficsVideo: trafficsVideoElementMounted,
    updateTrafficsTime: trafficsTimeUpdated,
    scrollHandle: handleScroll,
  });

  const touchStartYRef = useRef(0);

  const touchEndYRef = useRef(0);

  useEffect(() => {
    mountTrafficsVideo();

    // Базовая функция для обработки направления внутри useEffect
    const handleDirection = (direction: 'next' | 'prev') => {
      scrollHandle({
        direction: direction === 'next' ? 'forward' : 'backward',
      });
    };

    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const direction = e.deltaY > 0 ? 'next' : 'prev';

      handleDirection(direction);
    };

    // Обработчики сенсорных событий для мобильных устройств
    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Предотвращаем стандартный скролл страницы
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Сохраняем позицию последнего касания
      touchEndYRef.current = e.changedTouches[0].clientY;

      // Определяем направление свайпа только если было достаточное движение
      const touchDiff = touchEndYRef.current - touchStartYRef.current;
      const TOUCH_THRESHOLD = 50;

      if (Math.abs(touchDiff) > TOUCH_THRESHOLD) {
        const direction = touchDiff > 0 ? 'next' : 'prev';
        handleDirection(direction);
      }
    };

    document.addEventListener('wheel', handleScroll, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleScroll);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [mountTrafficsVideo, scrollHandle]);

  return (
    <Section
      id="section8"
      title={t('sections.section10.title')}
      className="flex !w-full flex-col items-center">
      {/* <div className="">
        <img
          src="/socials.png"
          alt="socials"
          draggable={false}
          className="absolute top-40 left-1/2 aspect-[2506/1024] w-full -translate-x-[40%] lg:top-20"
        />
        <ChapterText className="mt-50 w-full text-center lg:mt-20">
          {t('sections.chapters.trafficTypes')}
        </ChapterText>
        <SectionText className="w-full text-center text-[2.8645833333vw]">
          <CarrotSpan>{t('sections.common.monetize')}</CarrotSpan>{' '}
          {t('sections.section10.content').split('Монетизируем')[1]}
        </SectionText>
      </div> */}
      <video
        id={TRAFFICS_FORWARD_ID}
        onTimeUpdate={(e) => {
          updateTrafficsTime((e.target as HTMLVideoElement).currentTime);
        }}
        playsInline
        muted
        preload="auto"
        className="fixed z-30 h-screen w-screen object-cover transition-all duration-300">
        <source src={TRAFFICS_FORWARD_SOURCE} type="video/mp4" />
      </video>
      <video
        id={TRAFFICS_BACKWARD_ID}
        onTimeUpdate={(e) => {
          updateTrafficsTime((e.target as HTMLVideoElement).currentTime);
        }}
        playsInline
        muted
        preload="auto"
        className="fixed z-30 h-screen w-screen object-cover transition-all duration-300">
        <source src={TRAFFICS_BACKWARD_SOURCE} type="video/mp4" />
      </video>
    </Section>
  );
};

const LazySpline = lazy(() => import('@splinetool/react-spline'));

export const Section9 = () => {
  const { t } = useTranslation();

  return (
    <Section
      id="section9"
      title={t('sections.section10.title')}
      className="flex h-screen max-h-screen !w-full flex-col">
      <div className="flex h-full items-center">
        <div className="z-50 flex flex-col gap-y-6">
          <ChapterText className="-mb-6">
            {t('sections.section9.chapter')}
          </ChapterText>
          <SectionText>
            <CarrotSpan>{t('sections.section9.titleBonus')}</CarrotSpan>
            {t('sections.section9.title')}
          </SectionText>
          <div className="gilroy flex flex-col gap-y-2 text-[3vw] whitespace-pre-wrap text-white drop-shadow-[0px_5.72px_48.66px_#FECF4D66] lg:max-w-screen lg:text-[1.0741666667vw]">
            <p>
              <span className="text-[#FBD74C]">
                {t('sections.section9.weHide')}
              </span>
              {t('sections.section9.content')}
            </p>
            <span className="text-[#FBD74C]">
              {t('sections.section9.ifYouFind')}
            </span>
          </div>

          <div className="mt-2 flex gap-2.5 max-lg:flex-col">
            <button
              type="submit"
              className="max-lg:!padding-[1px] relative aspect-[208/74] w-[8vw] cursor-pointer overflow-hidden rounded-[20px] max-lg:w-[29.21875vw] max-lg:rounded-[10px]"
              style={{
                background:
                  'linear-gradient(103.94deg, #515150 5.7%, #FFB901 47.34%, #515150 95.09%)',
                padding: '2px',
              }}>
              <div className="group/button flex h-full items-center justify-center rounded-[20px] bg-black max-lg:rounded-[10px]">
                <div className="relative z-[999] h-[14px] w-full overflow-hidden text-center text-white 2xl:h-[16px]">
                  <div className="absolute w-full text-center text-[14px] leading-[1] whitespace-nowrap opacity-100 transition-all duration-300 group-hover/button:-translate-y-full group-hover/button:opacity-0 2xl:text-[16px]">
                    {t('sections.section9.participate')}
                  </div>
                  <div className="absolute w-full translate-y-full text-center text-[14px] leading-[1] whitespace-nowrap transition-transform duration-300 group-hover/button:translate-y-0 2xl:text-[16px]">
                    {t('sections.section9.participate')}
                  </div>
                </div>
              </div>
            </button>
            <button
              type="submit"
              className="relative aspect-[298/74] w-[12vw] cursor-pointer overflow-hidden rounded-[20px] max-lg:w-[38.5625vw] max-lg:rounded-[10px]"
              style={{
                background:
                  'linear-gradient(103.94deg, #515150 5.7%, #FFFFFF 47.34%, #515150 95.09%)',
                padding: '2px',
              }}>
              <div className="group/button flex h-full items-center justify-center rounded-[20px] bg-black max-lg:rounded-[10px]">
                <div className="relative z-[999] h-[14px] w-full overflow-hidden text-center text-white 2xl:h-[16px]">
                  <div className="absolute w-full text-center text-[14px] leading-[1] whitespace-nowrap opacity-100 transition-all duration-300 group-hover/button:-translate-y-full group-hover/button:opacity-0 2xl:text-[16px]">
                    {t('sections.section9.detailedConditions')}
                  </div>
                  <div className="absolute w-full translate-y-full text-center text-[14px] leading-[1] whitespace-nowrap transition-transform duration-300 group-hover/button:translate-y-0 2xl:text-[16px]">
                    {t('sections.section9.detailedConditions')}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
        {/* <Spline
          className="absolute top-0 bottom-0 -left-0 z-0 !w-screen opacity-40"
          scene="https://prod.spline.design/qdVHy93-5StPiPyX/scene.splinecode"
        /> */}
        <Suspense fallback={<div></div>}>
          <LazySpline
            className="absolute top-0 -right-80 bottom-0 z-0 !w-screen max-lg:hidden"
            scene={t('sections.section9.spline')}
          />
        </Suspense>
      </div>
    </Section>
  );
};

export const Section10 = () => {
  const { t } = useTranslation();
  const currentSection = useUnit($activeSection);

  return (
    <Section
      id="section10"
      title={t('sections.section10.title')}
      className="flex !w-full flex-row items-center !justify-between max-lg:flex-col max-lg:!justify-center max-lg:!py-0">
      <div className="flex h-full w-fit items-center max-lg:-mt-15 max-lg:h-fit">
        <div className="z-50 flex flex-col gap-y-6">
          <SectionText>
            {t('sections.section11.title')}{' '}
            <CarrotSpan>{t('sections.section11.paykassma')}</CarrotSpan>
          </SectionText>
          <div className="gilroy flex flex-col gap-y-2 text-[3vw] whitespace-pre-wrap text-white drop-shadow-[0px_5.72px_48.66px_#FECF4D66] max-lg:text-[4vw] lg:max-w-screen lg:text-[1.0741666667vw]">
            <p>{t('sections.section11.content')}</p>
          </div>

          <div className="flex gap-2.5">
            <button
              type="submit"
              className="relative aspect-[208/64] w-[9.58125vw] cursor-pointer overflow-hidden rounded-[0.78125vw] max-lg:w-[38.65625vw] max-lg:rounded-[10px]"
              style={{
                background:
                  'linear-gradient(103.94deg, #515150 5.7%, #FFB901 47.34%, #515150 95.09%)',
                padding: '2px',
              }}>
              <div className="group/button flex h-full items-center justify-center rounded-[0.78125vw] bg-black max-lg:rounded-[10px]">
                <div className="relative z-[999] h-[14px] w-full overflow-hidden text-center text-white 2xl:h-[16px]">
                  <div className="absolute w-full text-center text-[14px] leading-[1] whitespace-nowrap opacity-100 transition-all duration-300 group-hover/button:-translate-y-full group-hover/button:opacity-0 2xl:text-[16px]">
                    {t('sections.section11.join')}
                  </div>
                  <div className="absolute w-full translate-y-full text-center text-[14px] leading-[1] whitespace-nowrap transition-transform duration-300 group-hover/button:translate-y-0 2xl:text-[16px]">
                    {t('sections.section11.join')}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <svg
        className="aspect-[222/259] w-[55.5vw] lg:hidden"
        width="276"
        height="311"
        viewBox="0 0 276 311"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_12_58097)">
          <path
            d="M48.4277 58.0962C48.9797 50.3484 49.2556 46.4745 50.3345 43.2689C53.2095 34.7268 60.2295 28.2239 68.9661 26.0096C72.2448 25.1786 76.1602 25.1995 83.9909 25.2411L106.311 25.3599C109.964 25.3793 112.914 28.3458 112.914 31.9984L103.614 187.225C103.284 192.737 103.119 195.493 103.466 197.771C104.828 206.706 111.573 213.867 120.41 215.761C122.663 216.244 125.424 216.244 130.947 216.244C136.55 216.244 139.352 216.244 141.627 216.736C150.554 218.669 157.323 225.974 158.571 235.023C158.888 237.329 158.675 240.122 158.249 245.71L158.141 247.124C157.576 254.516 157.294 258.212 156.299 261.254C153.422 270.048 146.171 276.709 137.165 278.831C134.05 279.565 130.343 279.534 122.93 279.47L33.2021 278.703C34.0639 260.464 43.8354 122.563 48.4277 58.0962Z"
            fill="url(#paint0_linear_12_58097)"
            fill-opacity="0.5"
          />
          <path
            d="M116.708 75.059C118.411 51.753 119.263 40.1 126.902 32.9993C134.54 25.8985 146.238 25.8985 169.634 25.8985L243.113 25.8984L233.239 161.296C231.537 184.636 230.686 196.307 223.047 203.409C215.408 210.511 203.706 210.511 180.304 210.511H106.888C107.636 199.338 112.993 125.874 116.708 75.059Z"
            fill="url(#paint1_linear_12_58097)"
            fill-opacity="0.5"
          />
          <path
            d="M187.022 22.9297H75.9218C58.5807 22.9297 44.0484 36.3081 42.8397 53.3887L26.6523 281.933H137.752C155.094 281.933 169.626 268.554 170.834 251.475L173.032 220.398H204.431C221.773 220.398 236.305 207.02 237.514 189.939L249.347 22.9297H187.022ZM168.356 40.6124L156.879 203.283H111.923L122.451 54.5821C122.65 49.1502 127.785 40.6124 138.023 40.6124H168.356ZM153.548 250.281C152.971 258.439 146.035 264.824 137.752 264.824H45.2365L60.4307 54.6826C61.0117 47.7935 65.6895 40.6124 75.8273 40.6124H109.069C106.844 44.6265 105.508 48.5676 105.165 53.3887L93.3384 220.398H155.664L153.548 250.281ZM220.234 188.746C219.657 196.903 212.721 203.29 204.439 203.29H174.248L185.813 40.0375H230.769L220.234 188.746Z"
            fill="url(#paint2_linear_12_58097)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_12_58097"
            x="0.859997"
            y="0.171734"
            width="274.279"
            height="310.589"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="3.03439" />
            <feGaussianBlur stdDeviation="12.8962" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.996078 0 0 0 0 0.81098 0 0 0 0 0.301961 0 0 0 0.4 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_12_58097"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_12_58097"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_12_58097"
            x1="38.3581"
            y1="278.912"
            x2="181.767"
            y2="25.873"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#4B4B4B" />
            <stop offset="0.337101" stop-color="#2A282B" />
            <stop offset="1" stop-color="#060606" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_12_58097"
            x1="112.405"
            y1="209.903"
            x2="193.485"
            y2="-1.30424"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#4B4B4B" />
            <stop offset="0.337101" stop-color="#2A282B" />
            <stop offset="1" stop-color="#060606" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_12_58097"
            x1="26.6523"
            y1="152.431"
            x2="249.347"
            y2="152.431"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFD01F" />
            <stop offset="0.302885" stop-color="#FFFD64" />
            <stop offset="1" stop-color="#FFC61D" />
          </linearGradient>
        </defs>
      </svg>

      <svg
        className="mr-[13.8541666667vw] max-lg:hidden"
        width="587"
        height="665"
        viewBox="0 0 587 665"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_184_60269)">
          <path
            d="M97.2568 120.061C98.9737 95.9594 99.8322 83.9086 104.776 74.5735C110.082 64.5541 118.639 56.6273 129.034 52.1019C138.72 47.8855 150.87 47.9501 175.171 48.0794L224.072 48.3396C232.074 48.3822 238.539 54.8813 238.539 62.8838L218.164 402.966C217.049 421.568 216.492 430.868 218.93 438.301C222.729 449.885 231.484 459.18 242.82 463.665C250.094 466.543 259.411 466.543 278.046 466.543C296.956 466.543 306.411 466.543 313.748 469.478C325.185 474.054 333.961 483.525 337.652 495.277C340.02 502.816 339.301 512.244 337.861 531.099L337.625 534.198C335.846 557.498 334.956 569.149 330.303 578.169C324.869 588.704 315.872 596.968 304.915 601.491C295.534 605.364 283.85 605.264 260.483 605.065L63.8994 603.384C65.7873 563.425 87.1955 261.301 97.2568 120.061Z"
            fill="url(#paint0_linear_184_60269)"
            fill-opacity="0.5"
          />
          <path
            d="M247.948 142.221C251.161 98.2757 252.767 76.3031 267.177 62.9084C281.587 49.5138 303.654 49.5138 347.787 49.5137L523.789 49.5137L501.064 361.137C497.853 405.167 496.248 427.182 481.837 440.58C467.427 453.978 445.353 453.978 401.207 453.978H225.337C227.051 428.374 239.812 253.487 247.948 142.221Z"
            fill="url(#paint1_linear_184_60269)"
            fill-opacity="0.5"
          />
          <path
            d="M400.901 43.0127H157.495C119.503 43.0127 87.6644 72.3231 85.0163 109.745L49.5518 610.457H292.959C330.951 610.457 362.789 581.147 365.437 543.727L370.252 475.642H439.044C477.037 475.642 508.875 446.331 511.523 408.91L537.448 43.0127H400.901ZM360.008 81.7535L334.862 438.146H236.368L259.435 112.359C259.87 100.459 271.122 81.7535 293.55 81.7535H360.008ZM327.565 541.113C326.301 558.984 311.105 572.974 292.959 572.974H90.2675L123.556 112.579C124.829 97.4863 135.078 81.7535 157.288 81.7535H230.117C225.242 90.5478 222.315 99.1823 221.563 109.745L195.653 475.642H332.2L327.565 541.113ZM473.666 406.295C472.403 424.166 457.206 438.161 439.06 438.161H372.915L398.254 80.4937H496.748L473.666 406.295Z"
            fill="url(#paint2_linear_184_60269)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_184_60269"
            x="0.896584"
            y="0.0816588"
            width="585.207"
            height="664.755"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="5.72414" />
            <feGaussianBlur stdDeviation="24.3276" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.996078 0 0 0 0 0.81098 0 0 0 0 0.301961 0 0 0 0.4 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_184_60269"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_184_60269"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_184_60269"
            x1="75.1955"
            y1="603.841"
            x2="389.387"
            y2="49.4637"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#4B4B4B" />
            <stop offset="0.337101" stop-color="#2A282B" />
            <stop offset="1" stop-color="#060606" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_184_60269"
            x1="237.425"
            y1="452.646"
            x2="415.062"
            y2="-10.0841"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#4B4B4B" />
            <stop offset="0.337101" stop-color="#2A282B" />
            <stop offset="1" stop-color="#060606" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_184_60269"
            x1="49.5518"
            y1="326.735"
            x2="537.448"
            y2="326.735"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#FFD01F" />
            <stop offset="0.302885" stop-color="#FFFD64" />
            <stop offset="1" stop-color="#FFC61D" />
          </linearGradient>
        </defs>
      </svg>

      <div
        className={cn(
          'absolute right-0 bottom-0 left-0 z-50 z-[999] flex h-fit w-full items-center justify-between px-4 py-8 text-[#CCC] drop-shadow-[0px_5.72px_48.66px_#FECF4D66] transition-all duration-500 max-lg:flex-col lg:px-[3.75rem]',
          currentSection !== 'section10' && 'opacity-0',
        )}>
        <p className="max-lg:hidden">
          © PayKassma.partners, 2025 All rights reserved
        </p>
        <div className="flex w-[9.8958333333vw] items-center justify-center gap-x-2 max-lg:w-[58.75vw]">
          {[
            '/tg.svg',
            '/insta.svg',
            '/youtube.svg',
            '/linkedin.svg',
            '/facebook.svg',
          ].map((item) => (
            <img
              key={item}
              src={item}
              alt="tg"
              className={cn(
                'relative z-[999] size-[10vw] shrink-0 object-cover object-center max-lg:size-[8.75vw] xl:size-[1.5625vw]',
                ['/tg.svg', '/insta.svg'].includes(item)
                  ? '-mt-2.5'
                  : 'scale-[1.6]',
                item === '/youtube.svg' && '-mb-0.5 ml-1.5',
              )}
            />
          ))}
        </div>
        <div className="flex gap-x-5 max-lg:my-5 max-lg:flex-wrap max-lg:justify-center max-lg:text-[12px]">
          <p>Получить PWA-приложение</p>
          <p>Веб-мастерам</p>
          <p>Маркетинг и PR</p>
          <p>Для рекламодателей</p>
          <p>Условия и положения</p>
        </div>
        <p className="max-lg:text-[12px] lg:hidden">
          © PayKassma.partners, 2025 All rights reserved
        </p>
      </div>
    </Section>
  );
};

export const ChapterText = ({
  children,
  className,
  animate,
}: {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}) => {
  return (
    <motion.p
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
      exit="exit"
      variants={sectionVariants}
      transition={transition}
      className={`z-[40] bg-gradient-to-r from-[#FFD01F] via-[#FFFD64] via-30% to-[#FFC61D] bg-clip-text text-[5vw] text-transparent lg:text-[1.3541666667vw] ${className}`}>
      {children}
    </motion.p>
  );
};

export const SectionText = ({
  children,
  className,
  animate,
}: {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}) => {
  return (
    <motion.p
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
      exit="exit"
      variants={sectionVariants}
      transition={transition}
      className={`daysone z-[40] text-[6.4vw] leading-[1.15] tracking-tighter whitespace-pre-wrap text-white uppercase drop-shadow-[0px_5.72px_48.66px_#FECF4D66] lg:text-[2.4vw] ${className}`}>
      {children}
    </motion.p>
  );
};

export const CarrotSpan = ({ children }: { children: ReactNode }) => {
  return (
    <span className="bg-[linear-gradient(127.11deg,_#FFFD64_-1.14%,_rgba(242,_101,_2,_0.98)_45.75%)] bg-clip-text text-transparent">
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

export const RadialText = ({ children }: { children: ReactNode }) => {
  return (
    <div className="font-gilroy w-full bg-[radial-gradient(54.59%_124.19%_at_50%_50%,_#FFFFFF_49%,_#7C610A_100%)] bg-clip-text text-start text-[1.7708333333vw] leading-[1.1] text-transparent">
      {children}
    </div>
  );
};
