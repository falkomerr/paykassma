import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../ui/Button';
import { LogoBig } from '../ui/LogoBig';

export const Hero = () => {
  const { t } = useTranslation();

  // Функция для плавной прокрутки к первой секции
  const scrollToFirstSection = () => {
    const firstSection = document.getElementById('blog');
    if (firstSection) {
      firstSection.scrollIntoView({ behavior: 'smooth' });
      // Обновляем URL без перезагрузки страницы
      window.history.pushState(null, '', '#blog');
    }
  };

  return (
    <section
      id="home"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
        zIndex: 1,
        position: 'relative',
      }}>
      <div style={{ marginBottom: 16 }}>
        <LogoBig />
      </div>
      <div
        className="gilroy"
        style={{
          fontWeight: 400,
          fontSize: 22,
          lineHeight: '100%',
          letterSpacing: '0%',
          textAlign: 'center',
          verticalAlign: 'middle',
          color: '#ccc',
          marginBottom: 40,
          maxWidth: 480,
        }}>
        {t('hero.description')}
      </div>
      <Button variant="journey" size="lg" onClick={scrollToFirstSection}>
        {t('buttons.submit')}
      </Button>
    </section>
  );
};
