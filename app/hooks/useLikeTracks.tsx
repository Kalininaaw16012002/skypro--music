'use client';

import { useState } from 'react';
import { TrackType } from '../sharedTypes/sharedTypes';
import { useAppDispatch, useAppSelector } from '../store/store';
import { withReauth } from '../utils/withReAuth';
import { addLike, removeLike } from '../services/tracks/tracksApi';
import {
  addLikedTracks,
  removeLikedTracks,
} from '../store/features/trackSlice';

type ReturnTypeHook = {
  isLoading: boolean;
  errorMsg: string | null;
  toggleLike: () => void;
  isLike: boolean;
};

const getErrorMessage = (error: unknown): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response === 'object' &&
    (error as any).response?.data?.message
  ) {
    return (error as any).response.data.message;
  }
  return 'Произошла ошибка. Попробуйте позже';
};

export const useLikeTrack = (track: TrackType | null): ReturnTypeHook => {
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { access, refresh } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const isLike = favoriteTracks.some((t) => t._id === track?._id);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleLike = async () => {
    if (!access) {
      setErrorMsg('Нет авторизации');
      return;
    }

    if (!track) return;

    setIsLoading(true);
    setErrorMsg(null);

    const wasLiked = isLike;

    try {
      if (wasLiked) {
        dispatch(removeLikedTracks(String(track._id)));

        await withReauth(
          (newToken) => removeLike(track._id, newToken || access),
          refresh,
          dispatch,
        );
      } else {
        dispatch(addLikedTracks(track));

        await withReauth(
          (newToken) => addLike(track._id, newToken || access),
          refresh,
          dispatch,
        );
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setErrorMsg(message);

      if (wasLiked) {
        dispatch(addLikedTracks(track));
      } else {
        dispatch(removeLikedTracks(String(track._id)));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    errorMsg,
    toggleLike,
    isLike,
  };
};
