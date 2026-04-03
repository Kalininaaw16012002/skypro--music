import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MainNav from './mainnav';
import { trackSliceReducer } from '@/app/store/features/trackSlice';
import { authSliceReducer } from '@/app/store/features/authSlice';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const renderWithStore = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      tracks: trackSliceReducer,
      auth: authSliceReducer,
    },
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('MainNav component', () => {
  test('Отрисовка ссылки "Главное" после открытия меню', () => {
    renderWithStore(<MainNav />);

    const burgerButton = document.querySelector('.nav__burger');

    if (burgerButton) {
      fireEvent.click(burgerButton);
    }

    expect(screen.getByText('Главное')).toBeInTheDocument();
  });

  test('Отрисовка ссылки "Мой плейлист" после открытия меню', () => {
    renderWithStore(<MainNav />);

    const burgerButton = document.querySelector('.nav__burger');
    if (burgerButton) {
      fireEvent.click(burgerButton);
    }

    expect(screen.getByText('Мой плейлист')).toBeInTheDocument();
  });
});
