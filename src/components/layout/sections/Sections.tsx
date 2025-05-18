import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children?: ReactNode;
  className?: string;
  showContent?: boolean;
}

// Анимационные варианты для контента секции
const contentVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.17, 0.67, 0.26, 0.99],
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.5,
      ease: [0.46, 0.03, 0.52, 0.96],
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Анимационные варианты для дочерних элементов
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.17, 0.67, 0.26, 0.99],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.5,
      ease: [0.46, 0.03, 0.52, 0.96],
    },
  },
};

// Анимационные варианты для изображений
const imageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.17, 0.67, 0.26, 0.99],
      delay: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.5,
      ease: [0.46, 0.03, 0.52, 0.96],
    },
  },
};

export const Section = ({
  id,
  children,
  className = '',
  showContent = false,
}: SectionProps) => {
  // Для логирования изменений (можно удалить в продакшене)
  const prevShowContentRef = useRef<boolean>(false);

  useEffect(() => {
    if (prevShowContentRef.current !== showContent) {
      console.log(`[Секция ${id}] showContent изменился: ${showContent}`);
      prevShowContentRef.current = showContent;
    }
  }, [id, showContent]);

  return (
    <section
      id={id}
      className={`section relative z-10 flex h-screen w-full flex-col items-start justify-center px-[3.75rem] ${className}`}>
      <AnimatePresence mode="wait">
        {showContent && (
          <motion.div
            className="section-content"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// Компонент обертки для анимации дочерних элементов
export const SectionItem = ({
  children,
  isImage = false,
}: {
  children: ReactNode;
  isImage?: boolean;
}) => {
  return (
    <motion.div variants={isImage ? imageVariants : itemVariants}>
      {children}
    </motion.div>
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
      className="">
      {showAnimation && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
          }}
          className="w-full">
          <AnimatePresence mode="wait">
            {showContent && (
              <motion.div
                className="section-content"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}>
                <SectionItem>
                  <ChapterText>Глава 1: Преимущества</ChapterText>
                </SectionItem>
                <SectionItem>
                  <SectionText>
                    Мы масштабируем <br /> вашу прибыль <br />
                    <CarrotSpan>в Igaming</CarrotSpan>
                  </SectionText>
                </SectionItem>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
      {!showAnimation && (
        <AnimatePresence mode="wait">
          {showContent && (
            <motion.div
              className="section-content"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}>
              <SectionItem>
                <ChapterText>Глава 1: Преимущества</ChapterText>
              </SectionItem>
              <SectionItem>
                <SectionText>
                  Мы масштабируем <br /> вашу прибыль <br />
                  <CarrotSpan>в Igaming</CarrotSpan>
                </SectionText>
              </SectionItem>
            </motion.div>
          )}
        </AnimatePresence>
      )}
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
      <AnimatePresence mode="wait">
        {showContent && (
          <motion.div
            className="section-content"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}>
            <SectionItem>
              <SectionText>
                <CarrotSpan>Знаем ГЕО</CarrotSpan> с которых <br /> прямо сейчас
                идет <br /> профит
              </SectionText>
            </SectionItem>
            <SectionItem isImage>
              <img
                src="/our-anwser.png"
                alt="our-anwser"
                className="aspect-square w-[17.9166666667vw]"
              />
            </SectionItem>
          </motion.div>
        )}
      </AnimatePresence>
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
      <AnimatePresence mode="wait">
        {showContent && (
          <motion.div
            className="section-content"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}>
            <SectionItem>
              <SectionText>
                <CarrotSpan>Знаем ГЕО</CarrotSpan> с которых <br /> прямо сейчас
                идет <br /> профит
              </SectionText>
            </SectionItem>
            <SectionItem isImage>
              <img
                src="/our-reklams.png"
                alt="our-reklams"
                className="aspect-square w-[17.9166666667vw]"
              />
            </SectionItem>
          </motion.div>
        )}
      </AnimatePresence>
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
      <AnimatePresence mode="wait">
        {showContent && (
          <motion.div
            className="section-content"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}>
            <SectionItem>
              <SectionText>
                Более <CarrotSpan>300 офферов</CarrotSpan> <br /> от топовых
                рекламодателей <br /> в одном месте
              </SectionText>
            </SectionItem>
            <SectionItem isImage>
              <img
                src="/our-advantages.png"
                alt="our-advantages"
                className="aspect-[596/270] w-[31.0166666667vw]"
              />
            </SectionItem>
          </motion.div>
        )}
      </AnimatePresence>
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
      <AnimatePresence mode="wait">
        {showContent && (
          <motion.div
            className="section-content"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}>
            <SectionItem>
              <SectionText>
                <CarrotSpan>Усиливаем</CarrotSpan> бюджеты <br /> арбитражных
                команд
              </SectionText>
            </SectionItem>
            <SectionItem>
              <SectionDescription>
                Масштабируем ваши успешные связки предоставляя бюджеты <br />{' '}
                для получения максимального профита с рекламной кампании
              </SectionDescription>
            </SectionItem>
          </motion.div>
        )}
      </AnimatePresence>
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
