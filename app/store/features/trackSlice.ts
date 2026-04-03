import { TrackType } from '@/app/sharedTypes/sharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
  currentTrack: null | TrackType;
  isPlay: boolean;
  playlist: TrackType[];
  originalPlaylist: TrackType[];
  filteredPlaylist: TrackType[];
  shuffledPlaylist: TrackType[];
  isShuffle: boolean;
  loading: boolean;
  error: string | null;
  pageTitle: string;
  allTracks: TrackType[];
  favoriteTracks: TrackType[];
  activeFilters: {
    author: string[];
    genre: string[];
    yearSort: 'default' | 'newest' | 'oldest';
  };
  searchQuery: string;
};

const initialState: initialStateType = {
  currentTrack: null,
  isPlay: false,
  playlist: [],
  originalPlaylist: [],
  filteredPlaylist: [],
  shuffledPlaylist: [],
  isShuffle: false,
  loading: false,
  error: null,
  pageTitle: 'Треки',
  allTracks: [],
  favoriteTracks: [],
  activeFilters: {
    author: [],
    genre: [],
    yearSort: 'default',
  },
  searchQuery: '',
};

const shuffleArray = (array: TrackType[]): TrackType[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const applyAllFiltersAndSearch = (state: initialStateType) => {
  let filtered = [...state.originalPlaylist];

  if (state.activeFilters.author.length > 0) {
    filtered = filtered.filter((track) =>
      state.activeFilters.author.includes(track.author),
    );
  }

  if (state.activeFilters.genre.length > 0) {
    filtered = filtered.filter((track) =>
      track.genre.some((g) => state.activeFilters.genre.includes(g)),
    );
  }

  if (
    state.activeFilters.yearSort &&
    state.activeFilters.yearSort !== 'default'
  ) {
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.release_date || 0).getTime();
      const dateB = new Date(b.release_date || 0).getTime();

      if (state.activeFilters.yearSort === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  }

  if (state.searchQuery.trim() !== '') {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter((track) =>
      track.name.toLowerCase().includes(query),
    );
  }

  state.filteredPlaylist = filtered;
  state.playlist = filtered;
  state.shuffledPlaylist = shuffleArray(filtered);
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
      state.currentTrack = action.payload;
    },
    setAllTracks: (state, action: PayloadAction<TrackType[]>) => {
      state.allTracks = action.payload;
    },
    setFavoriteTracks: (state, action: PayloadAction<TrackType[]>) => {
      state.favoriteTracks = action.payload;
    },
    addLikedTracks: (state, action: PayloadAction<TrackType>) => {
      const newTrack = action.payload;
      const exists = state.favoriteTracks.some(
        (track) => track._id === newTrack._id,
      );
      if (!exists) {
        state.favoriteTracks.push(newTrack);
      }
    },
    removeLikedTracks: (state, action: PayloadAction<string | number>) => {
      const trackId = String(action.payload);

      state.favoriteTracks = state.favoriteTracks.filter(
        (track) => String(track._id) !== trackId,
      );
      state.originalPlaylist = state.originalPlaylist.filter(
        (track) => String(track._id) !== trackId,
      );

      state.playlist = state.playlist.filter(
        (track) => String(track._id) !== trackId,
      );
      state.filteredPlaylist = state.filteredPlaylist.filter(
        (track) => String(track._id) !== trackId,
      );
      state.shuffledPlaylist = state.shuffledPlaylist.filter(
        (track) => String(track._id) !== trackId,
      );
    },
    setCurrentPlaylist: (state, action: PayloadAction<TrackType[]>) => {
      if (state.originalPlaylist.length === 0) {
        state.originalPlaylist = [...action.payload];
      } else {
        state.originalPlaylist = [...action.payload];
      }

      state.activeFilters = {
        author: [],
        genre: [],
        yearSort: 'default',
      };
      state.searchQuery = '';

      applyAllFiltersAndSearch(state);

      state.loading = false;
      state.error = null;
    },
    resetToOriginalPlaylist: (state) => {
      if (state.originalPlaylist.length > 0) {
        state.activeFilters = {
          author: [],
          genre: [],
          yearSort: 'default',
        };
        state.searchQuery = '';
        applyAllFiltersAndSearch(state);
      }
    },
    applyFilters: (
      state,
      action: PayloadAction<{
        author?: string | null;
        genre?: string | null;
        yearSort?: 'default' | 'newest' | 'oldest';
      }>,
    ) => {
      const { author, genre, yearSort } = action.payload;

      if (author !== undefined) {
        if (author === null) {
          state.activeFilters.author = [];
        } else {
          const index = state.activeFilters.author.indexOf(author);
          if (index > -1) {
            state.activeFilters.author.splice(index, 1);
          } else {
            state.activeFilters.author.push(author);
          }
        }
      }

      if (genre !== undefined) {
        if (genre === null) {
          state.activeFilters.genre = [];
        } else {
          const index = state.activeFilters.genre.indexOf(genre);
          if (index > -1) {
            state.activeFilters.genre.splice(index, 1);
          } else {
            state.activeFilters.genre.push(genre);
          }
        }
      }

      if (yearSort !== undefined) {
        state.activeFilters.yearSort = yearSort;
      }

      applyAllFiltersAndSearch(state);
    },
    clearAllFilters: (state) => {
      state.activeFilters = {
        author: [],
        genre: [],
        yearSort: 'default',
      };
      state.searchQuery = '';
      applyAllFiltersAndSearch(state);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      applyAllFiltersAndSearch(state);
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
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
  setPageTitle,
  setLoading,
  setError,
  setNextTrack,
  setPrevTrack,
  toogleShuffle,
  setAllTracks,
  setFavoriteTracks,
  addLikedTracks,
  removeLikedTracks,
  resetToOriginalPlaylist,
  applyFilters,
  clearAllFilters,
  setSearchQuery,
} = trackSlice.actions;

export const trackSliceReducer = trackSlice.reducer;
