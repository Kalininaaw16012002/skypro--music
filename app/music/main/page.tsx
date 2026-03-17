import MainNav from '@/app/components/MainNav/mainnav';
import styles from './page.module.css';
import CenterBlock from '@/app/components/CenterBlock/centerblock';
import MainSidebar from '@/app/components/MainSidebar/mainsidebar';
import Bar from '@/app/components/Bar/bar';

export default function Home() {
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
