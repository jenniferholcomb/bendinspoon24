import React, { useState, useEffect, useRef } from "react";
import CalendarDay from "./CalendarDay";
import useSTRController from "./useSTRController.jsx";
import usePropertyListing from "./usePropertyListing";
import styles from "./Tourism.module.css";
// import { connectFirestoreEmulator } from "firebase/firestore";
// import Events from "./Events";

const { tourismWrapper, tourismLabelContainer, tourismLabel, calendarContainer, tourismSubhead, calendarWrapper } = styles;

const Tourism = (props) => {
  const selectedMonth = useRef();
  const [currentMonthName, setCurrentMonthName]  = useState();
  const currentYear = useRef();
  const [dates, setDates] = useState([]);

  const month = useRef();
  const [propertyList, loadProperties] = useSTRController();
  const [percentLoaded, setPercentLoaded] = useState(false);
  const [monthAvail, setMonthAvail] = useState();
  const [listingAvailability, handlePropList] = usePropertyListing();


  const handleRentalPercents = () => {
    const availMonth = listingAvailability.filter(item => item.month === month.current);
    setMonthAvail(availMonth);
    setPercentLoaded(true);
  }

  const handleIncrementingNewMonth = () => {
    let newMonth;

    if (selectedMonth.current === 11) {
      newMonth = 0;
    } else {
      newMonth = selectedMonth.current + 1;
    }

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
  }

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
  }

  const handleSettingCalendarDates = () => {
    // const today = new Date();
  
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
  }

  useEffect(() => {
    const today = new Date();
    const monthNow = today.getMonth();  // const month = dateStr.substring(0, 7);
    const monthName = today.toLocaleString('default', { month: 'long' }).toUpperCase();
    selectedMonth.current = monthNow;
    setCurrentMonthName(monthName);

    const year = today.getFullYear();
    currentYear.current = year;

    month.current = year.toString() + '-' + (selectedMonth.current + 1).toString();

    loadProperties(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedMonth.current !== null) {
      handleSettingCalendarDates();
    }
  }, []);

  useEffect(() => {
    if (propertyList) {
      // const shortenedList = propertyList.slice(0,4);
      // console.log('shortenedlist', shortenedList);
      handlePropList(propertyList);
      //setListingAvailabilityLoaded(listingAvailability);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyList]);

  useEffect(() => {
    if (propertyList && listingAvailability) {
      handleRentalPercents();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyList, listingAvailability]);

  return (
    <>
      <div className={tourismWrapper}>
        <div className={tourismLabelContainer}>
          <h3 className={tourismLabel}>tourism calculator</h3>
        </div>
        <div className={calendarContainer}>
        <div className={calendarWrapper}>
          {percentLoaded ?
            <CalendarDay month={dates} 
                         availablePercent={monthAvail} 
                         monthName={currentMonthName} 
                         thisWeek={props.thisWeek.slice(1,8)} 
                         onAddingCalendarData={props.onAddingCalendarData} 
                         onNextMonth={handleIncrementingNewMonth}
                         onPreviousMonth={handleDecrementingNewMonth} />
            :
            null
          }
        </div>
        <p className={tourismSubhead}>% local AirBnb&apos;s occupied by night</p>
        </div>
      </div>

    </>
  );
}

export default Tourism;
