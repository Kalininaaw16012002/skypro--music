'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import {
  setPageTitle,
  setCurrentPlaylist,
  setLoading,
  setError,
  setFavoriteTracks,
  setAllTracks,
} from '@/app/store/features/trackSlice';
import {
  getTrackIdsByCategory,
  getFavoriteTracks,
  getTracks,
} from '@/app/services/tracks/tracksApi';
import TrackLayout from '@/app/components/TrackLayot/tracklayot';

const CATEGORY_TITLES: Record<string, string> = {
  '4': 'Индизаряд',
  '3': '100 танцевальных хитов',
  '2': 'Плейлист дня',
  favorite: 'Мой плейлист',
};

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const categoryId = params?.id;

  const allTracks = useAppSelector((state) => state.tracks.allTracks);
  const { access } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!categoryId) return;

    const title = CATEGORY_TITLES[categoryId] || 'Подборка';
    dispatch(setPageTitle(title));
    dispatch(setError(null));
    dispatch(setLoading(true));

    if (categoryId === 'favorite') {
      if (!access) {
        dispatch(setError('Необходимо войти в систему'));
        dispatch(setLoading(false));
        dispatch(setCurrentPlaylist([]));
        return;
      }

      getFavoriteTracks(access)
        .then((tracks) => {
          dispatch(setFavoriteTracks(tracks));
          dispatch(setCurrentPlaylist(tracks));
        })
        .catch((err) => {
          console.error('Ошибка загрузки избранного:', err);
          dispatch(setError('Не удалось загрузить плейлист'));
          dispatch(setCurrentPlaylist([]));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });

      return;
    }

    const loadCategoryTracks = async () => {
      try {
        let tracksToFilter = allTracks;
        if (allTracks.length === 0) {
          const all = await getTracks();
          dispatch(setAllTracks(all));
          tracksToFilter = all;
        }

        const trackIds = await getTrackIdsByCategory(categoryId);
        const trackIdsSet = new Set(trackIds.map((id) => String(id)));

        const filteredTracks = tracksToFilter.filter((track) =>
          trackIdsSet.has(String(track._id)),
        );

        dispatch(setCurrentPlaylist(filteredTracks));
      } catch (err) {
        console.error('Ошибка загрузки категории:', err);
        dispatch(setError('Не удалось загрузить подборку'));
        dispatch(setCurrentPlaylist([]));
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadCategoryTracks();
  }, [dispatch, categoryId, access]);

  return <TrackLayout />;
}
