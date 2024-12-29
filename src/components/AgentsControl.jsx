import React, { useState, useEffect } from "react";
import Tourism from './Tourism';
import Week from './Week';
import CostGoodsControl from './CostGoodsControl';
import styles from "./AgentsControl.module.css";

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

const { infoContainer, infoBox, closeInfo, infoKey, infoHeader, infoWeek1, infoWeek2, infoTourism1, infoTourism2, infoCostGoods, blurbWeek, blurb, keyGroup, keyContainer, keyText, tourismSubhead, tourismSubheadWeek, costGoodsContain } = styles;

function AgentsControl ({ selectedTab, isMobile }) {
  const [fullCalendar, setFullCalendar] = useState();
  const [thisWeek, setThisWeek] = useState();
  const [dayInFocus, setDayInFocus] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoPage, setInfoPage] = useState("week");

  const infoHead = [ 'week-at-a-glance info', 'tourism calendar info', 'cost of goods info'];
  const infoParagraph = [ "Factors for predicting seven days of profit margins. Tourism probability, weather, holidays, and local events specific to Bend, OR. Labor estimates and past sales figures are static - they demonstrate how application could be linked to accounting software.",
                          "The tourism calendar is populated with the percent of short term rentals booked on a given day within Bend, OR. This information is obtained by calculating availability data of each rental listing.",
                          "Displays any inventory items that cost to purchase has increased or decreased. Invoice management database and application are connected, calculations flucuate with invoice entry. All data presented is for demonstration purposes only, information is static. "
  ];

  const handleAddingCalendarData = (currentPercents, monthName) => {
    const updatedArray = currentPercents.filter(item => item.percent);
    const today = new Date().toISOString().substring(0,10);
    setFullCalendar([{'month': today.substring(5,7), 'year': today.substring(0,4), 'monthName': monthName}, ...updatedArray]);
    // const updatedThisWeek = thisWeek.map(day => {
    //   const includesDate = updatedArray.filter(calendarDay => day[0] === calendarDay.date);
    //   return [...day, includesDate];
    // });
    // console.log(updatedThisWeek)
  };

  const handleAddingWeekData = (weekData) => {
    console.log(weekData)
    setThisWeek(weekData);
  };

  const handleThisWeek = () => {
    const today = new Date();
    let calcThisWeek = [];

    for (let index = 0; index <= 8; index++) {
      const newDay = new Date(today);
      newDay.setDate(today.getDate() + (index - 1));
      const dayNum = newDay.getDay();
      const newDayStr = newDay.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
      calcThisWeek = [...calcThisWeek, [newDayStr, dayNum]];
    }
    console.log(calcThisWeek)
    setThisWeek(calcThisWeek);
  };

  const handleChangingDayInFocus = (day) => {
    setDayInFocus(day);
  };

  const handleClosingInfoPage = () => {
    setInfoOpen(false);
  }

  const handleChangingInfoPage = (page) => {
    setInfoOpen(true);
    setInfoPage(page);
  };

  useEffect(() => {
    if (infoOpen) {
      setInfoOpen(false);
    }
  }, [selectedTab]);

  useEffect(() => {
    handleThisWeek();
  }, [])

  console.log('week', thisWeek)

  return (
    <>
      <div className={isMobile ? styles.tabWrapper : styles.agentsWrapper}>
        { fullCalendar && (
          <Week thisWeek={thisWeek} 
                dayInFocus={dayInFocus} 
                onChangingDay={handleChangingDayInFocus} 
                selectedTab={selectedTab} 
                isMobile={isMobile} 
                onInfoInFocus={handleChangingInfoPage} />
        )}
        { thisWeek && (
          <Tourism onAddingCalendarData={handleAddingCalendarData} 
                  onAddingWeekData={handleAddingWeekData}
                  thisWeek={thisWeek}
                  selectedTab={selectedTab} 
                  isMobile={isMobile} 
                  onInfoInFocus={handleChangingInfoPage} />
        )}
        <CostGoodsControl selectedTab={selectedTab} 
                          isMobile={isMobile} 
                          onInfoInFocus={handleChangingInfoPage} /> 
                          
        { infoOpen && (
          <div className={infoContainer}>
            <div className={infoBox}>
              <div className={infoHeader}>
                <h3>info</h3>
                <svg className={closeInfo} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" onClick={handleClosingInfoPage} >
                  <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="#666B69"/>
                </svg>
              </div>
              <p className={infoPage === "week" ? blurbWeek : blurb}>{infoPage === 'week' ? infoParagraph[0] : infoPage === 'tourism' ? infoParagraph[1] : infoParagraph[2]}</p>
              <div className={infoKey}>
                { infoPage === "week" ?
                  <>
                    <div className={infoWeek1} >
                      <div className={`${keyGroup} ${keyContainer}`}>
                        <img src={laborKey} alt="labor estimate key" />
                        <p className={keyText}>total labor estimate</p>
                      </div>
                      <div className={`${keyGroup} ${keyContainer}`}>
                        <img src={salesKey} alt="previous sales key" />
                        <p className={keyText}>total sales on equivalent day of previous year</p>
                      </div>
                      <div className={infoWeek2}>
                        <div className={keyGroup}>
                          <img src={holidayKey} alt="holiday key" />
                          <p className={keyText}>holiday</p>
                        </div>
                        <div className={keyGroup}>
                          <img src={eventKey} alt="event key" />
                          <p className={keyText}>local events</p>
                        </div>
                      </div>
                      <p className={tourismSubheadWeek}>Tourism probability</p>
                      <div className={infoWeek2}>
                        <div className={keyGroup}>
                          <img src={lowKey} alt="low tourism probability key" />
                          <p className={keyText}>low</p>
                        </div>
                        <div className={keyGroup}>
                          <img src={midKey} alt="mid tourism probability key" />
                          <p className={keyText}>mid</p>
                        </div>
                      </div>
                      <div className={infoWeek2}>
                        <div className={keyGroup}>
                          <img src={highKey} alt="high tourism probability key" />
                          <p className={keyText}>low</p>
                        </div>
                        <div className={keyGroup}>
                        <img src={alertKey} alt="tourism alert key" />
                        <p className={keyText}>AM vs PM</p>
                        </div>
                      </div>
                    </div>
                  </>
                :
                  infoPage === "tourism" ?
                  <>
                    <div className={infoTourism1}>
                      <div className={keyGroup}>
                        <img src={holidayKey} alt="holiday key" />
                        <p className={keyText}>holiday</p>
                      </div>
                      <div className={keyGroup}>
                        <img src={eventKey} alt="event key" />
                        <p className={keyText}>local events</p>
                      </div>
                    </div>
                    <p className={tourismSubhead}>Tourism probability</p>
                    <div className={infoTourism2}>
                      <div className={keyGroup}>
                        <img src={lowKey} alt="low tourism probability key" />
                        <p className={keyText}>low</p>
                      </div>
                      <div className={keyGroup}>
                        <img src={midKey} alt="mid tourism probability key" />
                        <p className={keyText}>mid</p>
                      </div>
                      <div className={keyGroup}>
                        <img src={highKey} alt="high tourism probability key" />
                        <p className={keyText}>high</p>
                      </div>
                    </div>
                  </> 
                  :
                  <div className={`${infoTourism1} ${costGoodsContain}`} >
                      <div className={keyGroup}>
                        <img src={arrowUpKey} alt="cost increase key" />
                        <p className={keyText}>item cost increased</p>
                      </div>
                      <div className={keyGroup}>
                        <img src={arrowDwnKey} alt="cost decrease key" />
                        <p className={keyText}>item cost decreased</p>
                      </div>
                  </div>
                }
                
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AgentsControl;

