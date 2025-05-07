import { Background } from './components/layout/Background';
import { Header } from './components/layout/Header';
import { Hero } from './components/layout/Hero';
import { useTranslation } from './hooks/useTranslation';

// Компонент для секции с заголовком и описанием
const Section = ({
  id,
  titleKey,
  descriptionKey,
}: {
  id: string;
  titleKey: string;
  descriptionKey: string;
}) => {
  const { t } = useTranslation();

  return (
    <section
      id={id}
      style={{
        padding: '100px 50px',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          color: '#fff',
        }}>
        {t(titleKey)}
      </h1>
      <p
        style={{
          fontSize: '1.125rem',
          marginBottom: '2rem',
          color: 'rgba(255, 255, 255, 0.8)',
        }}>
        {t(descriptionKey)}
      </p>
    </section>
  );
};

export const App = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #222 60%, #000 100%)',
        color: '#fff',
        overflow: 'hidden',
      }}>
      <Background />
      <Header />
      <Hero />

      {/* Якорные секции */}
      <Section
        id="blog"
        titleKey="pages.blog.title"
        descriptionKey="pages.blog.description"
      />
      <Section
        id="loyalty"
        titleKey="pages.loyalty.title"
        descriptionKey="pages.loyalty.description"
      />
      <Section
        id="contacts"
        titleKey="pages.contacts.title"
        descriptionKey="pages.contacts.description"
      />
      <Section
        id="advantages"
        titleKey="pages.advantages.title"
        descriptionKey="pages.advantages.description"
      />
    </div>
  );
};
