import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUnit } from 'effector-react';
import { useTranslation } from '../../hooks/useTranslation';
import {
  $isAuthLoading,
  loginClicked,
  registerClicked,
} from '../../models/auth';
import { $lang, changeLang } from '../../models/language';
import { Button } from '../ui/Button';
import { LogoSmall } from '../ui/LogoSmall';

export const Header = () => {
  const { t } = useTranslation();
  const [lang, isAuthLoading] = useUnit([$lang, $isAuthLoading]);

  const [handleChangeLang, handleLogin, handleRegister] = useUnit([
    changeLang,
    loginClicked,
    registerClicked,
  ]);

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
        <a href="/">
          <LogoSmall />
        </a>
      </div>
      {/* <nav style={{ display: 'flex', gap: 32 }}>
        {navLinks.map((link: NavLink) => (
          <a
            key={link.translationKey}
            href={link.href}
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: 16,
              fontWeight: 500,
            }}>
            {link.label}
          </a>
        ))}
      </nav> */}
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
