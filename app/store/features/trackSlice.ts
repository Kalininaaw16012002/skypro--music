import { TrackType } from '@/app/sharedTypes/sharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
  currentTrack: null | TrackType;
  isPlay: boolean;
  playlist: TrackType[];
  shuffledPlaylist: TrackType[];
  isShuffle: boolean;
};

const initialState: initialStateType = {
  currentTrack: null,
  isPlay: false,
  playlist: [],
  shuffledPlaylist: [],
  isShuffle: false,
};

const shuffleArray = (array: TrackType[]): TrackType[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
      state.currentTrack = action.payload;
    },
    setCurrentPlaylist: (state, action: PayloadAction<TrackType[]>) => {
      state.playlist = action.payload;
      state.shuffledPlaylist = shuffleArray(action.payload);
    },
    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },
    toogleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
      if (
        state.isShuffle &&
        state.shuffledPlaylist.length === 0 &&
        state.playlist.length > 0
      ) {
        state.shuffledPlaylist = shuffleArray(state.playlist);
      }
    },
    setNextTrack: (state) => {
      const playlist = state.isShuffle
        ? state.shuffledPlaylist
        : state.playlist;
      if (playlist.length === 0) return;
      const curIndex = playlist.findIndex(
        (el) => el._id === state.currentTrack?._id,
      );
      if (curIndex === -1) {
        state.currentTrack = playlist[0];
        state.isPlay = true;
        return;
      }
      const nextIndexTrack = curIndex + 1;
      if (nextIndexTrack < playlist.length) {
        state.currentTrack = playlist[nextIndexTrack];
      } else {
        state.currentTrack = playlist[0];
      }
      state.isPlay = true;
    },
    setPrevTrack: (state) => {
      const playlist = state.isShuffle
        ? state.shuffledPlaylist
        : state.playlist;
      if (playlist.length === 0 || !state.currentTrack) return;
      const curIndex = playlist.findIndex(
        (el) => el._id === state.currentTrack?._id,
      );
      if (curIndex === -1) {
        state.currentTrack = playlist[0];
        state.isPlay = true;
        return;
      }
      const prevIndexTrack = curIndex - 1;
      if (prevIndexTrack < 0) {
        state.currentTrack = playlist[playlist.length - 1];
      } else {
        state.currentTrack = playlist[prevIndexTrack];
      }

      state.isPlay = true;
    },
  },
});

export const {
  setCurrentTrack,
  setIsPlay,
  setCurrentPlaylist,
  setNextTrack,
  setPrevTrack,
  toogleShuffle,
} = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
