'use client';

import MainNav from '@/app/components/MainNav/mainnav';
import CenterBlock from '@/app/components/CenterBlock/centerblock';
import MainSidebar from '@/app/components/MainSidebar/mainsidebar';
import Bar from '@/app/components/Bar/bar';
import styles from './tracklayot.module.css';

interface TrackLayoutProps {
  children?: React.ReactNode;
}

export default function TrackLayout({ children }: TrackLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <MainNav />
          <CenterBlock />
          <MainSidebar />
        </main>
        <Bar />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
