'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import {
  setPageTitle,
  setCurrentPlaylist,
  setLoading,
  setError,
} from '@/app/store/features/trackSlice';
import { getTrackIdsByCategory } from '@/app/services/tracks/tracksApi';
import TrackLayout from '@/app/components/TrackLayot/tracklayot';

const CATEGORY_TITLES: Record<string, string> = {
  '4': 'Индизаряд',
  '3': '100 танцевальных хитов',
  '2': 'Плейлист дня',
};

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const categoryId = params?.id;

  const allTracks = useAppSelector((state) => state.tracks.allTracks);

  useEffect(() => {
    if (!categoryId) return;

    const title = CATEGORY_TITLES[categoryId] || 'Подборка';
    dispatch(setPageTitle(title));
    dispatch(setError(null));
    dispatch(setLoading(true));

    getTrackIdsByCategory(categoryId)
      .then((trackIds) => {
        const trackIdsSet = new Set(trackIds.map((id) => String(id)));
        const filteredTracks = allTracks.filter((track) =>
          trackIdsSet.has(String(track._id)),
        );

        dispatch(setCurrentPlaylist(filteredTracks));
      })
      .catch((err) => {
        console.error('Ошибка загрузки категории:', err);
        dispatch(setError('Не удалось загрузить подборку'));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch, categoryId, allTracks]);
  return <TrackLayout />;
}
