'use client';

import styles from './track.module.css';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import TrackItem from './TrackItem';
import { getFavoriteTracks } from '@/app/services/tracks/tracksApi';
import { setFavoriteTracksFromApi } from '@/app/store/features/trackSlice';
import { useEffect } from 'react';

export default function Track() {
   const dispatch = useAppDispatch(); 
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const playlist = useAppSelector((state) => state.tracks.filteredPlaylist);
  const loading = useAppSelector((state) => state.tracks.loading);
  const error = useAppSelector((state) => state.tracks.error);
   const { access } = useAppSelector((state) => state.auth);
  const favoriteTracks = useAppSelector((state) => state.tracks.favoriteTracks);

   useEffect(() => {
    if (access && favoriteTracks.length === 0) {
      getFavoriteTracks(access)
        .then((tracks) => {
          dispatch(setFavoriteTracksFromApi(tracks));
        })
        .catch((err) => {
          console.error('Ошибка загрузки избранных треков:', err);
        });
    }
  }, [access, favoriteTracks.length, dispatch]);

  if (loading && playlist.length === 0) {
    return (
      <div className={styles.content__playlist}>
        <div className={styles.content__loading}>Загрузка...</div>
      </div>
    );
  }

  if (error && playlist.length === 0) {
    return (
      <div className={styles.content__playlist}>
        <div className={styles.content__error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.content__playlist}>
      {playlist.map((track) => (
        <TrackItem
          key={track._id}
          track={track}
          currentTrack={currentTrack}
          isPlay={isPlay}
        />
      ))}
    </div>
  );
}
