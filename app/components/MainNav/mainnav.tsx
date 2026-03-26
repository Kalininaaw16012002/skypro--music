'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './mainnav.module.css';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { clearAuth } from '@/app/store/features/authSlice';
import { useRouter } from 'next/navigation';

export default function MainNav() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = useAppSelector((state) => !!state.auth.access);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(clearAuth());

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    router.push('/auth/signin');
    router.refresh();
  };

  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Image
          width={250}
          height={170}
          className={styles.logo__image}
          src="/img/logo.png"
          alt={'logo'}
        />
      </div>
      <div className={styles.nav__burger} onClick={toggleMenu}>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>
      {isMenuOpen && (
        <div className={styles.nav__menu}>
          <ul className={styles.menu__list}>
            <li className={styles.menu__item}>
              <Link href="#" className={styles.menu__link}>
                Главное
              </Link>
            </li>
            <li className={styles.menu__item}>
              <Link href="#" className={styles.menu__link}>
                Мой плейлист
              </Link>
            </li>
            {isAuthenticated ? (
              <li className={styles.menu__item}>
                <button
                  onClick={handleLogout}
                  className={styles.menu__link}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    font: 'inherit',
                  }}
                >
                  Выйти
                </button>
              </li>
            ) : (
              <li className={styles.menu__item}>
                <Link href="/auth/signin" className={styles.menu__link}>
                  Войти
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
