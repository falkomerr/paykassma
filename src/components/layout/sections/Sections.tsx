import { ScrollArea } from '@/components/components/ui/scrollarea';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { cn } from '@/lib/utils';
import { goToNextSection, goToPrevSection } from '@/models/journey';
import { useUnit } from 'effector-react';
import { motion } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { sectionVariants, transition } from '../SectionsContainer';

interface SectionProps {
  id: string;
  title: string;
  children?: ReactNode;
  className?: string;
}

export const Section = ({ children, className = '' }: SectionProps) => {
  return (
    <motion.section
      variants={sectionVariants}
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
  opacity = 1,
  className,
}: UniversalCardProps) => {
  const [cardClasses, setCardClasses] = useState(
    `absolute transition-all duration-300 ease-in-out`,
  );
  const [cardOpacity, setCardOpacity] = useState(opacity);

  useEffect(() => {
    const baseClasses = 'absolute transition-all duration-300 ease-in-out';

    if (position === 'left') {
      setCardOpacity(1);
      setCardClasses(
        `${baseClasses} z-30 backdrop-blur-xl rounded-[40px] md:rounded-[30px] opacity-100 translate-x-0 scale-100`,
      );
    } else if (position === 'center') {
      setCardOpacity(0.2);
      setCardClasses(
        `${baseClasses} z-20 backdrop-blur-xl rounded-[40px] md:rounded-[30px] translate-x-[15%] translate-y-[3%] rotate-6`,
      );
    } else if (position === 'right') {
      setCardOpacity(0.2);
      setCardClasses(
        `${baseClasses} z-10 backdrop-blur-xl rounded-[40px] md:rounded-[30px] translate-x-[30%] translate-y-[6%] rotate-12`,
      );
    } else if (position === 'left-1') {
      setCardOpacity(0.2);
      setCardClasses(
        `${baseClasses} z-20 backdrop-blur-xl rounded-[40px] md:rounded-[30px] translate-x-[-15%] translate-y-[3%] rotate-[-6deg]`,
      );
    } else if (position === 'left-2') {
      setCardOpacity(0.2);
      setCardClasses(
        `${baseClasses} z-10 backdrop-blur-xl rounded-[40px] md:rounded-[30px] translate-x-[-30%] translate-y-[6%] rotate-[-12deg]`,
      );
    } else if (position === 'hidden') {
      setCardOpacity(0);
      setCardClasses(`${baseClasses} z-10 scale-50`);
    }
  }, [position]);

  useEffect(() => {
    if (opacity === 0) {
      setCardOpacity(opacity);
    }
  }, [opacity]);

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: cardOpacity, y: 0 }}
      transition={{ duration: 0.3 }}>
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
  const [animateHiding, setAnimateHiding] = useState(false);
  const isScrollLocked = useRef(false);

  useEffect(() => {
    const handleDirection = (direction: 'up' | 'down') => {
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

      if (direction === 'down' && activeIndex < cards.length - 1) {
        setActiveIndex((prev) => prev + 1);
        setAnimateHiding(false);
      } else if (direction === 'up' && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
        setAnimateHiding(false);
      } else if (direction === 'down' && activeIndex === cards.length - 1) {
        nextSection();
        setAnimateHiding(true);
      } else if (direction === 'up' && activeIndex === 0) {
        prevSection();
        setAnimateHiding(true);
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
      {textProvider && <SectionText>{textProvider(activeIndex)}</SectionText>}

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
              className={className}
              opacity={animateHiding ? 0 : 1}
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

export const Section3 = () => {
  const { t } = useTranslation();

  return (
    <Section id="section3" title={t('sections.section4.title')}>
      <SectionText>
        {t('sections.section4.content').split('300 офферов')[0]}
        <CarrotSpan>{t('sections.common.offers300')}</CarrotSpan>
        {t('sections.section4.content').split('300 офферов')[1]}
      </SectionText>
    </Section>
  );
};
export const Section4 = () => {
  const { t } = useTranslation();

  const geoCards = [
    { imgSrc: '/diversify.svg', imgAlt: 'our-anwser' },
    { imgSrc: '/change-flow.svg', imgAlt: 'our-anwser' },
    { imgSrc: '/test-new-offers.svg', imgAlt: 'our-anwser' },
    { imgSrc: '/take-payments.svg', imgAlt: 'our-anwser' },
  ];

  return (
    <Section id="section4" title={t('sections.section4.title')}>
      <UniversalCarousel
        id="geo-carousel"
        title={t('sections.section2.title')}
        cards={geoCards}
        className="aspect-[344/341]"
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

      <div className="relative mt-8 flex aspect-[617/179] w-[32.2395833333vw] flex-col items-center justify-center gap-y-1.5 px-10 py-4">
        <img src="/scale-your.svg" className="absolute inset-0" />
        <RadialText>{t('sections.section5.radialText')}</RadialText>
        <p className="font-gilroy text-[1.0416666667vw] text-white opacity-60">
          {t('sections.section5.radialTextDescription')}
        </p>
      </div>
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
      <ScrollArea className="mx-auto -mt-12 flex h-[22vw] w-fit">
        <div className="flex h-fit w-fit gap-x-5 px-4">
          {Array.from({ length: 5 }).map((_, index) => {
            return (
              <CardContainer key={index}>
                <CardBody>
                  <CardItem translateZ={40}>
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.7,
                        delay: (index + 2) * 0.6,
                      }}
                      src="/meet-card.png"
                      alt="meet-card"
                      draggable={false}
                      className="aspect-[435/389] max-h-[300px] w-[17.5vw] shrink-0 max-lg:min-w-[20.8125rem]"
                    />
                  </CardItem>
                </CardBody>
              </CardContainer>
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
        className="absolute top-40 left-1/2 aspect-[2506/1024] w-full -translate-x-[40%] lg:top-20"
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
      className={`daysone text-[6.4vw] leading-[1.15] tracking-tighter whitespace-pre-wrap text-white uppercase drop-shadow-[0px_5.72px_48.66px_#FECF4D66] lg:text-[2.4vw] ${className}`}>
      {children}
    </p>
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
