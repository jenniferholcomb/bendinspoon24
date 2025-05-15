import React, { useState, useEffect } from "react";
import Tourism from './Tourism';
import Week from './Week';
import CostGoodsControl from './CostGoodsControl';
import Info from './Info';
import styles from "./AgentsControl.module.css";

const { infoContainer, infoBox, closeInfo, infoKey, infoHeader, infoWeek1, infoWeek2, infoTourism1, infoTourism2, infoCostGoods, blurbWeek, blurb, keyGroup, keyContainer, keyText, tourismSubhead, tourismSubheadWeek, costGoodsContain } = styles;

function AgentsControl ({ selectedTab, isMobile, handleInfoPage, infoOpen }) {
  const [fullCalendar, setFullCalendar] = useState();
  const [thisWeek, setThisWeek] = useState();
  const [dayInFocus, setDayInFocus] = useState(0);
  // const [infoOpen, setInfoOpen] = useState(false);
  const [infoPage, setInfoPage] = useState("week");

  const handleAddingCalendarData = (currentPercents, monthName) => {
    const updatedArray = currentPercents.filter(item => item.percent);
    const today = new Date().toISOString().substring(0,10);
    setFullCalendar([{'month': today.substring(5,7), 'year': today.substring(0,4), 'monthName': monthName}, ...updatedArray]);
    // const updatedThisWeek = thisWeek.map(day => {
    //   const includesDate = updatedArray.filter(calendarDay => day[0] === calendarDay.date);
    //   return [...day, includesDate];
    // });
  };

  const handleAddingWeekData = (weekData) => {
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
    setThisWeek(calcThisWeek);
  };

  const handleChangingDayInFocus = (day) => {
    setDayInFocus(day);
  };

  // const handleClosingInfoPage = () => {
  //   setInfoOpen(false);
  // };

  const handleChangingInfoPage = (page) => {
    handleInfoPage(true);
    setInfoPage(page);
  };

  useEffect(() => {
    if (infoOpen) {
      handleInfoPage(false);
    }
  }, [selectedTab]);

  useEffect(() => {
    handleThisWeek();
  }, [])

  return (
    <>
      <div className={isMobile ? styles.tabWrapper : styles.agentsWrapper}>
        { fullCalendar && (
          <Week thisWeek={thisWeek} 
                dayInFocus={dayInFocus} 
                onChangingDay={handleChangingDayInFocus} 
                selectedTab={selectedTab} 
                isMobile={isMobile} 
                onInfoInFocus={handleChangingInfoPage} 
                infoOpen={infoOpen} />
        )}
        { thisWeek && (
          <Tourism onAddingCalendarData={handleAddingCalendarData} 
                  onAddingWeekData={handleAddingWeekData}
                  thisWeek={thisWeek}
                  selectedTab={selectedTab} 
                  isMobile={isMobile} 
                  onInfoInFocus={handleChangingInfoPage}
                  infoOpen={infoOpen} />
        )}
        <CostGoodsControl selectedTab={selectedTab} 
                          isMobile={isMobile} 
                          onInfoInFocus={handleChangingInfoPage}
                          infoOpen={infoOpen} /> 
                          
        { infoOpen && (
          <Info isOpen={infoOpen}
                selectedInfo={infoPage} 
                onClosingInfoPage={handleInfoPage} />
        )}
      </div>
    </>
  );
}

export default AgentsControl;

