import React, {useState, useEffect} from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "./usePopover";
import useHolidays from "./useHolidays.jsx";
import useEvents from "./useEvents.jsx";
import useResize from "./useResize.jsx";
import styles from "./CalendarDay.module.css";
import PropTypes from 'prop-types';

import holidayIcon from "/img/holiday.svg";
import eventIcon from "/img/event.svg";
import holidayEventIcon from "/img/holidayEvent.svg";

const {calMonth, calArrowLeft, calArrowLeftDisabled, calText, calArrowRight, calArrowRightDisabled, calendarDateContainer, percentContainer, propPercent, date, dateBubble, popDateBubble, listItemCal, popoverContent, popoverArrow, popHeaderHoliday, popHeaderEventContainer, popHeaderEvent, popEventName, popEventDescription, yearHidden } = styles;

function getBubbleStyle({ 
  addHoliday = [], 
  addEvent = [], 
  background = '', 
  currentDay = false, 
  isTablet = false, 
  isShort = false,
  icons = {} 
}) {
  const { holidayIcon, eventIcon, holidayEventIcon } = icons;

  const style = {
    background: background,
    // border: currentDay && '1.75px solid #C13F07',
  };

  if (addHoliday[0] && addEvent[0]) {
    style.background = `url("${holidayEventIcon}"), ${background}`;
  } else if (addHoliday[0]) {
    style.background = `url("${holidayIcon}"), ${background}`;
    if (isTablet && !isShort) {
      style.backgroundPosition = '25% 0%';
      style.backgroundSize = 'auto 139%, cover';
    }
  } else if (addEvent[0]) {
    style.background = `url("${eventIcon}"), ${background}`;
  }

  return style;
}

function DateStyle ({item, index}) {
  const [orientation, isMobile, isTablet, isShort] = useResize();
  const bubbleStyle = getBubbleStyle({
    addHoliday: item.addHoliday,
    addEvent: item.addEvent,
    background: item.background,
    currentDay: item.currentDay,
    isTablet,
    isShort,
    icons: {
      holidayIcon,
      eventIcon,
      holidayEventIcon,
    }
  });

  const [year, month, day] = item.date.split("-").map(Number);
  const dateDay = new Date(year, month - 1, day);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div
      className={listItemCal}
      key={index}
      style={item.currentWeek ? { background: '#595F5D' } : null}
      role="gridcell"
      aria-label={`${dayNames[dateDay.getDay()]}, ${dateDay.toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}${item.percent ? `. ${item.percent}% short term rentals booked` : ''}`}
    >
      {item.addHoliday[0] || item.addEvent[0] ? 
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={dateBubble}
              style={bubbleStyle}
            >
              <time className={date} style={{ color: `${item.color}` }}>
                {item.date.charAt(8) === '0' ? item.date.substring(9) : item.date.substring(8)}
              </time>
              <div className={percentContainer}>
                <span
                  className={propPercent}
                  style={item.percent ? (item.percent >= 85 ? { color: '#FFF' } : { color: '#2D3230' }) : null}
                >
                  {item.percent}
                </span>
              </div>
            </button>
          </PopoverTrigger>
          
          <PopoverContent style={{outline: 'none', zIndex: '9999'}}>
            <div className={popoverContent}>
              {item.addHoliday[0] && 
                <h3 className={popHeaderHoliday} aria-label="Holiday:">{item.addHoliday[1][0].name}</h3>
              }
              {item.addEvent[0] && 
                <>
                  <ul className={popHeaderEventContainer} aria-label="Local Events">
                    <h3 className={popHeaderEvent} aria-hidden="true">Local Events:</h3>
                    { item.addEvent[1].map((event, index) => 
                      <React.Fragment key={index} >
                        <li>
                          <p className={popEventName}>{event.name}</p>
                          <p className={popEventDescription}>"{event.description}"</p>
                        </li>
                      </React.Fragment>
                    )}
                  </ul>
                </>
              }
            </div>
            <svg className={popoverArrow} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 14" fill="none" aria-hidden="true">
              <path d="M10.7692 14L0 0H20L10.7692 14Z" fill="#D9D9D9"/>
            </svg>
          </PopoverContent>
        </Popover> 
      : 
        <div
          className={dateBubble}
          style={{
            background: `${item.background}`,
            ...(item.currentDay ? { outline: '2px solid #F54949' } : { outline: 'none' }),
          }}
        >
          <time 
            className={date} 
            style={{ color: `${item.color}` }}
          >
            {item.date.charAt(8) === '0' ? item.date.substring(9) : item.date.substring(8)}
          </time>
          <div className={percentContainer}>
            <span
              className={propPercent}
              style={item.percent ? (item.percent >= 85 ? { color: '#FFF' } : { color: '#2D3230' }) : null}
            >
              {item.percent}
            </span>
          </div>
        </div>
      }
    </div>
  );
}

function CalendarDay ({ month, availablePercent, nextMonthAvailPerc, monthName, thisWeek, onAddingCalendarData, onAddingWeekData, onNextMonth, onPreviousMonth, year }) {
  const [monthBg, setMonthBg] = useState();
  const [datesLoaded, setDatesLoaded] = useState(false);
  const [holidayList, holidaysSent] = useHolidays();
  const [eventsList, eventsSent] = useEvents();
  const [futureDate, setFutureDate] = useState();
  const thisWeekUpdate = thisWeek.slice(1,8);
  const thisYear = new Date().getFullYear();

  const handleCheckingDate = (sentList, date, type) => {
    let list;
    if (type === 'holiday') {
      list = sentList;
    } else {
      list = sentList[1].events;
    }
    const dateMatch = list.filter(day => day.date.includes(date));
    const dateConfirmed = dateMatch.length > 0 ? true : false;
    return [dateConfirmed, dateMatch];
  };

  const populateDayData = (item, percent, currentDay, addHoliday, addEvent, currentWeek) => {
    if (item.background) {
      return { ...item };
    } else {
      if (percent >= 85) {
        return {
          ...item,
          background: 'linear-gradient(311deg, #005054 7.46%, #006065 48.43%, #008B93 90.02%)',
          color: '#D9D9D9',
          percent: percent,
          currentWeek: currentWeek ? currentWeek : undefined,
          currentDay: currentDay,
          addHoliday: addHoliday,
          addEvent: addEvent
        } 
      } else if (percent >= 65) {
        return {
          ...item,
          background: 'linear-gradient(309deg, #03A0A9 17.77%, #09C2CD 55.08%, #7FE4EA 92.96%)',
          color: '#5A5C5B',
          percent: percent,
          currentWeek: currentWeek ? currentWeek : undefined,
          currentDay: currentDay,
          addHoliday: addHoliday,
          addEvent: addEvent
        }
      } else {
        return { 
          ...item,
          background: 'linear-gradient(303deg, #82BDBF -4.53%, #B0EAEC 41.72%, #C6F5F8 88.68%)',
          color: '#5A5C5B',
          percent: percent,
          currentWeek: currentWeek ? currentWeek : undefined,
          currentDay: currentDay,
          addHoliday: addHoliday,
          addEvent: addEvent
        };
      }
    }      
  };

  const handleFillingWeek = () => {
    const newWeek = thisWeek.map((item, index) => {
      const found = month[15].date.slice(5,7) === item[0].slice(5,7) ? availablePercent[0].availability.find(avail => avail[item[0]]) :                             
                                                                      nextMonthAvailPerc[0].availability.find(avail => avail[item[0]]);
      const percent = found ? Math.floor(found[item[0]]) : undefined;
      const dayKey = found ? Object.keys(found)[0] : undefined;
      // const currentWeek = thisWeek.some(entry => entry[0] === dayKey);

      const todayDateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });

      const currentDay = dayKey === todayDateStr ? true : false;

      const addHoliday = handleCheckingDate(holidayList, item[0], 'holiday');
      const addEvent = handleCheckingDate(eventsList, item[0], 'event');

      return populateDayData(item, percent, currentDay, addHoliday, addEvent);   
    });
    onAddingWeekData(newWeek);
  };

  const handleFillingDays = () => {
    const newMonth = month.map((item, index) => {
      const found = availablePercent[0].availability.find(avail => avail[item.date]);
      const percent = found ? Math.floor(found[item.date]) : undefined;
      const dayKey = found ? Object.keys(found)[0] : undefined;
      const currentWeek = thisWeekUpdate.some(entry => entry[0] === dayKey);

      const todayDateStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
      const currentDay = dayKey === todayDateStr ? true : false;

      const addHoliday = handleCheckingDate(holidayList, item.date, 'holiday');
      const addEvent = handleCheckingDate(eventsList, item.date, 'event');

      return populateDayData(item, percent, currentDay, addHoliday, addEvent, currentWeek);   
    });
    setMonthBg(newMonth);
    onAddingCalendarData(newMonth, monthName);
    setDatesLoaded(true);
  };

  const handleSettingLastMonth = () => {
    const today = new Date();

    const futureMonth = new Date();
    futureMonth.setMonth(today.getMonth() + 11);

    if (futureMonth.getDate() < today.getDate()) {
      futureMonth.setDate(0); // Sets to the last day of the previous month
    }

    const dateString = futureMonth.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }).substring(0,7);
    setFutureDate(dateString);
  };

  useEffect(() => {
    if (eventsSent && holidaysSent && !datesLoaded) {
      handleFillingDays();
      handleSettingLastMonth();
      handleFillingWeek();
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thisWeek, holidaysSent, eventsSent, datesLoaded]);

  useEffect(() => {
    if (datesLoaded) {
      handleFillingDays();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[month]);

  return (
    <>
      {monthBg && (
        <>
          <div className={calMonth} aria-label={`${monthName} ${year}`}>
            <div className={month[15].date.substring(0,7) === '2024-10' ? calArrowLeftDisabled : calArrowLeft}>
              <button
                onClick={onPreviousMonth}
                aria-label="previous month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="16" viewBox="0 0 8 16" fill="none" aria-hidden="true">
                  <g filter="url(#filter0_i_845_1399)">
                    <path d="M8 16L8 0L-2.54292e-07 8L8 16Z" fill="url(#paint0_linear_845_1399)"/>
                  </g>
                  <defs>
                    <filter id="filter0_i_845_1399" x="-6" y="-6" width="14" height="22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dx="-6" dy="-6"/>
                      <feGaussianBlur stdDeviation="4"/>
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.42 0"/>
                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_845_1399"/>
                    </filter>
                    <linearGradient id="paint0_linear_845_1399" x1="-4.00214e-05" y1="6.63996" x2="9.35996" y2="-1.04004" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#B8B9B9"/>
                      <stop offset="0.806083" stopColor="#5A5C5B"/>
                    </linearGradient>
                  </defs>
                </svg>
              </button>
            </div>
            <p className={calText} aria-hidden="true">{monthName} <span className={thisYear === year ? yearHidden : null}>'{year - 2000}</span></p>
            <div className={month[15].date.substring(0,7) === futureDate ? calArrowRightDisabled : calArrowRight}>
              <button
                onClick={onNextMonth}
                aria-label="next month"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="16" viewBox="0 0 8 16" fill="none" aria-hidden="true">
                  <g filter="url(#filter0_i_845_1400)">
                    <path d="M-0.000244141 3.57628e-07V16L7.99976 8L-0.000244141 3.57628e-07Z" fill="url(#paint0_linear_845_1400)"/>
                  </g>
                  <defs>
                    <filter id="filter0_i_845_1400" x="-6.00024" y="-6" width="14" height="22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dx="-6" dy="-6"/>
                      <feGaussianBlur stdDeviation="4"/>
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.42 0"/>
                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_845_1400"/>
                    </filter>
                    <linearGradient id="paint0_linear_845_1400" x1="7.9998" y1="9.36004" x2="-1.36021" y2="17.04" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#B8B9B9"/>
                      <stop offset="0.806083" stopColor="#5A5C5B"/>
                    </linearGradient>
                  </defs>
                </svg>
              </button>
            </div>
          </div>
          {monthBg.map((item, index) => (
            <DateStyle item={item} 
                      index={index} 
                      key={index} />
          ))}
        </>
      )}
    </>
  );
}

CalendarDay.propTypes = {
  month: PropTypes.array,
  availablePercent: PropTypes.array, 
  monthName: PropTypes.string, 
  thisWeek: PropTypes.array, 
  nextMonthAvailPerc: PropTypes.array,
  onAddingCalendarData: PropTypes.func, 
  onAddingWeekData: PropTypes.func,
  onNextMonth: PropTypes.func,
  onPreviousMonth: PropTypes.func
};

export default CalendarDay;



// {monthBg.map((item, index) => 
//   <>
//     <div className={listItemCal} key={index} style={item.currentWeek ? {background: '#595F5D'} : null}>
//       <>
//         <div
//           className={dateBubble}
//           style={{
//             ...(item.addHoliday[0] && item.addEvent[0] ? { background: `url(${holidayEventIcon}), ${item.background}` } : item.addHoliday[0] ? { background: `url(${holidayIcon}), ${item.background}` } : item.addEvent[0] ? { background: `url(${eventIcon}), ${item.background}` } : { background: `${item.background}`}),
//             ...(item.currentDay ? { outline: '3px solid #C13F07' } : { outline: 'none' })
//           }}
//         >
//           <p className={date} style={{color: `${item.color}`}}>{item.date.charAt(8) === '0' ? item.date.substring(9) : item.date.substring(8)}</p>
//           <div className={percentContainer}>
//             <p className={propPercent} style={item.percent ? item.percent >= 85 ? {color: '#FFF'} : {color: '#2D3230'} : null}>{item.percent}</p> 
//             {/* {
//               item.percent ? <p className={percentSign} style={item.percent ? item.percent >= 85 ? {color: '#D9D9D9'} : {color: '#5A5C5B'} : null}>%</p> : null
//             } */}
//           </div>
//         </div>
//       </>
//     </div>
//   </>
// )}