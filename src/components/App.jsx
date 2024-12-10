import React, { useState } from 'react';
// import GoodsControl from './GoodsControl';
import Header from './Header';
import AgentsControl from './AgentsControl';
import Footer from './Footer';
import styles from "./App.module.css";
import useResize from './useResize';

function App() {
  const [tab, setTab] = useState('week');
  const [orientation, isMobile] = useResize();

  const handleTabClick = (clickedTab) => {
    setTab(clickedTab);
  };

  return (
    <div className={styles.bodyWrapper}>
      <Header />
      <AgentsControl selectedTab={tab} 
                     isMobile={isMobile} />
      <Footer selectedTab={tab}
              onChangingTab={handleTabClick} 
              isMobile={isMobile} />
    </div>
  );
}

export default App;

