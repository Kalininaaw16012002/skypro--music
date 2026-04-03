import axios from 'axios';
import { BASE_URL } from '../constants';
import { TrackType } from '@/app/sharedTypes/sharedTypes';

interface TracksResponse {
  success: boolean;
  data: TrackType[];
}

interface PlaylistResponse {
  success: boolean;
  data: {
    _id: number | string;
    name: string;
    items: (number | string)[];
  };
}

interface LikeResponse {
  success?: boolean;
  message?: string;
  [key: string]: any;
}

export const getTracks = async (): Promise<TrackType[]> => {
  const response = await axios.get<TracksResponse>(
    BASE_URL + '/catalog/track/all/',
    { headers: { 'content-type': 'application/json' } },
  );
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const getFavoriteTracks = async (
  accessToken: string,
): Promise<TrackType[]> => {
  const response = await axios.get<TracksResponse>(
    BASE_URL + '/catalog/track/favorite/all/',
    {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const getTrackIdsByCategory = async (
  categoryId: string | number,
): Promise<(string | number)[]> => {
  const response = await axios.get<PlaylistResponse>(
    `${BASE_URL}/catalog/selection/${categoryId}/`,
    { headers: { 'content-type': 'application/json' } },
  );
  return response.data?.data?.items || [];
};
export const addLike = async (
  id: string | number,
  accessToken: string,
): Promise<LikeResponse> => {
  const response = await axios.post<LikeResponse>(
    `${BASE_URL}/catalog/track/${id}/favorite/`,
    {},
    {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
};

export const removeLike = async (
  id: string | number,
  accessToken: string,
): Promise<LikeResponse> => {
  const response = await axios.delete<LikeResponse>(
    `${BASE_URL}/catalog/track/${id}/favorite/`,
    {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
};
