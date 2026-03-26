'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/app/store/store';
import {
  setPageTitle,
  setLoading,
  setError,
  setCurrentPlaylist,
  setAllTracks,
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
        dispatch(setAllTracks(data)); 
      })
      .catch((err) => {
        console.error('Ошибка загрузки треков:', err);
        dispatch(setError('Не удалось загрузить треки'));
      }).finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  return <TrackLayout />;
}
