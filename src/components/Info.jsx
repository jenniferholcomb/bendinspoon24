import React from "react";
import styles from "./Info.module.css";

const { tabInfoWrapper, hiddenInfoWrapper, infoWrapper, infoHeader, infoLabelContainer, infoLabel } = styles;

function Info ({ selectedTab, isMobile }) {
  return (
    <>
      <div className={isMobile ? (selectedTab === 'info' ? tabInfoWrapper : hiddenInfoWrapper) : infoWrapper}>
        <div className={infoHeader}>
          <div className={infoLabelContainer}>
            <h3 className={infoLabel}>information</h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default Info;