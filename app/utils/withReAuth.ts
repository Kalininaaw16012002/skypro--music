import { refreshToken } from '../services/auth/authApi';
import { setAccess } from '../store/features/authSlice';
import { AppDispatch } from '../store/store';

export const withReauth = async <T>(
  apiFunction: (access: string) => Promise<T>,
  refresh: string,
  dispatch: AppDispatch,
): Promise<T> => {
  try {
    return await apiFunction('');
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 401) {
      try {
        const newAccessToken = await refreshToken({ refresh });

        dispatch(setAccess(newAccessToken.access));

        localStorage.setItem('access_token', newAccessToken.access);

        return await apiFunction(newAccessToken.access);
      } catch (refreshError: any) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        throw refreshError;
      }
    }
    throw error;
  }
};
