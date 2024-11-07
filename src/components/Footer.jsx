import React from "react";
import styles from "./Footer.module.scss";

import holidayKey from "./../img/holidayKey.svg";
import eventKey from "./../img/eventKey.svg";
import laborKey from "./../img/laborKey.svg";
import salesKey from "./../img/salesKey.svg";
import alertKey from "./../img/alertKey.svg";
import copyright from "./../img/copyright.svg";

const { footerWrapper, keyGroup, keyText, copyrightContainer, copyrightText } = styles;

function Footer () {
  return (
    <>
      <div className={footerWrapper}>
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
          <p className={keyText}>tourism probability<br />morning vs evening</p>
        </div>
        <div className={keyGroup}>
          <img src={copyright} className={copyrightContainer} alt="copyright icon" />
          <p className={copyrightText}>2024 Jennifer Holcomb</p>
        </div>
      </div>
    </>
  );
}

export default Footer;