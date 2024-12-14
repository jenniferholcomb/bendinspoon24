import React, { useState, useEffect } from "react";
import Tourism from './Tourism';
import Week from './Week';
import CostGoodsControl from './CostGoodsControl';
import styles from "./AgentsControl.module.css";

const { infoContainer, infoBox, closeInfo, infoKey, infoWeek, infoTourism, infoCostGoods } = styles;

function AgentsControl ({ selectedTab, isMobile }) {
  const [fullCalendar, setFullCalendar] = useState();
  const [thisWeek, setThisWeek] = useState();
  const [dayInFocus, setDayInFocus] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoPage, setInfoPage] = useState("week");

  const infoParagraph = [ "Factors for predicting seven days of profit margins. Tourism probability, weather, holidays, and local events specific to Bend, OR. Labor estimates and past sales figures are static - demonstrate how application could be linked to accounting software.",
                          "The tourism calendar is populated with the percent of short term rentals booked on a given day within Bend, OR. This information is obtained by calculating availability data of each rental listing.",
                          "Displays any inventory items that cost to purchase has increased or decreased. Invoice management database and application are connected, calculations flucuate with invoice entry. All data presented is for demonstration purposes only, information is static. "
  ];

  const handleAddingCalendarData = (currentPercents, monthName) => {
    const updatedArray = currentPercents.filter(item => item.percent);
    const today = new Date().toISOString().substring(0,10);
    setFullCalendar([{'month': today.substring(5,7), 'year': today.substring(0,4), 'monthName': monthName}, ...updatedArray]);

    const updatedThisWeek = thisWeek.map(day => {
      const includesDate = updatedArray.filter(calendarDay => day[0] === calendarDay.date);
      return [...day, includesDate];
    });
    setThisWeek(updatedThisWeek);
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

  return (
    <>
      <div className={isMobile ? styles.tabWrapper : styles.agentsWrapper}>
        {fullCalendar && (
          <Week thisWeek={thisWeek} 
                dayInFocus={dayInFocus} 
                onChangingDay={handleChangingDayInFocus} 
                selectedTab={selectedTab} 
                isMobile={isMobile} 
                onInfoInFocus={handleChangingInfoPage} />
        )}
        {thisWeek && (
          <Tourism onAddingCalendarData={handleAddingCalendarData} 
                  thisWeek={thisWeek}
                  selectedTab={selectedTab} 
                  isMobile={isMobile} 
                  onInfoInFocus={handleChangingInfoPage} />
        )}
        <CostGoodsControl selectedTab={selectedTab} 
                          isMobile={isMobile} 
                          onInfoInFocus={handleChangingInfoPage} /> 
                          
        { infoOpen &&(
          <div className={infoContainer}>
            <div className={infoBox}>
              <svg className={closeInfo} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" onClick={handleClosingInfoPage} >
                <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="#666B69"/>
              </svg>
              <p>{infoParagraph[0]}</p>
              <div className={infoKey}>
                { infoPage === "week" ?
                    <div className={infoWeek} >

                    </div>
                :
                  infoPage === "tourism" ?
                    <div className={infoTourism} >

                    </div>
                  :
                  <div className={infoCostGoods} >

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

