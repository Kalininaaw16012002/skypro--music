'use client';

import { getUniqueValuesByKey } from '@/app/utils/helper';
import styles from './filter.module.css';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import FilterItem from '../FilterItem/filteritem';
import { useAppSelector, useAppDispatch } from '@/app/store/store';
import { applyFilters } from '@/app/store/features/trackSlice';

type FilterType = 'author' | 'year' | 'genre' | null;
type SortType = 'default' | 'newest' | 'oldest';

export default function Filter() {
  const dispatch = useAppDispatch();
  const [filterActiv, setFilterActiv] = useState<FilterType>(null);

  const activeFilters = useAppSelector((state) => state.tracks.activeFilters);
  const originalPlaylist = useAppSelector(
    (state) => state.tracks.originalPlaylist,
  );

  const authors = useMemo(
    () => getUniqueValuesByKey(originalPlaylist, 'author').sort(),
    [originalPlaylist],
  );

  const genres = useMemo(
    () => getUniqueValuesByKey(originalPlaylist, 'genre').sort(),
    [originalPlaylist],
  );

  const yearOptions = [
    { id: 'default', label: 'По умолчанию' },
    { id: 'newest', label: 'Сначала новые' },
    { id: 'oldest', label: 'Сначала старые' },
  ];

  const handleButtonClick = (filterName: FilterType) => {
    if (
      (filterName === 'author' && activeFilters.author.length > 0) ||
      (filterName === 'genre' && activeFilters.genre.length > 0) ||
      (filterName === 'year' && activeFilters.yearSort !== 'default')
    ) {
      if (filterName === 'author') {
        dispatch(applyFilters({ author: null }));
      } else if (filterName === 'genre') {
        dispatch(applyFilters({ genre: null }));
      } else if (filterName === 'year') {
        dispatch(applyFilters({ yearSort: 'default' }));
      }
    } else {
      setFilterActiv((prev) => (prev === filterName ? null : filterName));
    }
  };

  const handleAuthorClick = (author: string) => {
    dispatch(applyFilters({ author }));
  };

  const handleGenreClick = (genre: string) => {
    dispatch(applyFilters({ genre }));
  };

  const handleYearSortClick = (type: SortType) => {
    dispatch(applyFilters({ yearSort: type }));
    setFilterActiv(null);
  };

  const renderFilterList = (items: string[], type: FilterType) => {
    if (filterActiv !== type) return null;

    if (type === 'year') {
      return (
        <div className={styles.filter__dropdown}>
          <div className={styles.filter__list}>
            {yearOptions.map((option) => (
              <FilterItem
                key={option.id}
                text={option.label}
                isActive={activeFilters.yearSort === option.id}
                onClick={() => handleYearSortClick(option.id as SortType)}
              />
            ))}
          </div>
        </div>
      );
    }

    if (type === 'author') {
      return (
        <div className={styles.filter__dropdown}>
          <div className={styles.filter__list}>
            {items.map((item) => (
              <FilterItem
                key={item}
                text={item}
                isActive={activeFilters.author.includes(item)}
                onClick={() => handleAuthorClick(item)}
              />
            ))}
          </div>
        </div>
      );
    }

    if (type === 'genre') {
      return (
        <div className={styles.filter__dropdown}>
          <div className={styles.filter__list}>
            {items.map((item) => (
              <FilterItem
                key={item}
                text={item}
                isActive={activeFilters.genre.includes(item)}
                onClick={() => handleGenreClick(item)}
              />
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filter__title}>Искать по:</div>

      <div className={styles.filterButtonWrapper}>
        <div
          className={classNames(styles.filter__button, {
            [styles.active]: activeFilters.author.length > 0,
          })}
          onClick={() => handleButtonClick('author')}
        >
          исполнителю
          {activeFilters.author.length > 0 && (
            <span className={styles.filter__count}>
              ({activeFilters.author.length})
            </span>
          )}
        </div>
        {renderFilterList(authors, 'author')}
      </div>

      <div className={styles.filterButtonWrapper}>
        <div
          className={classNames(styles.filter__button, {
            [styles.active]: activeFilters.yearSort !== 'default',
          })}
          onClick={() => handleButtonClick('year')}
        >
          году выпуска
        </div>
        {renderFilterList([], 'year')}
      </div>

      <div className={styles.filterButtonWrapper}>
        <div
          className={classNames(styles.filter__button, {
            [styles.active]: activeFilters.genre.length > 0,
          })}
          onClick={() => handleButtonClick('genre')}
        >
          жанру
          {activeFilters.genre.length > 0 && (
            <span className={styles.filter__count}>
              ({activeFilters.genre.length})
            </span>
          )}
        </div>
        {renderFilterList(genres, 'genre')}
      </div>
    </div>
  );
}
