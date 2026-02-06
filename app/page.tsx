import Bar from './components/Bar/bar';
import CenterBlock from './components/CenterBlock/centerblock';
import MainNav from './components/MainNav/mainnav';
import MainSidebar from './components/MainSidebar/mainsidebar';
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <MainNav/>
          <CenterBlock/>
          <MainSidebar/>
        </main>
        <Bar />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}