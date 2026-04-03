'use client';

import classnames from 'classnames';
import Link from 'next/link';
import styles from './bar.module.css';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  setIsPlay,
  setNextTrack,
  setPrevTrack,
  toogleShuffle,
} from '@/app/store/features/trackSlice';
import ProgressBar from '../Progress/progress';
import { formatTime } from '@/app/utils/helper';
import { useLikeTrack } from '@/app/hooks/useLikeTracks';

export default function Bar() {
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle);
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoop, setIsLoop] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoadedTrack, setIsLoadedTrack] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const { isLike, toggleLike, isLoading } = useLikeTrack(currentTrack);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    setIsLoadedTrack(false);
    setCurrentTime(0);
    setDuration(0);
  }, [currentTrack]);

  useEffect(() => {
    if (currentTrack && isPlay && audioRef.current) {
      audioRef.current.play().catch(() => {
        dispatch(setIsPlay(false));
      });
    }
  }, [currentTrack, isPlay, dispatch]);

  if (!currentTrack) return <></>;

  const playTrack = () => {
    if (audioRef.current) {
      audioRef.current?.play();
      dispatch(setIsPlay(true));
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current?.pause();
      dispatch(setIsPlay(false));
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoadedTrack(true);
      if (isPlay) {
        audioRef.current.play();
      }
    }
  };

  const onChangeProgress = (e: ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const onPrevTrack = () => dispatch(setPrevTrack());
  const onNextTrack = () => dispatch(setNextTrack());

  const onToggleLoop = () => {
    setIsLoop(!isLoop);
    if (audioRef.current) {
      audioRef.current.loop = !isLoop;
    }
  };

  const onToggleShuffle = () => dispatch(toogleShuffle());

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) setIsMuted(false);
    if (newVolume === 0) setIsMuted(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted && volume === 0) setVolume(0.5);
  };

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading && currentTrack) {
      toggleLike();
    }
  };

  return (
    <div className={styles.bar}>
      <audio
        ref={audioRef}
        src={currentTrack?.track_file}
        loop={isLoop}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onNextTrack}
      />

      <div className={styles.bar__content}>
        {!isLoadedTrack && (
          <div className={styles.loading__indicator}>
            <span>Трек загружается...</span>
          </div>
        )}

        <div className={styles.progress__container}>
          <ProgressBar
            max={duration || 0}
            value={currentTime}
            step={0.1}
            readOnly={!isLoadedTrack}
            onChange={onChangeProgress}
          />
          <div className={styles.progress__timing}>
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div onClick={onPrevTrack} className={styles.player__btnPrev}>
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>

              <div
                className={classnames(styles.player__btnPlay, styles.btn)}
                onClick={isPlay ? pauseTrack : playTrack}
              >
                {isPlay ? (
                  <svg
                    className={styles.player__btnPlaySvg}
                    width="15"
                    height="19"
                    viewBox="0 0 15 19"
                    fill="none"
                  >
                    <rect width="5" height="19" fill="#D9D9D9" />
                    <rect x="10" width="5" height="19" fill="#D9D9D9" />
                  </svg>
                ) : (
                  <svg className={styles.player__btnPlaySvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-play"></use>
                  </svg>
                )}
              </div>

              <div onClick={onNextTrack} className={styles.player__btnNext}>
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>

              <div
                onClick={onToggleLoop}
                className={classnames(
                  styles.player__btnRepeat,
                  styles.btnIcon,
                  {
                    [styles.active]: isLoop,
                  },
                )}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>

              <div
                className={classnames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                  {
                    [styles.active]: isShuffle,
                  },
                )}
                onClick={onToggleShuffle}
              >
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles.trackPlay__author}>
                  <Link className={styles.trackPlay__authorLink} href="">
                    {currentTrack.name}
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    {currentTrack.author}
                  </Link>
                </div>
              </div>
              <div className={styles.trackPlay__actions}>
                <button
                  type="button"
                  className={classnames(
                    styles.trackPlay__likeBtn,
                    styles.btnIcon,
                    {
                      [styles.active]: isLike,
                      [styles.loading]: isLoading,
                    },
                  )}
                  onClick={handleLikeClick}
                  disabled={isLoading}
                  aria-label={
                    isLike ? 'Убрать из избранного' : 'Добавить в избранное'
                  }
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div onClick={toggleMute} className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={classnames(styles.volume__progress, styles.btn)}>
                <input
                  className={classnames(
                    styles.volume__progressLine,
                    styles.btn,
                  )}
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
