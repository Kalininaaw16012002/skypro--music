'use client';

import { registerUser } from '@/app/services/auth/authApi';
import styles from './signup.module.css';
import classNames from 'classnames';
import Link from 'next/link';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim() || !username.trim()) {
      return setErrorMessage('Заполните все поля');
    }

    if (password !== confirmPassword) {
      return setErrorMessage('Пароли не совпадают');
    }

    setIsLoading(true);

    registerUser({ email, password, username })
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.result));
        router.push('/auth/signin');
      })
      .catch((error: any) => {
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else if (error.request) {
          setErrorMessage('Нет соединения с сервером');
        } else {
          setErrorMessage('Неизвестная ошибка');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Link href="/music/main">
        <div className={styles.modal__logo}>
          <img src="/img/logo_modal.png" alt="logo" />
        </div>
      </Link>
      <input
        className={classNames(styles.modal__input, styles.login)}
        type="text"
        name="username"
        placeholder="Имя пользователя"
        onChange={onChangeUsername}
      />
      <input
        className={classNames(styles.modal__input)}
        type="email"
        name="email"
        placeholder="Почта"
        onChange={onChangeEmail}
      />
      <input
        className={styles.modal__input}
        type="password"
        name="password"
        placeholder="Пароль"
        onChange={onChangePassword}
      />
      <input
        className={styles.modal__input}
        type="password"
        name="confirmPassword"
        placeholder="Повторите пароль"
        onChange={onChangeConfirmPassword}
      />
      <div className={styles.errorContainer}>{errorMessage}</div>
      <button
        disabled={isLoading}
        onClick={onSubmit}
        className={styles.modal__btnSignupEnt}
      >
        Зарегистрироваться
      </button>
    </>
  );
}
