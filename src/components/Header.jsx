import React from "react";
import logoArt from "/img/BendSpoon.svg";
import styles from "./Header.module.css";

const { headerWrapper, logoContainer, logo, portraitContainer, subheadContainerPortrait, subheadContainerLandscape, locationContainer, srOnly, town, about, pindrop, info } = styles;

function Header ({ isMobile }) {
  return (
    <>
      <header className={headerWrapper}>
        <div className={logoContainer}>
          <img className={logo} src={logoArt} alt="Bend In Spoon" />
        </div>
        <h1 className={subheadContainerLandscape}>Forecasting</h1>
        <div className={portraitContainer}>
          <div className={locationContainer}>
            <p className={town}><span className={srOnly}>Current City: </span>Bend, Oregon</p>
            <svg className={pindrop} xmlns="http://www.w3.org/2000/svg" width="17" height="21" viewBox="0 0 17 21" fill="none" cursor="default" aria-hidden="true">
              <path d="M8 10C8.55 10 9.02083 9.80417 9.4125 9.4125C9.80417 9.02083 10 8.55 10 8C10 7.45 9.80417 6.97917 9.4125 6.5875C9.02083 6.19583 8.55 6 8 6C7.45 6 6.97917 6.19583 6.5875 6.5875C6.19583 6.97917 6 7.45 6 8C6 8.55 6.19583 9.02083 6.5875 9.4125C6.97917 9.80417 7.45 10 8 10ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625C13.5083 10.7375 14 9.38333 14 8.2C14 6.38333 13.4208 4.89583 12.2625 3.7375C11.1042 2.57917 9.68333 2 8 2C6.31667 2 4.89583 2.57917 3.7375 3.7375C2.57917 4.89583 2 6.38333 2 8.2C2 9.38333 2.49167 10.7375 3.475 12.2625C4.45833 13.7875 5.96667 15.4833 8 17.35ZM8 20C5.31667 17.7167 3.3125 15.5958 1.9875 13.6375C0.6625 11.6792 0 9.86667 0 8.2C0 5.7 0.804167 3.70833 2.4125 2.225C4.02083 0.741667 5.88333 0 8 0C10.1167 0 11.9792 0.741667 13.5875 2.225C15.1958 3.70833 16 5.7 16 8.2C16 9.86667 15.3375 11.6792 14.0125 13.6375C12.6875 15.5958 10.6833 17.7167 8 20Z" fill="#FEFFDAB2" cursor="default" />
            </svg>
          </div>
          <h1 className={subheadContainerPortrait}>Forecasting</h1>
        </div>
      </header>

    </>
  );
}

export default Header;