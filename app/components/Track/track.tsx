'use client';

import styles from './track.module.css';
import { useAppSelector } from '@/app/store/store';
import TrackItem from './TrackItem';

export default function Track() {
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const playlist = useAppSelector((state) => state.tracks.filteredPlaylist);
  const loading = useAppSelector((state) => state.tracks.loading);
  const error = useAppSelector((state) => state.tracks.error);

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
