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

export const getTracks = async (): Promise<TrackType[]> => {
  const response = await axios.get<TracksResponse>(
    BASE_URL + '/catalog/track/all/',
    { headers: { 'content-type': 'application/json' } },
  );
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const getTracksByCategory = async (
  categoryId: string | number,
): Promise<TrackType[]> => {
  try {
    const playlistResponse = await axios.get<PlaylistResponse>(
      `${BASE_URL}/catalog/selection/${categoryId}/`,
      { headers: { 'content-type': 'application/json' } },
    );

    const trackIds = playlistResponse.data?.data?.items;

    if (!trackIds || trackIds.length === 0) {
      return [];
    }

    const allTracksResponse = await axios.get<TracksResponse>(
      BASE_URL + '/catalog/track/all/',
      { headers: { 'content-type': 'application/json' } },
    );

    const allTracks = Array.isArray(allTracksResponse.data?.data)
      ? allTracksResponse.data.data
      : [];

    const trackIdsSet = new Set(trackIds.map((id) => String(id)));
    return allTracks.filter((track) => trackIdsSet.has(String(track._id)));
  } catch (error) {
    console.error(`Ошибка при загрузке категории ${categoryId}:`, error);
    return [];
  }
};
