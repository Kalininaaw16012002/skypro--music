// app/components/Track/TrackItem.tsx (или внутри track.tsx перед основным экспортом)
'use client';

import styles from './track.module.css';
import Link from 'next/link';
import classnames from 'classnames';
import { formatTime } from '@/app/utils/helper';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { setCurrentTrack, setIsPlay } from '@/app/store/features/trackSlice';
import { TrackType } from '@/app/sharedTypes/sharedTypes';
import { useLikeTrack } from '@/app/hooks/useLikeTracks';

interface TrackItemProps {
  track: TrackType;
  currentTrack: TrackType | null;
  isPlay: boolean;
}

export default function TrackItem({
  track,
  currentTrack,
  isPlay,
}: TrackItemProps) {
  const { isLoading, toggleLike, isLike } = useLikeTrack(track);
  const dispatch = useAppDispatch();

  const onClickTrack = () => {
    const isSameTrack = currentTrack?._id === track._id;
    dispatch(setCurrentTrack(track));
    dispatch(setIsPlay(!isSameTrack || !isPlay));
  };

  const isCurrent = Boolean(currentTrack && currentTrack._id === track._id);
  const isPlaying = isCurrent && isPlay;

  return (
    <div className={styles.playlist__item} onClick={onClickTrack}>
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
            {isCurrent ? (
              <svg
                className={`${styles.track__titleSvg} ${styles['track__titleSvg--active']} ${isPlaying ? styles['track__titleSvg--pulsing'] : ''}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg className={styles.track__titleSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
              </svg>
            )}
          </div>
          <div>
            <Link className={styles.track__titleLink} href="">
              {track.name} <span className={styles.track__titleSpan}></span>
            </Link>
          </div>
        </div>

        <div className={styles.track__author}>
          <Link className={styles.track__authorLink} href="">
            {track.author}
          </Link>
        </div>

        <div className={styles.track__album}>
          <Link className={styles.track__albumLink} href="">
            {track.album}
          </Link>
        </div>

        <div className={styles.track__actions}>
          <button
            className={classnames(styles.track__likeBtn, {
              [styles['track__likeBtn--active']]: isLike,
              [styles['track__likeBtn--loading']]: isLoading,
            })}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
            disabled={isLoading}
            aria-label={
              isLike ? 'Убрать из избранного' : 'Добавить в избранное'
            }
            type="button"
          >
            <svg className={styles.track__likeSvg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
            </svg>
          </button>

          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
