'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import {
  setPageTitle,
  setLoading,
  setError,
  setCurrentPlaylist,
  setAllTracks,
  setFavoriteTracks,
} from '@/app/store/features/trackSlice';
import { getTracks, getFavoriteTracks } from '@/app/services/tracks/tracksApi';
import TrackLayout from '@/app/components/TrackLayot/tracklayot';

export default function MainPage() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { access } = useAppSelector((state) => state.auth);

  const isFavoritesPage = pathname === '/my-tracks';

  useEffect(() => {
    dispatch(setPageTitle(isFavoritesPage ? 'Мои треки' : 'Треки'));
    dispatch(setError(null));
    dispatch(setLoading(true));

    if (isFavoritesPage && !access) {
      dispatch(setError('Требуется авторизация'));
      dispatch(setLoading(false));
      return;
    }

    const loadTracks = isFavoritesPage
      ? () => getFavoriteTracks(access!)
      : getTracks;

    loadTracks()
      .then((data) => {
        dispatch(setCurrentPlaylist(data));
        dispatch(setAllTracks(data));

        if (isFavoritesPage) {
          dispatch(setFavoriteTracks(data));
        }
      })
      .catch((err) => {
        console.error('Ошибка загрузки треков:', err);
        dispatch(
          setError(
            isFavoritesPage
              ? 'Не удалось загрузить избранные треки'
              : 'Не удалось загрузить треки',
          ),
        );
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch, access, isFavoritesPage]);

  return <TrackLayout />;
}
