import React, { useEffect, useState } from "react";
import useWeather from "./useWeather";
import Info from "./Info";
import styles from "./Week.module.css";
import holidayIcon from "/img/holidayAlert.svg";
import highAlert from "/img/highAlert.svg";
import mediumAlert from "/img/mediumAlert.svg";
import lowAlert from "/img/lowAlert.svg";
import wideHighAlert from "/img/wideHighAlert.svg";
import wideMediumAlert from "/img/wideMediumAlert.svg";
import wideLowAlert from "/img/wideLowAlert.svg";

const { tabWeekWrapper, hiddenWeekWrapper, weekWrapper, weekHeader, weekLabelContainer, weekLabel, infoIcon, weekdayCards, weekdayCardsContainer, inFocusWrap, landscapeWrap, inFocusCard, dayCard, cardHidden, mobileCardContainer, endDiv, dayCardContainer, dateContainer, dayDate, dayDateFocusContainer, dayDateFocus, dayWeek, holidayTitle, weatherContainerFocus, weatherDegreeContainer, hiLoLabel, weatherDegreeFocus, weatherNudge, weatherContainer, iconContainer, weatherIcon, weatherDegree, inFocusContainer, notInFocusContainer, eventInFocus, eventInFocusHidden, shadowTop, eventsContainer, eventsHeader, noEventsHeader, singleEventContainer, eventDescription, eventTitle, eventQuote, salesLaborContainer, dividerLine, factorContainer, dollarSignLabor, dollarSignSales, laborTotalA, laborTotalB, factorLabel, laborLabel, salesLabels, salesLabelA, salesLabelB, salesTotalA, salesTotalB, customBarContainer, backgroundLayer, colorLayer, rentalsOccupiedText, centerContainer, percentContainerA, percentContainerB, aMPM, percentSign, eventHolidayAlerts, eventAlerts, holidayAlert, holidayAlertImg, hideHolidayAlert } = styles;

function Week ({ thisWeek, dayInFocus, onChangingDay, selectedTab, isMobile, onInfoInFocus, infoOpen }) {
  const [loadWeather] = useWeather();
  const [weather, setWeather] = useState(null);
  const thisWeekUpdate = thisWeek.slice(1,8);
  const daysOfWeek = ['SU', 'M', 'TU', 'W', 'TH', 'F', 'SA'];
  const fullDaysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const sales = ['6,824', '3,875', '3,294', '3,608', '3,224', '4,241', '5,552'];
  const labor = ['1,185', '634', '578', '526', '508', '861', '1,038'];
  console.log(thisWeekUpdate)
  const handleLastYearDate = (date) => {
    const dateEquivalent = new Date(date);
  
    dateEquivalent.setDate(dateEquivalent.getDate() - 2);
    dateEquivalent.setFullYear(dateEquivalent.getFullYear() - 1);

    const formattedDate = dateEquivalent.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    return formattedDate; 
  };

  const formatDateString = (dateStr, dayIndex) => {
    const dayOfWeek = fullDaysOfWeek[dayIndex];
    const month = parseInt(dateStr.substring(5, 7), 10);
    const day = parseInt(dateStr.substring(8, 10), 10);
    console.log(dayIndex)
    if (dayIndex) {
      return `${dayOfWeek}, ${month}/${day}`;
    } else {
      return `${month}/${day}`;
    }
  };

  const formatWeatherString = (label, temp, id) => {
    return (
      <p className={hiLoLabel} aria-label={`${label} temperature: ${temp} degrees`}>
        {label}
        <span className={weatherDegreeFocus} {...(id ? { id } : {})}>
          {temp}°
        </span>
      </p>
    );
  };

  useEffect(() => {
    // console.log("Attaching weather listener...");
    const unsubscribe = loadWeather((weatherData) => {
      // console.log("Weather data received:", weatherData);
      setWeather(weatherData);
    });
    
    return () => {
      // console.log("Cleaning up listener...");
      if (typeof unsubscribe === "function") unsubscribe(); 
    };
  }, [loadWeather]);

  return (
    <>
      <section className={isMobile ? (selectedTab === 'week' ? tabWeekWrapper : hiddenWeekWrapper) : weekWrapper} aria-hidden={infoOpen ? "true" : "false"} aria-labelledby="week-label">
        <div className={weekHeader}>
          <div className={weekLabelContainer}>
            <h2 className={weekLabel} id="week-label">week-at-a-glance</h2>
          </div>
          <div className={infoIcon}>
            <button 
              onClick={() => onInfoInFocus("week")}
              aria-label="information"
            > 
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
                <path d="M8.55 14.25H10.45V8.55H8.55V14.25ZM9.5 6.65C9.76917 6.65 9.99479 6.55896 10.1769 6.37687C10.359 6.19479 10.45 5.96917 10.45 5.7C10.45 5.43083 10.359 5.20521 10.1769 5.02312C9.99479 4.84104 9.76917 4.75 9.5 4.75C9.23083 4.75 9.00521 4.84104 8.82312 5.02312C8.64104 5.20521 8.55 5.43083 8.55 5.7C8.55 5.96917 8.64104 6.19479 8.82312 6.37687C9.00521 6.55896 9.23083 6.65 9.5 6.65ZM9.5 19C8.18583 19 6.95083 18.7506 5.795 18.2519C4.63917 17.7531 3.63375 17.0762 2.77875 16.2212C1.92375 15.3662 1.24687 14.3608 0.748125 13.205C0.249375 12.0492 0 10.8142 0 9.5C0 8.18583 0.249375 6.95083 0.748125 5.795C1.24687 4.63917 1.92375 3.63375 2.77875 2.77875C3.63375 1.92375 4.63917 1.24687 5.795 0.748125C6.95083 0.249375 8.18583 0 9.5 0C10.8142 0 12.0492 0.249375 13.205 0.748125C14.3608 1.24687 15.3662 1.92375 16.2212 2.77875C17.0762 3.63375 17.7531 4.63917 18.2519 5.795C18.7506 6.95083 19 8.18583 19 9.5C19 10.8142 18.7506 12.0492 18.2519 13.205C17.7531 14.3608 17.0762 15.3662 16.2212 16.2212C15.3662 17.0762 14.3608 17.7531 13.205 18.2519C12.0492 18.7506 10.8142 19 9.5 19ZM9.5 17.1C11.6217 17.1 13.4187 16.3637 14.8912 14.8912C16.3637 13.4187 17.1 11.6217 17.1 9.5C17.1 7.37833 16.3637 5.58125 14.8912 4.10875C13.4187 2.63625 11.6217 1.9 9.5 1.9C7.37833 1.9 5.58125 2.63625 4.10875 4.10875C2.63625 5.58125 1.9 7.37833 1.9 9.5C1.9 11.6217 2.63625 13.4187 4.10875 14.8912C5.58125 16.3637 7.37833 17.1 9.5 17.1Z" fill="#7B817B"/>
              </svg>
            </button>
          </div>
        </div>
        <div className={weekdayCards}>
          <div className={weekdayCardsContainer}>
            <div className={isMobile ? inFocusWrap : landscapeWrap}>
              {thisWeek && (
                thisWeekUpdate.map((day, index) => 
                  <div 
                    role="button"
                    tabIndex="0"
                    aria-expanded={index === dayInFocus}
                    aria-label={`Card for ${fullDaysOfWeek[day[1]]} - ${index === dayInFocus ? "expanded" : "collapsed"}`}
                    key={index} 
                    className={index === dayInFocus ? inFocusCard : isMobile ? cardHidden : dayCard} 
                    onClick={!isMobile ? () => onChangingDay(index) : null} 
                    onKeyDown={!isMobile ? 
                      (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onChangingDay(index);
                      }}
                    :
                      null
                    }
                  >
                    <div className={dayCardContainer}>
                      <div className={dateContainer}>    
                        { index === dayInFocus ?
                          <>
                            <div className={dayDateFocusContainer}>
                              <h3 className={dayDateFocus}>{`${fullDaysOfWeek[day[1]]}, ${formatDateString(day[0])}`}</h3>
                              { day.addHoliday[1].length > 0 && (
                                <>
                                  <p className={holidayTitle} aria-label="Holiday:">{day.addHoliday[1][0].name}</p>
                                </>
                              )}
                            </div>
                          </>
                        :
                          <h3 className={dayDate} aria-label={`${fullDaysOfWeek[day[1]]}, ${formatDateString(day[0])}`}>
                            <span className={dayWeek} aria-hidden="true">{daysOfWeek[day[1]]}</span>
                            <br aria-hidden="true" />
                            {formatDateString(day[0])}
                          </h3>
                        }              
                        { weather && (
                          index === dayInFocus ?
                            <div className={weatherContainerFocus} aria-label="weather">
                              <img src={`/img/icons/${weather[index+14]}.png`} alt={`${weather[index+21]}`} />
                              <div className={weatherDegreeContainer}>
                                {formatWeatherString("LO", weather[index])}
                                {formatWeatherString("HI", weather[index + 7], weatherNudge)}
                              </div>
                            </div>
                          :
                            <div className={weatherContainer} aria-label="weather">
                              <div className={iconContainer}>                  
                                <img className={weatherIcon} src={`/img/icons/${weather[index+14]}.png`} alt={`${weather[index+21]}`} /> 
                              </div>
                              <p className={weatherDegree} aria-label={`HI temperature: ${weather[index+7]} degrees`}>{weather[index+7]}°</p>
                            </div> 
                        )}
                      </div>
                      <div className={index === dayInFocus ? inFocusContainer : notInFocusContainer}>
                        <div className={index === dayInFocus ? eventInFocus : eventInFocusHidden}>
                          <div className={shadowTop}></div>
                          <ul className={eventsContainer} aria-label={day.addEvent[1].length > 0 ? "Local events" : "No local events"}>                      
                            <h4 className={eventsHeader} aria-hidden="true"><span className={day.addEvent[1].length > 0 ? noEventsHeader : null}>NO </span>LOCAL EVENTS</h4>
                            {day.addEvent[1].map((event, i) => 
                              <li key={i} className={singleEventContainer}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 7 7" fill="none" aria-hidden="true">
                                  <circle cx="3.5" cy="3.50024" r="3.5" fill="#e74040"/>
                                </svg>
                                <div className={eventDescription}>
                                  <p className={eventTitle}>{event.name}</p>
                                  <p className={eventQuote}>"{event.description}"</p>
                                </div>
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className={salesLaborContainer}>
                          <div className={dividerLine} aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="112" height="2" viewBox="0 0 99 2" fill="none">
                              <path d="M98 1.49999C98.2761 1.49999 98.5 1.27613 98.5 0.999991C98.5 0.723849 98.2761 0.499991 98 0.499991L98 1.49999ZM4.37114e-08 1.5L98 1.49999L98 0.499991L-4.37114e-08 0.5L4.37114e-08 1.5Z" fill="#484A49"/>
                            </svg>
                          </div>
                          <div className={factorContainer} aria-label={`Labor estimate: $${labor[day[1]]}`}>
                            <p className={dollarSignLabor} aria-hidden="true">$</p>
                            <p className={laborTotalA} aria-hidden="true">{labor[day[1]].slice(0,1)}<span className={laborTotalB}>{labor[day[1]].slice(1)}</span></p>
                          </div>
                          <p className={factorLabel} id={laborLabel} aria-hidden="true">labor</p>
                          <div className={dividerLine} aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="99" height="2" viewBox="0 0 99 2" fill="none">
                              <path d="M98 1.49999C98.2761 1.49999 98.5 1.27613 98.5 0.999991C98.5 0.723849 98.2761 0.499991 98 0.499991L98 1.49999ZM4.37114e-08 1.5L98 1.49999L98 0.499991L-4.37114e-08 0.5L4.37114e-08 1.5Z" fill="#484A49"/>
                            </svg>
                          </div>
                          <div className={factorContainer} aria-label={`Sales from ${handleLastYearDate(day[0])}: $${sales[day[1]]}`}>
                            <p className={dollarSignSales} aria-hidden="true">$</p>
                            <p className={salesTotalA} aria-hidden="true">{sales[day[1]].slice(0,1)}<span className={salesTotalB}>{sales[day[1]].slice(1)}</span></p>
                          </div>  
                          <div className={salesLabels} aria-hidden="true">
                            <p className={factorLabel} id={salesLabelA}>sales</p>
                            <p className={factorLabel} id={salesLabelB}>{handleLastYearDate(day[0])}</p>
                          </div>
                        </div>
                      </div>
                      <div className={customBarContainer}>
                        <div className={colorLayer} style={{ background: day.background, backgroundSize: 'cover' }}>
                          <div className={backgroundLayer} style={{ backgroundImage: `url("${thisWeek[index].percent >=85 ? index === dayInFocus ? wideHighAlert : highAlert : thisWeek[index].percent >= 65 ? index === dayInFocus ? wideMediumAlert : mediumAlert : index === dayInFocus ? wideLowAlert : lowAlert}")`, backgroundRepeat: 'no-repeat', backgroundPosition: '-2px -2px', backgroundSize: 'auto' }}>
                            
                            <div className={eventHolidayAlerts}>
                              { index === dayInFocus ?
                                <>
                                  <p className={rentalsOccupiedText} style={{ color: thisWeek[index].color}} aria-label={`Short term rental probability: AM ${thisWeek[index].percent}%, PM ${day.percent}%`}>STR</p>
                                  <div className={centerContainer} aria-hidden="true">
                                    <div className={percentContainerA} style={{ color: thisWeek[index].color}}>
                                      <p><span className={aMPM} style={{ color: thisWeek[index].color}}>AM </span>{thisWeek[index].percent}</p>
                                      <p className={percentSign} style={{ color: thisWeek[index].color}}>%</p>
                                    </div>
                                    <div className={percentContainerB} style={{ color: day.color}}>
                                      <p>{day.percent}</p>
                                      <p className={percentSign} style={{ color: day.color}}>%</p>
                                      <p><span className={aMPM} style={{ color: day.color}}>PM</span></p>
                                    </div>
                                  </div>
                                </>
                              :
                                <>
                                <div className={eventAlerts}>
                                  { day.addEvent[0] === true && (
                                    day.addEvent[1].map((event, i) => {
                                      return (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 7 7" fill="none">
                                          <circle cx="3.5" cy="3.50024" r="3.5" fill="#e74040"/>
                                        </svg>
                                      )
                                    })
                                  )}
                                </div>
                                </>
                              }
                              <div className={holidayAlert}>
                                <img className={day.addHoliday[0] === true ? `${holidayAlertImg}` : `${hideHolidayAlert}`} src={holidayIcon} alt='holiday alert icon' />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )} 
            </div>

            {(thisWeek && isMobile) && (
              <div className={mobileCardContainer}>
                {thisWeekUpdate.map((day, index) => 
                  <div key={index} className={dayCard} style={index === dayInFocus ? {border: '1px solid #F54949'} : null} onClick={() => onChangingDay(index)}>
                    <div className={dayCardContainer}>
                      <div className={dateContainer}>    
                        {/* <p className={dayDate}>
                          <span className={dayWeek}>{daysOfWeek[day[1]]}</span>
                          <br /> */}
                          <h3 className={dayDate} aria-label={`${fullDaysOfWeek[day[1]]}, ${formatDateString(day[0])}`}>
                          <span className={dayWeek} aria-hidden="true">{daysOfWeek[day[1]]}</span>
                          <br aria-hidden="true" />
                          {day[0].substring(5,6) === '0' ? day[0].substring(6,7) : day[0].substring(5,7)}/{day[0].substring(8,9) === '0' ? day[0].substring(9,10) : day[0].substring(8,10)}

                        </h3>
          
                        { weather && (
                          <div className={weatherContainer} aria-label="weather">
                            <div className={iconContainer}>                  
                              <img className={weatherIcon} src={`/img/icons/${weather[index+14]}.png`} alt={`${weather[index+21]}`} />
                              {/* <img className={weatherIcon} src={require(`./../img/icons/${forecast[index+14]}.png`)} alt='weather icon' /> */}
                            </div>
                            <p className={weatherDegree} aria-label={`HI temperature: ${weather[index+7]} degrees`}>{weather[index+7]}&ordm;</p>
                          </div> 
                        )}
                      </div>
                      <div className={notInFocusContainer}>
                        <div className={salesLaborContainer}>
                          <div className={dividerLine} aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="112" height="2" viewBox="0 0 99 2" fill="none">
                              <path d="M98 1.49999C98.2761 1.49999 98.5 1.27613 98.5 0.999991C98.5 0.723849 98.2761 0.499991 98 0.499991L98 1.49999ZM4.37114e-08 1.5L98 1.49999L98 0.499991L-4.37114e-08 0.5L4.37114e-08 1.5Z" fill="#484A49"/>
                            </svg>
                          </div>
                          <div className={factorContainer} aria-label={`Labor estimate: $${labor[day[1]]}`}>
                            <p className={dollarSignLabor} aria-hidden="true">$</p>
                            <p className={laborTotalA} aria-hidden="true">{labor[day[1]].slice(0,1)}<span className={laborTotalB}>{labor[day[1]].slice(1)}</span></p>
                          </div>
                          <p className={factorLabel} id={laborLabel} aria-hidden="true">labor</p>
                          <div className={dividerLine} aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" width="99" height="2" viewBox="0 0 99 2" fill="none">
                              <path d="M98 1.49999C98.2761 1.49999 98.5 1.27613 98.5 0.999991C98.5 0.723849 98.2761 0.499991 98 0.499991L98 1.49999ZM4.37114e-08 1.5L98 1.49999L98 0.499991L-4.37114e-08 0.5L4.37114e-08 1.5Z" fill="#484A49"/>
                            </svg>
                          </div>
                          <div className={factorContainer} aria-label={`Sales from ${handleLastYearDate(day[0])}: $${sales[day[1]]}`}>
                            <p className={dollarSignSales}>$</p>
                            <p className={salesTotalA}>{sales[day[1]].slice(0,1)}<span className={salesTotalB}>{sales[day[1]].slice(1)}</span></p>
                          </div>  
                          <div className={salesLabels} aria-hidden="true">
                            <p className={factorLabel} id={salesLabelA}>sales</p>
                            <p className={factorLabel} id={salesLabelB}>{handleLastYearDate(day[0])}</p>
                          </div>
                        </div>
                      </div>
                      <div className={customBarContainer}>
                        <div className={colorLayer} style={{ background: day.background, backgroundSize: 'cover' }}>
                          <div className={backgroundLayer} style={{ backgroundImage: `url(${thisWeek[index].percent >=85 ? highAlert : thisWeek[index].percent >= 65 ? mediumAlert : lowAlert})`, backgroundRepeat: 'no-repeat', backgroundPosition: '-2px -2px', backgroundSize: 'auto' }}>
                            
                            <div className={eventHolidayAlerts}>
                              <div className={eventAlerts}>
                                { day.addEvent[0] === true && (
                                  day.addEvent[1].map((event, i) => {
                                    return (
                                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 7 7" fill="none">
                                        <circle cx="3.5" cy="3.50024" r="3.5" fill="#e74040"/>
                                      </svg>
                                    )
                                  })
                                )}
                              </div>
                              <div className={holidayAlert}>
                                <img className={day.addHoliday[0] === true ? `${holidayAlertImg}` : `${hideHolidayAlert}`} src={holidayIcon} alt='holiday alert icon' />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className={endDiv}></div>
              </div>
            )}
            <div className={endDiv}></div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Week;