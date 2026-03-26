'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/app/store/store';
import {
  setPageTitle,
  setCurrentPlaylist,
  setLoading,
  setError,
} from '@/app/store/features/trackSlice';
import { getTracksByCategory } from '@/app/services/tracks/tracksApi';
import TrackLayout from '@/app/components/TrackLayot/tracklayot';

const CATEGORY_TITLES: Record<string, string> = {
  '4': 'Инди-заряд',
  '3': '100 танцевальных хитов',
  '2': 'Плейлист дня',
};

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const categoryId = params?.id;

  useEffect(() => {
    if (!categoryId) return;

    const title = CATEGORY_TITLES[categoryId] || 'Подборка';
    dispatch(setPageTitle(title));
    dispatch(setCurrentPlaylist([]));
    dispatch(setError(null));
    dispatch(setLoading(true));

    getTracksByCategory(categoryId)
      .then((data) => {
        dispatch(setCurrentPlaylist(data));
      })
      .catch((err) => {
        console.error('Ошибка загрузки категории:', err);
        dispatch(setError('Не удалось загрузить подборку'));
      });
  }, [dispatch, categoryId]);

  return <TrackLayout />;
}
