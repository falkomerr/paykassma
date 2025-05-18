import { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children?: ReactNode;
  className?: string;
}

export const Section = ({ children, className = '' }: SectionProps) => {
  return (
    <section
      className={`relative z-50 flex h-fit h-screen w-fit flex-col items-start justify-center px-[3.75rem] ${className}`}>
      <div>{children}</div>
    </section>
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
        className="aspect-square w-[15.9166666667vw]"
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
        className="aspect-square w-[15.9166666667vw]"
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
      <img
        src="/our-advantages.png"
        alt="our-advantages"
        className="aspect-[596/270] w-[29.0166666667vw]"
      />
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
