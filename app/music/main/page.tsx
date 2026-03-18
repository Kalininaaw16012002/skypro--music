'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/app/store/store';
import {
  setPageTitle,
  setLoading,
  setError,
  setCurrentPlaylist,
} from '@/app/store/features/trackSlice';
import { getTracks } from '@/app/services/tracks/tracksApi';
import TrackLayout from '@/app/components/TrackLayot/tracklayot';

export default function MainPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Треки'));
    dispatch(setError(null));
    dispatch(setLoading(true));

    getTracks()
      .then((data) => {
        dispatch(setCurrentPlaylist(data));
      })
      .catch((err) => {
        console.error('Ошибка загрузки треков:', err);
        dispatch(setError('Не удалось загрузить треки'));
      });
  }, [dispatch]);

  return <TrackLayout />;
}
