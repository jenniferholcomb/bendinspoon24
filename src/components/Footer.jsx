import React, { useState } from "react";
import styles from "./Footer.module.css";

import holidayKey from "/img/holidayKey.svg";
import eventKey from "/img/eventKey.svg";
import laborKey from "/img/laborKey.svg";
import salesKey from "/img/salesKey.svg";
import alertKey from "/img/alertKey.svg";
import copyright from "/img/copyright.svg";

const { footerWrapper, keyContainer, copyrightGroup, copyrightContainer, keyGroup, keyText, keyIcon, closeIcon } = styles;

function Footer () {
  const [keyExpand, setKeyExpand] = useState(true);

  const handleKeyClick = () => {
    setKeyExpand(!keyExpand);
  };

  return (
    <>
      <div className={footerWrapper}>
        <div className={keyContainer}>
          { !keyExpand ?
            <div className={copyrightGroup}>
              <img src={copyright} className={copyrightContainer} alt="copyright icon" />
              <p className={keyText}>2024 Jennifer Holcomb</p>
            </div>
          :
            <>
              <div className={keyGroup}>
                <img src={holidayKey} alt="holiday key" />
                <p className={keyText}>holiday</p>
              </div>
              <div className={keyGroup}>
                <img src={eventKey} alt="event key" />
                <p className={keyText}>popular local events</p>
              </div>
              <div className={keyGroup}>
                <img src={laborKey} alt="labor key" />
                <p className={keyText}>total labor estimate<br />for given day</p>
              </div>
              <div className={keyGroup}>
                <img src={salesKey} alt="sales key" />
                <p className={keyText}>total sales on equivalent<br />day of previous year</p>
              </div>
              <div className={keyGroup}>
                <img src={alertKey} alt="tourism alert key" />
                <p className={keyText}>tourism probability,<br />AM vs PM</p>
              </div>
            </>
          }
        </div>
        { !keyExpand ?
          <svg className={keyIcon} onClick={handleKeyClick} xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
            <path d="M0 14V12H16V14H0ZM0 10V8H16V10H0ZM0 6V3.65L6 0L11 3.55L16 0V2.45L11 6L5.925 2.4L0 6Z" fill="#FEFFDA"/>
          </svg>
        :
          <svg className={closeIcon} onClick={handleKeyClick} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="#666B69"/>
          </svg>
        }

      </div>
    </>
  );
}

export default Footer;