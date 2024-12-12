import React, { useState, useEffect } from "react";
import Tourism from './Tourism';
import Week from './Week';
import CostGoodsControl from './CostGoodsControl';
import styles from "./AgentsControl.module.css";

function AgentsControl ({ selectedTab, isMobile }) {
  const [fullCalendar, setFullCalendar] = useState();
  const [thisWeek, setThisWeek] = useState();
  const [dayInFocus, setDayInFocus] = useState(0);

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
                isMobile={isMobile} />
        )}
        {thisWeek && (
          <Tourism onAddingCalendarData={handleAddingCalendarData} 
                  thisWeek={thisWeek}
                  selectedTab={selectedTab} 
                  isMobile={isMobile} />
        )}
        <CostGoodsControl selectedTab={selectedTab} 
                          isMobile={isMobile} /> 
      </div>
    </>
  );
}

export default AgentsControl;

