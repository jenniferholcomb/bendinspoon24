import React, { useState, useEffect, useRef } from "react";
import CalendarDay from "./CalendarDay";
import useSTRController from "./useSTRController.jsx";
import usePropertyListing from "./usePropertyListing";
import styles from "./Tourism.module.css";
// import { connectFirestoreEmulator } from "firebase/firestore";
// import Events from "./Events";

const { tabTourismWrapper, hiddenTourismWrapper, tourismWrapper, tourismHeader, tourismLabelContainer, tourismLabel, calendarContainer, tourismSubhead, calendarPage, calendarWrapper } = styles;

const Tourism = ({ onAddingCalendarData, thisWeek, selectedTab, isMobile }) => {
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
    console.log('pre', preMonthArrBg)
    console.log('mnth', thisMonthArr)
    console.log('end', endMonthArrBg)
    const allMonth = [...preMonthArrBg, ...thisMonthArr, ...endMonthArrBg];
    console.log(allMonth)
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

      console.log('calling usePropertyListing...','properties', propertyList);

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

  // useEffect(() => {
  //   if (percentsError) {
  //     console.log(percentsError)
  //   }
  // }, [percentsError]);



  // useEffect(() => {
  //   if (listingAvailability) {
  //     handleRentalPercents();
  //   }
  // }, [listingAvailability]);

  // useEffect(() => {
  //   console.log('listingsOccupied changed:', listingsOccupied);
  // }, [listingsOccupied]);
  
  useEffect(() => {
    console.log('propertyList changed:', properties);
  }, [properties]);
  

  return (
    <>
      <div className={isMobile ? (selectedTab === 'tourism' ? tabTourismWrapper : hiddenTourismWrapper) : tourismWrapper}>
        <div className={tourismHeader}>
          <div className={tourismLabelContainer}>
            <h3 className={tourismLabel}>tourism calculator</h3>
          </div>
        </div>
        <div className={calendarContainer}>
          {/* <div className={calendarPage}>  */}
            <div className={calendarWrapper}>
              {percentLoaded ?
                <CalendarDay month={dates} 
                            availablePercent={monthAvail} 
                            monthName={currentMonthName} 
                            thisWeek={thisWeek.slice(1,8)} 
                            onAddingCalendarData={onAddingCalendarData} 
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
