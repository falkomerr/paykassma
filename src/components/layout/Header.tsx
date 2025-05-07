import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUnit } from 'effector-react';
import { useEffect, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import {
  $isAuthLoading,
  loginClicked,
  registerClicked,
} from '../../models/auth';
import { $lang, changeLang } from '../../models/language';
import { $navLinks, NavLink } from '../../models/navigation';
import { Button } from '../ui/Button';
import { LogoSmall } from '../ui/LogoSmall';

export const Header = () => {
  const { t } = useTranslation();
  const [activeHash, setActiveHash] = useState<string>('');

  // Отслеживание изменения хэша для подсветки активной ссылки
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    // Установка начального значения
    handleHashChange();

    // Подписка на изменение хэша
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Используем хук useUnit для получения значений из сторов и событий
  const [lang, navLinks, isAuthLoading] = useUnit([
    $lang,
    $navLinks,
    $isAuthLoading,
  ]);
  const [handleChangeLang, handleLogin, handleRegister] = useUnit([
    changeLang,
    loginClicked,
    registerClicked,
  ]);

  // Прокрутка к началу страницы
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', '#home');
    setActiveHash('#home');
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 48px 0 32px',
        position: 'relative',
        zIndex: 2,
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <a href="#home" onClick={scrollToTop}>
          <LogoSmall />
        </a>
      </div>
      <nav style={{ display: 'flex', gap: 32 }}>
        {navLinks.map((link: NavLink) => (
          <a
            key={link.translationKey}
            href={link.href}
            style={{
              color: activeHash === link.href ? '#f5c93c' : '#fff',
              textDecoration: 'none',
              fontSize: 16,
              fontWeight: 500,
            }}
            onClick={(e) => {
              // Плавная прокрутка к секции
              const targetId = link.href.substring(1); // Убираем #
              const targetElement = document.getElementById(targetId);
              if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
                // Обновляем URL без перезагрузки страницы
                window.history.pushState(null, '', link.href);
                setActiveHash(link.href);
              }
            }}>
            {link.label}
          </a>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Select value={lang} onValueChange={handleChangeLang}>
          <SelectTrigger className="w-[70px] border-none bg-transparent text-white focus:border-none focus:ring-0">
            <SelectValue
              placeholder="RU"
              style={{ color: '#fff', fontSize: 16 }}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ru">RU</SelectItem>
            <SelectItem value="en">EN</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="mr-2 bg-black/20 text-white/90"
          onClick={() => handleRegister()}
          disabled={isAuthLoading}>
          {t('buttons.register')}
        </Button>
        <Button
          variant="gold"
          className="bg-black/20"
          onClick={() => handleLogin()}
          disabled={isAuthLoading}>
          {t('buttons.login')}
        </Button>
      </div>
    </header>
  );
};
