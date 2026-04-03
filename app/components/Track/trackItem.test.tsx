import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { data } from '@/data';
import TrackItem from './TrackItem';
import { trackSliceReducer } from '@/app/store/features/trackSlice';
import { authSliceReducer } from '@/app/store/features/authSlice';

jest.mock('@/app/hooks/useLikeTracks', () => ({
  useLikeTrack: () => ({
    isLoading: false,
    toggleLike: jest.fn(),
    isLike: false,
  }),
}));

const mockTrack = data[0];

const renderWithStore = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      tracks: trackSliceReducer,
      auth: authSliceReducer,
    },
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('TrackItem component', () => {
  test('Отрисовка названия трека', () => {
    renderWithStore(
      <TrackItem track={mockTrack} currentTrack={null} isPlay={false} />
    );
    const elements = screen.getAllByText(mockTrack.name);
    expect(elements.length).toBeGreaterThan(0);
  });

  test('Отрисовка автора трека', () => {
    renderWithStore(
      <TrackItem track={mockTrack} currentTrack={null} isPlay={false} />
    );
    expect(screen.getByText(mockTrack.author)).toBeInTheDocument();
  });
});