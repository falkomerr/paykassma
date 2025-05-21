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
import { AnimatedButton } from '../ui/AnimatedButton';
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
    <header className="via-58.25% absolute top-0 right-0 left-0 z-50 flex h-[10.6875rem] items-start justify-between bg-gradient-to-b from-black from-0% via-black/42 to-black/0 to-100% px-15 pt-7.5">
      <div className="flex w-full items-center gap-3">
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
      <div className="flex w-fit items-center gap-4">
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
        <div className="flex items-center gap-4">
          <a href="/register">
            <AnimatedButton
              variant="default"
              onClick={() => handleRegister()}
              disabled={isAuthLoading}>
              {t('buttons.register')}
            </AnimatedButton>
          </a>
          <a href="/login">
            <AnimatedButton
              variant="login"
              onClick={() => handleLogin()}
              disabled={isAuthLoading}>
              {t('buttons.login')}
            </AnimatedButton>
          </a>
        </div>
      </div>
    </header>
  );
};
