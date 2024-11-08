import React from "react";
import useWeather from "./useWeather";
import styles from "./Week.module.css";
import holidayIcon from "/img/holidayAlert.svg";
import highAlert from "/img/highAlert.svg";
import mediumAlert from "/img/mediumAlert.svg";
import lowAlert from "/img/lowAlert.svg";
import wideHighAlert from "/img/wideHighAlert.svg";
import wideMediumAlert from "/img/wideMediumAlert.svg";
import wideLowAlert from "/img/wideLowAlert.svg";

const { weekWrapper, weekLabelContainer, weekLabel, weekdayCards, inFocusCard, dayCard, dayCardContainer, dateContainer, dayDate, dayDateFocusContainer, dayDateFocus, dayWeek, holidayTitle, weatherContainerFocus, weatherDegreeContainer, hiLoLabel, weatherDegreeFocus, weatherNudge, weatherContainer, iconContainer, weatherIcon, weatherDegree, inFocusContainer, notInFocusContainer, eventInFocus, eventInFocusHidden, eventsHeader, noEventsHeader, singleEventContainer, eventDescription, eventTitle, salesLaborContainer, dividerLine, factorContainer, dollarSignLabor, dollarSignSales, laborTotalA, laborTotalB, factorLabel, laborLabel, salesLabels, salesLabelA, salesLabelB, salesTotalA, salesTotalB, customBarContainer, backgroundLayer, colorLayer, rentalsOccupiedText, percentContainerA, percentContainerB, percentSign, eventHolidayAlerts, holidayAlert, holidayAlertImg, hideHolidayAlert } = styles;

function Week ({ thisWeek, dayInFocus, onChangingDay }) {
  const [forecast, weatherIsLoaded] = useWeather();
  const thisWeekUpdate = thisWeek.slice(1,8);
  const daysOfWeek = ['SU', 'M', 'TU', 'W', 'TH', 'F', 'SA'];
  const fullDaysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  return (
    <>
      <div className={weekWrapper}>
        <div className={weekLabelContainer}>
          <h3 className={weekLabel}>week-at-a-glance</h3>
        </div>
        <div className={weekdayCards}>
          {thisWeek && (
            thisWeekUpdate.map((day, index) => 
              <div key={index} className={index === dayInFocus ? inFocusCard : dayCard} onClick={() => onChangingDay(index)}>
                <div className={dayCardContainer}>
                  <div className={dateContainer}>    
                    { index === dayInFocus ?
                      <>
                        <div className={dayDateFocusContainer}>
                          <p className={dayDateFocus}>{fullDaysOfWeek[day[1]]}, {day[0].substring(5,7)}/{day[0].substring(8,9) === '0' ? day[0].substring(9,10) : day[0].substring(8,10)}</p>
                          { day[2][0].addHoliday[1].length > 0 && (
                            <>
                              <p className={holidayTitle}>{day[2][0].addHoliday[1][0].name}</p>
                            </>
                          )}
                        </div>
                      </>
                    :
                      <p className={dayDate}>
                        <span className={dayWeek}>{daysOfWeek[day[1]]}</span>
                        <br />
                        {day[0].substring(5,7)}/{day[0].substring(8,9) === '0' ? day[0].substring(9,10) : day[0].substring(8,10)}
                      </p>
                    }              
                    { weatherIsLoaded && (
                      index === dayInFocus ?
                        <div className={weatherContainerFocus}>
                          <img src={`/img/icons/${forecast[index+14]}.png`} alt="weatherIcon" />
                          {/* <img src={require(`./../img/icons/${forecast[index+14]}.png`)} alt="weatherIcon" /> */}
                          <div className={weatherDegreeContainer}>
                            <p className={hiLoLabel}>LO<span className={weatherDegreeFocus}>{forecast[index]}&ordm;</span></p>
                            <p className={hiLoLabel}>HI<span className={weatherDegreeFocus} id={weatherNudge}>{forecast[index+7]}&ordm;</span></p>
                          </div>
                        </div>
                      :
                        <div className={weatherContainer}>
                          <div className={iconContainer}>                  
                            <img className={weatherIcon} src={`/img/icons/${forecast[index+14]}.png`} alt='weather icon' />
                            {/* <img className={weatherIcon} src={require(`./../img/icons/${forecast[index+14]}.png`)} alt='weather icon' /> */}
                          </div>
                          <p className={weatherDegree}>{forecast[index+7]}&ordm;</p>
                        </div> 
                    )}
                  </div>
                  <div className={index === dayInFocus ? inFocusContainer : notInFocusContainer}>
                    <div className={index === dayInFocus ? eventInFocus : eventInFocusHidden}>
                      <h4 className={eventsHeader}><span className={day[2][0].addEvent[1].length > 0 ? noEventsHeader : null}>NO </span>LOCAL EVENTS</h4>
                      {day[2][0].addEvent[1].map((event, i) => 
                        <div key={i} className={singleEventContainer}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                            <circle cx="3.5" cy="3.50024" r="3.5" fill="#C50202"/>
                          </svg>
                          <div className={eventDescription}>
                            <p className={eventTitle}>{event.name}</p>
                            <blockquote>"{event.description}"</blockquote>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={salesLaborContainer}>
                      <div className={dividerLine}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="99" height="2" viewBox="0 0 99 2" fill="none">
                          <path d="M98 1.49999C98.2761 1.49999 98.5 1.27613 98.5 0.999991C98.5 0.723849 98.2761 0.499991 98 0.499991L98 1.49999ZM4.37114e-08 1.5L98 1.49999L98 0.499991L-4.37114e-08 0.5L4.37114e-08 1.5Z" fill="#484A49"/>
                        </svg>
                      </div>
                      <div className={factorContainer}>
                        <p className={dollarSignLabor}>$</p>
                        <p className={laborTotalA}>1<span className={laborTotalB}>,275</span></p>
                      </div>
                      <p className={factorLabel} id={laborLabel}>labor</p>
                      <div className={dividerLine}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="99" height="2" viewBox="0 0 99 2" fill="none">
                          <path d="M98 1.49999C98.2761 1.49999 98.5 1.27613 98.5 0.999991C98.5 0.723849 98.2761 0.499991 98 0.499991L98 1.49999ZM4.37114e-08 1.5L98 1.49999L98 0.499991L-4.37114e-08 0.5L4.37114e-08 1.5Z" fill="#484A49"/>
                        </svg>
                      </div>
                      <div className={factorContainer}>
                        <p className={dollarSignSales}>$</p>
                        <p className={salesTotalA}>9<span className={salesTotalB}>,326</span></p>
                      </div>  
                      <div className={salesLabels}>
                        <p className={factorLabel} id={salesLabelA}>sales</p>
                        <p className={factorLabel} id={salesLabelB}>10/10/23</p>
                      </div>
                    </div>
                  </div>
                  <div className={customBarContainer}>
                    <div className={colorLayer} style={{ background: day[2][0].background, backgroundSize: 'cover' }}>
                      <div className={backgroundLayer} style={{ backgroundImage: `url(${thisWeek[index][2][0].percent >=85 ? index === dayInFocus ? wideHighAlert : highAlert : thisWeek[index][2][0].percent >= 65 ? index === dayInFocus ? wideMediumAlert : mediumAlert : index === dayInFocus ? wideLowAlert : lowAlert})`, backgroundRepeat: 'no-repeat', backgroundPosition: '-2px -2px', backgroundSize: 'auto' }}>
                        
                        <div className={eventHolidayAlerts}>
                          { index === dayInFocus ?
                            <>
                              <p className={rentalsOccupiedText} style={{ color: thisWeek[index][2][0].color}}>rentals occupied</p>
                              <div className={percentContainerA} style={{ color: thisWeek[index][2][0].color}}>
                                <p>{thisWeek[index][2][0].percent}</p>
                                <p className={percentSign}>%</p>
                              </div>
                              <div className={percentContainerB} style={{ color: day[2][0].color}}>
                                <p>{day[2][0].percent}</p>
                                <p className={percentSign}>%</p>
                              </div>
                            </>
                          :
                            day[2][0].addEvent[0] === true && (
                              day[2][0].addEvent[1].map((event, i) => {
                                return (
                                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                    <circle cx="3.5" cy="3.50024" r="3.5" fill="#C50202"/>
                                  </svg>
                                )
                              })
                            )
                          }
                          <div className={holidayAlert}>
                            <img className={day[2][0].addHoliday[0] === true ? `${holidayAlertImg}` : `${hideHolidayAlert}`} src={holidayIcon} alt='holiday alert icon' />
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
      </div>
    </>
  );
}

export default Week;