import React, { useState, useEffect, useRef } from "react";
import CalendarDay from "./CalendarDay";
import useSTRController from "./useSTRController.jsx";
import usePropertyListing from "./usePropertyListing";
import styles from "./Tourism.module.css";
// import { connectFirestoreEmulator } from "firebase/firestore";
// import Events from "./Events";

const { tabTourismWrapper, hiddenTourismWrapper, tourismWrapper, tourismHeader, tourismLabelContainer, tourismLabel, infoIcon, calendarContainer, tourismSubhead, calendarPage, calendarWrapper } = styles;

const Tourism = ({ onAddingCalendarData, onAddingWeekData, thisWeek, selectedTab, isMobile, onInfoInFocus }) => {
  const selectedMonth = useRef();
  const [currentMonthName, setCurrentMonthName]  = useState();
  const currentYear = useRef();
  const [dates, setDates] = useState([]);
  const month = useRef();

  const [loadPropertiesOnce] = useSTRController();
  const [properties, setProperties] = useState(null);

  const [listingAvailability, setListingAvailability] = useState(null);
  const [listingsOccupied, handlePropList, percentsError] = usePropertyListing();

  const [percentLoaded, setPercentLoaded] = useState(false);
  const [monthAvail, setMonthAvail] = useState();
  const [nextMonthAvail, setNextMonthAvail] = useState();

  const handleRentalPercents = () => {
    const availMonth = listingAvailability.filter(item => item.month === month.current);
    setMonthAvail(availMonth);
    setPercentLoaded(true);

    const nextMonth = handleSettingNextMonth();
    let year;
    if (nextMonth === 0) {
      year = currentYear.current + 1;
    } else {
      year = currentYear.current;
    }

    let nextMonthStr;
    if (nextMonth < 10) {
      nextMonthStr = year.toString() + '-0' + (nextMonth + 1).toString();
    } else {
      nextMonthStr = year.toString() + '-' + (nextMonth + 1).toString();
    }

    const availNextMonth = listingAvailability.filter(item => item.month === nextMonthStr);
    setNextMonthAvail(availNextMonth);
  };

  const handleSettingNextMonth = () => {
    let newMonth;

    if (selectedMonth.current === 11) {
      newMonth = 0;
    } else {
      newMonth = selectedMonth.current + 1;
    }

    return newMonth;
  };

  const handleIncrementingNewMonth = () => {
    const newMonth = handleSettingNextMonth();

    if (newMonth === 0) {
      currentYear.current = currentYear.current + 1;
    }
    selectedMonth.current = newMonth;

    const newDay = new Date(currentYear.current, newMonth, 1);
    const monthName = newDay.toLocaleString('default', { month: 'long' }).toUpperCase();
    setCurrentMonthName(monthName);

    month.current = 
      currentYear.current.toString() + 
      '-' + 
      (selectedMonth.current >= 10 ? '' : '0') +
      (selectedMonth.current + 1).toString();

    handleSettingCalendarDates();
    handleRentalPercents();
  };

  const handleDecrementingNewMonth = () => {
    let newMonth;

    if (selectedMonth.current === 0) {
      newMonth = 11;
    } else {
      newMonth = selectedMonth.current - 1;
    }

    if (newMonth === 11) {
      currentYear.current = currentYear.current - 1;
    }
    selectedMonth.current = newMonth;

    const newDay = new Date(currentYear.current, newMonth, 1);
    const monthName = newDay.toLocaleString('default', { month: 'long' }).toUpperCase();
    setCurrentMonthName(monthName);

    month.current = 
      currentYear.current.toString() + 
      '-' + 
      (selectedMonth.current >= 9 ? '' : '0') +
      (selectedMonth.current + 1).toString();

    handleSettingCalendarDates();
    handleRentalPercents();
  };

  const handleSettingCalendarDates = () => {
    const year = currentYear.current;
    const monthDays = [31, (( year % 4 ) === 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    const oneIndex = new Date(year, selectedMonth.current, 1).getDay();
    const preMonthArr = Array.from(Array(oneIndex)).map((x, i) =>  { 
      return { 'date': new Date(
        selectedMonth.current === 0 ? year - 1 : year, 
        selectedMonth.current === 0 ? 11 : selectedMonth.current - 1, 
        selectedMonth.current === 0 ? monthDays[11] - i : monthDays[selectedMonth.current - 1] - i
        ).toISOString().substring(0,10) }
    }).reverse();
    const preMonthArrBg = preMonthArr.map((item) => ({
      ...item,
      background: 'rgba(73, 75, 74, 1)',
      color: '#D9D9D9',
      thisWeek: false,
      addHoliday: [false],
      addEvent: [false]
    }));
    const thisMonthArr = Array.from(Array(monthDays[selectedMonth.current])).map((x, i) =>  { 
      return { 'date': new Date(
        year, 
        selectedMonth.current, 
        i + 1
        ).toISOString().substring(0,10) }
    });

    const lastIndex = new Date(year, selectedMonth.current, monthDays[selectedMonth.current]).getDay();

    const endMonthArr = Array.from(Array(6 - lastIndex)).map((x, i) =>  { 
      return { 'date': new Date(
        selectedMonth.current === 11 ? year + 1 : year, 
        selectedMonth.current === 11 ? 0 : selectedMonth.current + 1, 
        i + 1
        ).toISOString().substring(0,10) }
    });
    const endMonthArrBg = endMonthArr.map((item) => ({
      ...item,
      background: 'rgba(73, 75, 74, 1)',
      color: '#D9D9D9',
      thisWeek: false,
      addHoliday: [false],
      addEvent: [false]
    }));
    const allMonth = [...preMonthArrBg, ...thisMonthArr, ...endMonthArrBg];
    setDates(allMonth);
  };

  useEffect(() => {
    const today = new Date();
    const monthNow = today.getMonth();  // const month = dateStr.substring(0, 7);
    const monthName = today.toLocaleString('default', { month: 'long' }).toUpperCase();

    selectedMonth.current = monthNow;
    setCurrentMonthName(monthName);

    const year = today.getFullYear();
    currentYear.current = year;

    if (selectedMonth.current > 8) {
      month.current = year.toString() + '-' + (selectedMonth.current + 1).toString();
    } else {
      month.current = year.toString() + '-0' + (selectedMonth.current + 1).toString();
    }
  }, []);

  useEffect(() => {
    if (selectedMonth.current !== null) {
      handleSettingCalendarDates();
    }
  }, []);

  useEffect(() => {
    if (!properties) {
      loadPropertiesOnce().then((properties) => setProperties(properties));
    }
  }, [loadPropertiesOnce]);

  useEffect(() => {
    if (properties) {
      // const shortenedList = properties[0].propertiesId.slice(0, 28);
      const propertyList = properties[0].propertiesId;

      // console.log('calling usePropertyListing...','properties', propertyList);

      handlePropList(propertyList);
    } 
  }, [properties]);

  useEffect(() => {
    if (listingsOccupied && listingsOccupied !== listingAvailability) {
      setListingAvailability(listingsOccupied);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingsOccupied]);

  useEffect(() => {
    if (listingAvailability) {
      handleRentalPercents();
    }
  }, [listingAvailability]);
  
  useEffect(() => {
    // console.log('propertyList changed:', properties);
  }, [properties]);


  return (
    <>
      <div className={isMobile ? (selectedTab === 'tourism' ? tabTourismWrapper : hiddenTourismWrapper) : tourismWrapper}>
        <div className={tourismHeader}>
          <div className={tourismLabelContainer}>
            <h3 className={tourismLabel}>tourism calendar</h3>
          </div>
          <div className={infoIcon} onClick={() => onInfoInFocus("tourism")}> 
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
              <path d="M8.55 14.25H10.45V8.55H8.55V14.25ZM9.5 6.65C9.76917 6.65 9.99479 6.55896 10.1769 6.37687C10.359 6.19479 10.45 5.96917 10.45 5.7C10.45 5.43083 10.359 5.20521 10.1769 5.02312C9.99479 4.84104 9.76917 4.75 9.5 4.75C9.23083 4.75 9.00521 4.84104 8.82312 5.02312C8.64104 5.20521 8.55 5.43083 8.55 5.7C8.55 5.96917 8.64104 6.19479 8.82312 6.37687C9.00521 6.55896 9.23083 6.65 9.5 6.65ZM9.5 19C8.18583 19 6.95083 18.7506 5.795 18.2519C4.63917 17.7531 3.63375 17.0762 2.77875 16.2212C1.92375 15.3662 1.24687 14.3608 0.748125 13.205C0.249375 12.0492 0 10.8142 0 9.5C0 8.18583 0.249375 6.95083 0.748125 5.795C1.24687 4.63917 1.92375 3.63375 2.77875 2.77875C3.63375 1.92375 4.63917 1.24687 5.795 0.748125C6.95083 0.249375 8.18583 0 9.5 0C10.8142 0 12.0492 0.249375 13.205 0.748125C14.3608 1.24687 15.3662 1.92375 16.2212 2.77875C17.0762 3.63375 17.7531 4.63917 18.2519 5.795C18.7506 6.95083 19 8.18583 19 9.5C19 10.8142 18.7506 12.0492 18.2519 13.205C17.7531 14.3608 17.0762 15.3662 16.2212 16.2212C15.3662 17.0762 14.3608 17.7531 13.205 18.2519C12.0492 18.7506 10.8142 19 9.5 19ZM9.5 17.1C11.6217 17.1 13.4187 16.3637 14.8912 14.8912C16.3637 13.4187 17.1 11.6217 17.1 9.5C17.1 7.37833 16.3637 5.58125 14.8912 4.10875C13.4187 2.63625 11.6217 1.9 9.5 1.9C7.37833 1.9 5.58125 2.63625 4.10875 4.10875C2.63625 5.58125 1.9 7.37833 1.9 9.5C1.9 11.6217 2.63625 13.4187 4.10875 14.8912C5.58125 16.3637 7.37833 17.1 9.5 17.1Z" fill="#7B817B"/>
            </svg>
          </div>
        </div>
        <div className={calendarContainer}>
          {/* <div className={calendarPage}>  */}
            <div className={calendarWrapper}>
              {percentLoaded ?
                <CalendarDay month={dates} 
                            availablePercent={monthAvail} 
                            nextMonthAvailPerc={nextMonthAvail}
                            monthName={currentMonthName} 
                            thisWeek={thisWeek.slice(0,8)} 
                            onAddingCalendarData={onAddingCalendarData} 
                            onAddingWeekData={onAddingWeekData}
                            onNextMonth={handleIncrementingNewMonth}
                            onPreviousMonth={handleDecrementingNewMonth} />
                :
                null
              }
            </div>
        </div>
            <div className={tourismSubhead}>
              <p>% short term rentals (STR) occupied by night</p>
            </div>
      </div>

    </>
  );
}

export default Tourism;
