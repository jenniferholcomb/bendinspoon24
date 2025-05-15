import React, { useEffect, useRef } from "react";
import styles from "./Info.module.css";

import holidayKey from "/img/holidayKey.svg";
import eventKey from "/img/eventKey.svg";
import lowKey from "/img/lowKey.svg";
import midKey from "/img/midKey.svg";
import highKey from "/img/highKey.svg";
import laborKey from "/img/laborKey.svg";
import salesKey from "/img/salesKey.svg";
import alertKey from "/img/alertKey.svg";
import arrowDwnKey from "/img/arrowDwnKey.svg";
import arrowUpKey from "/img/arrowUpKey.svg";

const { infoContainer, infoBox, infoHeader, infoSubhead, pageTitle, closeInfo, blurbWeek, blurb, infoKey, infoWeek1, keyGroup, keyContainer, keyText, infoWeek2, tourismSubheadWeek, infoTourism1, tourismSubhead, infoTourism2, costGoodsContain } = styles;

function Info ({ isOpen, selectedInfo, onClosingInfoPage }) {
  const closeButtonRef = useRef(null);
  const modalRef = useRef(null);

  const infoHead = [ 'week-at-a-glance info', 'tourism calendar info', 'cost of goods info'];
  const infoParagraph = [ "Factors for predicting seven days of profit margins. Tourism probability, weather, holidays, and local events specific to Bend, OR. Labor estimates and past sales figures are static - they demonstrate how application could be linked to accounting software.",
                          "The tourism calendar is populated with the percent of short term rentals booked on a given day within Bend, OR. This information is obtained by calculating availability data of each rental listing. It also includes holidays & local events.",
                          "Displays any inventory items where distributor price has increased or decreased. Invoice management database and application are connected, calculations flucuate with invoice entry. All data presented is for demonstration purposes only, information is static. "
  ];

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement;

    const handleKeyDown = (e) => {
      console.log(e.key)
      if (e.key === 'Escape') {
        onClosingInfoPage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div 
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Information"
        className={infoContainer}
      >
        <div className={infoBox}>
          <div className={infoHeader}>
            <div className={infoSubhead}>
              { selectedInfo === 'week' ?
                <>
                  <h2>Info</h2>
                  <h3>week-at-a-glance</h3>
                </>
              : selectedInfo === 'tourism' ?
                <>
                  <h2>info</h2>
                  <h3>tourism calendar</h3>
                </>
                :
                <>
                  <h2>info</h2>
                  <h3>cost of goods</h3>
                </>
              }
            </div>
            <button
              ref={closeButtonRef}
              tabIndex={0}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onClosingInfoPage(false)}
              aria-label="close modal"
            >
              <svg className={closeInfo} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="#666B69"/>
              </svg>
            </button>
          </div>
          <p className={selectedInfo === "week" ? blurbWeek : blurb}>{selectedInfo === 'week' ? infoParagraph[0] : selectedInfo === 'tourism' ? infoParagraph[1] : infoParagraph[2]}</p>
          <div className={infoKey}>
            { selectedInfo === "week" ?
              <>
                <dl className={infoWeek1} >
                  <div className={`${keyGroup} ${keyContainer}`}>
                    <dt><img src={laborKey} alt="" aria-hidden="true" /></dt>
                    <dd className={keyText}>total labor estimate</dd>
                  </div>
                  <div className={`${keyGroup} ${keyContainer}`}>
                    <dt><img src={salesKey} alt="" aria-hidden="true" /></dt>
                    <dd className={keyText}>total sales on equivalent day of previous year</dd>
                  </div>
                  <div className={infoWeek2}>
                    <div className={keyGroup}>
                      <dt><img src={holidayKey} alt="" aria-hidden="true" /></dt>
                      <dd className={keyText}>holiday</dd>
                    </div>
                    <div className={keyGroup}>
                      <dt><img src={eventKey} alt="" aria-hidden="true" /></dt>
                      <dd className={keyText}>local events</dd>
                    </div>
                  </div>
                  <h4 className={tourismSubheadWeek}>Tourism probability</h4>
                  <div className={infoWeek2}>
                    <div className={keyGroup}>
                      <dt><img src={lowKey} alt="" aria-hidden="true" /></dt>
                      <dd className={keyText}>low</dd>
                    </div>
                    <div className={keyGroup}>
                      <dt><img src={midKey} alt="" aria-hidden="true" /></dt>
                      <dd className={keyText}>mid</dd>
                    </div>
                  </div>
                  <div className={infoWeek2}>
                    <div className={keyGroup}>
                      <dt><img src={highKey} alt="" aria-hidden="true" /></dt>
                      <dd className={keyText}>low</dd>
                    </div>
                    <div className={keyGroup}>
                      <dt><img src={alertKey} alt="" aria-hidden="true" /></dt>
                      <dd className={keyText}>AM vs PM</dd>
                    </div>
                  </div>
                </dl>
              </>
            :
              selectedInfo === "tourism" ?
              <>
                <dl>
                  <div className={infoTourism1}>
                    <div className={keyGroup}>
                      <dt><img src={holidayKey} alt="" aria-hidden="true" /></dt>
                      <dd className={keyText}>holiday</dd>
                    </div>
                    <div className={keyGroup}>
                      <dt><img src={eventKey} alt="" aria-hidden="true" /></dt>
                      <dd className={keyText}>local events</dd>
                    </div>
                  </div>
                  <h4 className={tourismSubhead}>Tourism probability</h4>
                  <div className={infoTourism2}>
                    <div className={keyGroup}>
                      <dt><img src={lowKey} alt="" aria-hidden="true" /></dt>
                      <dd className={keyText}>low</dd>
                    </div>
                    <div className={keyGroup}>
                      <dt><img src={midKey} alt="" aria-hidden="true" /></dt>
                      <dd className={keyText}>mid</dd>
                    </div>
                    <div className={keyGroup}>
                      <dt><img src={highKey} alt="" aria-hidden="true" /></dt>
                      <dd className={keyText}>high</dd>
                    </div>
                  </div>
                </dl>
              </> 
              :
              <div className={`${infoTourism1} ${costGoodsContain}`} >
                <dl>
                  <div className={keyGroup}>
                    <dt><img src={arrowUpKey} alt="" aria-hidden="true" /></dt>
                    <dd className={keyText}>item cost increased</dd>
                  </div>
                  <div className={keyGroup}>
                    <dt><img src={arrowDwnKey} alt="" aria-hidden="true" /></dt>
                    <dd className={keyText}>item cost decreased</dd>
                  </div>
                </dl>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Info;