import { TrackType } from "../sharedTypes/sharedTypes";

export function getUniqueValuesByKey(
    arr: TrackType[] = [],
    key: keyof TrackType,
): string[] {
    if (!Array.isArray(arr)) {
        return [];
    }

    const uniqueValues = new Set<string>();
    arr.forEach((item) => {
        const value = item[key];
        if (Array.isArray(value)) {
            value.forEach((v) => {
                if (v) {
                    uniqueValues.add(v);
                }
            });
        } else if (typeof value === 'string' && value) {
            uniqueValues.add(value);
        }
    });
    return Array.from(uniqueValues);
}

export function formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    const inputSeconds = Math.floor(time % 60);
    const outputSeconds = inputSeconds < 10 ? `0${inputSeconds}` : inputSeconds;

    return `${minutes}:${outputSeconds}`;
}

export function formatYears(tracks: TrackType[]): string[] {
  const years = tracks.map(track => {
    if (track.release_date) {
      const year = track.release_date.split('-')[0];
      return `${year} год`;
    }
    return '';
  }).filter(year => year !== '');
  
  return [...new Set(years)].sort((a, b) => {
    const yearA = parseInt(a.split(' ')[0]);
    const yearB = parseInt(b.split(' ')[0]);
    return yearB - yearA;
  });
}