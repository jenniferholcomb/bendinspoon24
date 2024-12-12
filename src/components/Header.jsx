import React from "react";
import logoArt from "/img/BendSpoon.svg";
import styles from "./Header.module.css";

const { headerWrapper, weekLabelContainer, weekLabel, logoContainer, logo, subheadContainer, locationContainer, town, pindrop, info } = styles;

function Header ({ isMobile }) {
  return (
    <>
      <div className={headerWrapper}>
        <h2 className={subheadContainer}>Forecasting</h2>
        <div className={locationContainer}>
          <h3 className={town}>Bend, Oregon</h3>
          <svg className={pindrop} xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d="M8 11C8.30122 11 8.73668 10.9709 9.15692 10.8873C9.54762 10.8096 10.0435 10.6636 10.3536 10.3536C10.6636 10.0435 10.8096 9.54762 10.8873 9.15692C10.9709 8.73668 11 8.30122 11 8C11 7.69878 10.9709 7.26332 10.8873 6.84308C10.8096 6.45238 10.6636 5.95646 10.3536 5.64645C10.0435 5.33644 9.54762 5.19045 9.15692 5.11273C8.73668 5.02914 8.30122 5 8 5C7.69878 5 7.26332 5.02914 6.84308 5.11273C6.45238 5.19045 5.95646 5.33644 5.64645 5.64645C5.33644 5.95646 5.19045 6.45238 5.11273 6.84308C5.02914 7.26332 5 7.69878 5 8C5 8.30122 5.02914 8.73668 5.11273 9.15692C5.19045 9.54762 5.33644 10.0435 5.64645 10.3536C5.95646 10.6636 6.45238 10.8096 6.84308 10.8873C7.26332 10.9709 7.69878 11 8 11ZM8 19.3414C5.49988 17.1815 3.63927 15.1865 2.40162 13.3573C1.11009 11.4485 0.5 9.73304 0.5 8.2C0.5 5.8177 1.26086 3.96732 2.75148 2.59255C4.2709 1.19122 6.01355 0.5 8 0.5C9.98645 0.5 11.7291 1.19122 13.2485 2.59255C14.7391 3.96732 15.5 5.8177 15.5 8.2C15.5 9.73304 14.8899 11.4485 13.5984 13.3573C12.3607 15.1865 10.5001 17.1815 8 19.3414Z" fill="#feffdab2" stroke="#feffdab2"/>
          </svg>
        </div>
      </div>
      <div className={logoContainer}>
        <img className={logo} src={logoArt} alt="Logo" />
      </div>
    </>
  );
}

export default Header;