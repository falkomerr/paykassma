import { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children?: ReactNode;
}

export const Section = ({ id }: SectionProps) => {
  return (
    <section
      id={id}
      className="section"
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
      }}></section>
  );
};

export const Section1 = () => {
  return (
    <Section id="section1" title="Секция 1">
      <ChapterText>Глава 1: Преимущества</ChapterText>
    </Section>
  );
};

export const Section2 = () => {
  return <Section id="section2" title="Секция 2"></Section>;
};

export const Section3 = () => {
  return <Section id="section3" title="Секция 3"></Section>;
};

export const Section4 = () => {
  return <Section id="section4" title="Секция 4"></Section>;
};

export const Section5 = () => {
  return <Section id="section5" title="Секция 5"></Section>;
};

export const ChapterText = ({ children }: { children: ReactNode }) => {
  return (
    <p className="bg-gradient-to-r from-[#FFD01F] via-[#FFFD64] via-30% to-[#FFC61D] bg-clip-text text-transparent">
      {children}
    </p>
  );
};
