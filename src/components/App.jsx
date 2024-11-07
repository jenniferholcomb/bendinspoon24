import React from 'react';
// import GoodsControl from './GoodsControl';
import Header from './Header';
import AgentsControl from './AgentsControl';
import Footer from './Footer';
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.bodyWrapper}>
      <Header />
      <AgentsControl />
      <Footer />
    </div>
  );
}

export default App;

