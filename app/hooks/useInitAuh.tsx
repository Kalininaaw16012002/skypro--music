'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '../store/store';
import {
  setAccess,
  setRefresh,
  setUserName,
} from '../store/features/authSlice';

export const useInitAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    const userName = localStorage.getItem('user');

    if (access && refresh) {
      dispatch(setAccess(access));
      dispatch(setRefresh(refresh));

      if (userName) {
        try {
          const userData = JSON.parse(userName);
          dispatch(setUserName(userData.email || userData.username || ''));
        } catch (e) {
          console.error('Ошибка парсинга user:', e);
        }
      }
    }
  }, [dispatch]);
};
