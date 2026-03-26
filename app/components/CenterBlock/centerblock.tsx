'use client';

import styles from './centerblock.module.css';
import classnames from 'classnames';
import Search from '../Search/search';
import Track from '../Track/track';
import Filter from '../Filter/filter';
import { useAppSelector } from '@/app/store/store';

export default function CenterBlock() {
  const pageTitle = useAppSelector((state) => state.tracks.pageTitle);

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>{pageTitle}</h2>
      <Filter />
      <div className={styles.centerblock__content}>
        <div className={styles.content__title}>
          <div className={classnames(styles.playlistTitle__col, styles.col01)}>
            Трек
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col02)}>
            Исполнитель
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col03)}>
            Альбом
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col04)}>
            <svg className={styles.playlistTitle__svg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
            </svg>
          </div>
        </div>
        <Track />
      </div>
    </div>
  );
}
