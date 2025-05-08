import { ReactNode } from 'react';
import { ScrollArrows } from '../../ui/ScrollArrows';

interface SectionProps {
  id: string;
  title: string;
  children?: ReactNode;
}

export const Section = ({ id, title, children }: SectionProps) => {
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
      }}>
      <h2
        className="section-title"
        style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        {title}
      </h2>
      <div className="section-content">{children}</div>
      <ScrollArrows />
    </section>
  );
};

export const Section1 = () => {
  return (
    <Section id="section1" title="Секция 1">
      <p>Содержимое первой секции</p>
    </Section>
  );
};

export const Section2 = () => {
  return (
    <Section id="section2" title="Секция 2">
      <p>Содержимое второй секции</p>
    </Section>
  );
};

export const Section3 = () => {
  return (
    <Section id="section3" title="Секция 3">
      <p>Содержимое третьей секции</p>
    </Section>
  );
};

export const Section4 = () => {
  return (
    <Section id="section4" title="Секция 4">
      <p>Содержимое четвертой секции</p>
    </Section>
  );
};

export const Section5 = () => {
  return (
    <Section id="section5" title="Секция 5">
      <p>Содержимое пятой секции</p>
    </Section>
  );
};
