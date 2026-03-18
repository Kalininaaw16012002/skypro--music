'use client';

import { formatYears, getUniqueValuesByKey } from '@/app/utils/helper';
import styles from './filter.module.css';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import FilterItem from '../FilterItem/filteritem';
import { useAppSelector } from '@/app/store/store';

type FilterType = 'author' | 'year' | 'genre' | null;

export default function Filter() {
  const [filterActiv, setFilterActiv] = useState<FilterType>(null);
  const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>(
    {},
  );
  const playlist = useAppSelector((state) => state.tracks.playlist);

  const authors = useMemo(
    () => getUniqueValuesByKey(playlist, 'author').sort(),
    [playlist],
  );
  const years = useMemo(() => formatYears(playlist), [playlist]);
  const genres = useMemo(
    () => getUniqueValuesByKey(playlist, 'genre').sort(),
    [playlist],
  );

  const handleFilterClick = (filterName: FilterType) => {
    setFilterActiv((prev) => {
      const newFilter = prev === filterName ? null : filterName;
      if (newFilter !== prev) setSelectedValues({});
      return newFilter;
    });
  };

  const handleItemClick = (value: string) => {
    setSelectedValues((prev) => {
      const newValues = { ...prev };
      if (newValues[value]) {
        delete newValues[value];
      } else {
        Object.keys(newValues).forEach((key) => delete newValues[key]);
        newValues[value] = true;
      }
      return newValues;
    });
  };

  const renderFilterList = (items: string[], type: FilterType) => {
    if (filterActiv !== type) return null;
    return (
      <div className={styles.filter__dropdown}>
        <div className={styles.filter__list}>
          {items.map((item) => (
            <FilterItem
              key={item}
              text={item}
              isActive={selectedValues[item]}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filter__title}>Искать по:</div>

      <div className={styles.filterButtonWrapper}>
        <div
          className={classNames(styles.filter__button, {
            [styles.active]: filterActiv === 'author',
          })}
          onClick={() => handleFilterClick('author')}
        >
          исполнителю
        </div>
        {renderFilterList(authors, 'author')}
      </div>

      <div className={styles.filterButtonWrapper}>
        <div
          className={classNames(styles.filter__button, {
            [styles.active]: filterActiv === 'year',
          })}
          onClick={() => handleFilterClick('year')}
        >
          году выпуска
        </div>
        {renderFilterList(years, 'year')}
      </div>

      <div className={styles.filterButtonWrapper}>
        <div
          className={classNames(styles.filter__button, {
            [styles.active]: filterActiv === 'genre',
          })}
          onClick={() => handleFilterClick('genre')}
        >
          жанру
        </div>
        {renderFilterList(genres, 'genre')}
      </div>
    </div>
  );
}
