import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'; 
import { TrackType } from '@/app/sharedTypes/sharedTypes';
import { data } from '@/data';
import Track from './track';
import { setCurrentPlaylist, setLoading, setError, trackSliceReducer } from '@/app/store/features/trackSlice';
import { authSliceReducer } from '@/app/store/features/authSlice';

const mockTracks: TrackType[] = data;
const mockTrack = mockTracks[0]; 

describe('Track component', () => {
  
  test('Отрисовка данных трека', () => {
    const store = configureStore({
      reducer: {
        tracks: trackSliceReducer,
        auth: authSliceReducer,
      },
    });

    store.dispatch(setCurrentPlaylist(mockTracks));

    render(
      <Provider store={store}>
        <Track />
      </Provider>
    );

    const authorElements = screen.getAllByText(mockTrack.author);
    expect(authorElements.length).toBeGreaterThan(0);
  });

  test('Отрисовка индикатора загрузки', () => {
    const store = configureStore({
      reducer: {
        tracks: trackSliceReducer,
        auth: authSliceReducer,
      },
    });

    store.dispatch(setLoading(true));

    render(
      <Provider store={store}>
        <Track />
      </Provider>
    );

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  test('Отрисовка сообщения об ошибке', () => {
    const store = configureStore({
      reducer: {
        tracks: trackSliceReducer,
        auth: authSliceReducer,
      },
    });

    store.dispatch(setError('Ошибка сети'));

    render(
      <Provider store={store}>
        <Track />
      </Provider>
    );

    expect(screen.getByText('Ошибка сети')).toBeInTheDocument();
  });
});