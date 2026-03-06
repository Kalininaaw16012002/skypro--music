'use client';

import classnames from 'classnames';
import Link from 'next/link';
import styles from './bar.module.css';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import {
  ChangeEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  setIsPlay,
  setNextTrack,
  toogleShuffle,
} from '@/app/store/features/trackSlice';
import ProgressBar from '../Progress/progress';

export default function Bar() {
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoop, setIsLoop] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLoadedTrack, setIsLoadedTrack] = useState(false);

  useEffect(() => {
    setIsLoadedTrack(false);
  }, [currentTrack]);

  useEffect(() => {
    if (currentTrack && isPlay && audioRef.current) {
      audioRef.current.play();
    }
  }, [currentTrack, isPlay]);

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

  const onToggleLoop = () => {
    setIsLoop(!isLoop);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      //   console.log(audioRef.current.currentTime);
      //   console.log(audioRef.current.duration);
      console.log(audioRef.current.volume);
    }
  };

  const onLoadedMetadata = () => {
    console.log('start');
    if (audioRef.current) {
      audioRef.current.play();
      dispatch(setIsPlay(true));
    }
  };

  const onCangeProgress = (e: ChangeEvent<HTMLInputElement, Element>) => {
    if (audioRef.current) {
      const inputTime = Number(e.target.value);

      audioRef.current.currentTime = inputTime;
    }
  };

  const onNextTrack = () => {
    dispatch(setNextTrack());
  };

  const onToogleShuffle = () => {
    dispatch(toogleShuffle());
  };

  return (
    <div className={styles.bar}>
      <audio
        ref={audioRef}
        src={currentTrack?.track_file}
        loop={true}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => console.log('Next track')}
      ></audio>
      <div className={styles.bar__content}>
        <ProgressBar
          max={audioRef.current?.duration || 0}
          step={0.1}
          readOnly={!isLoadedTrack}
          value={11}
          onChange={onCangeProgress}
        />
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div className={styles.player__btnPrev}>
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
                    xmlns="http://www.w3.org/2000/svg"
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
                className={classnames(styles.player__btnRepeat, styles.btnIcon)}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div
                className={classnames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                )}
                onClick={onToogleShuffle}
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

              <div className={styles.trackPlay__dislike}>
                <div
                  className={classnames(
                    styles.player__btnShuffle,
                    styles.btnIcon,
                  )}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div
                  className={classnames(
                    styles.trackPlay__dislike,
                    styles.btnIcon,
                  )}
                >
                  <svg className={styles.trackPlay__dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
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
                  name="range"
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
