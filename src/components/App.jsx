import React, { useState, useEffect } from 'react';
// import GoodsControl from './GoodsControl';
import Header from './Header';
import AgentsControl from './AgentsControl';
import Footer from './Footer';
import styles from "./App.module.css";
import useResize from './useResize';

function App() {
  const [tab, setTab] = useState('week');
  const [infoOpen, setInfoOpen] = useState(false);
  const [orientation, isMobile, isTablet, isShort] = useResize();

  const handleTabClick = (clickedTab) => {
    setTab(clickedTab);
  };

  const handleInfoPage = (bool) => {
    setInfoOpen(bool);
  };

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);

    return () => window.removeEventListener('resize', setVh);
  }, []);

  return (
    <div className={styles.bodyWrapper}>
      <Header isMobile={isMobile} />
      <AgentsControl selectedTab={tab} 
                     isMobile={isMobile}
                     handleInfoPage={handleInfoPage}
                     infoOpen={infoOpen} />
      <Footer selectedTab={tab}
              onChangingTab={handleTabClick} 
              isMobile={isMobile}
              infoOpen={infoOpen} />
    </div>
  );
}

export default App;

