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
            <svg className={pindrop} xmlns="http://www.w3.org/2000/svg" width="12" height="15" viewBox="0 0 12 15" fill="none" cursor="default" aria-hidden="true">
              <path d="M5 7.325C5.19917 7.325 5.48514 7.30516 5.7634 7.2476C6.01295 7.19598 6.37444 7.09197 6.61042 6.84655C6.73623 6.71571 6.81591 6.55651 6.8687 6.41942C6.92344 6.27726 6.9618 6.12547 6.98915 5.98252C7.04367 5.69742 7.0625 5.40393 7.0625 5.2C7.0625 4.99606 7.04367 4.70258 6.98915 4.41748C6.9618 4.27453 6.92344 4.12274 6.8687 3.98058C6.81591 3.84349 6.73623 3.68429 6.61042 3.55345C6.37444 3.30803 6.01295 3.20402 5.7634 3.1524C5.48514 3.09484 5.19917 3.075 5 3.075C4.80083 3.075 4.51486 3.09484 4.2366 3.1524C3.98705 3.20402 3.62556 3.30803 3.38958 3.55345C3.26377 3.68429 3.18409 3.84349 3.1313 3.98058C3.07656 4.12274 3.0382 4.27453 3.01085 4.41748C2.95633 4.70258 2.9375 4.99606 2.9375 5.2C2.9375 5.40393 2.95633 5.69742 3.01085 5.98252C3.0382 6.12547 3.07656 6.27726 3.1313 6.41942C3.18409 6.55651 3.26377 6.71571 3.38958 6.84655C3.62556 7.09197 3.98705 7.19598 4.2366 7.2476C4.51486 7.30516 4.80083 7.325 5 7.325ZM5 12.3286C3.51036 10.9766 2.40232 9.73074 1.6613 8.59171C0.865596 7.36863 0.5 6.28495 0.5 5.33C0.5 3.81655 0.963514 2.66115 1.85392 1.80709C2.77147 0.927008 3.81343 0.5 5 0.5C6.18657 0.5 7.22853 0.927008 8.14608 1.80709C9.03649 2.66115 9.5 3.81655 9.5 5.33C9.5 6.28495 9.1344 7.36863 8.3387 8.59171C7.59768 9.73074 6.48963 10.9766 5 12.3286Z" fill="#E5E6C5" stroke="white" cursor="default" />
            </svg>
          </div>
          <h1 className={subheadContainerPortrait}>Forecasting</h1>
        </div>
      </header>

    </>
  );
}

export default Header;