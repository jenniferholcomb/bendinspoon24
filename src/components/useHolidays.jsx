import { useEffect, useReducer } from 'react';
import agentsReducer from '../reducers/agents-reducer';
import { getFetchFailure, getHolidaySuccess, getHolidaysLoaded } from '../actions';

import db from './../firebase.jsx';
import { collection, addDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

const initialState = {
  isLoaded: false,
  newHolidaysLoaded: false,
  holidayCall: [],
  holidayList: [],
  error: null,
  id: null
};

const useHolidays = () => {

  const [state, dispatch] = useReducer(agentsReducer, initialState)
  
  const loadHolidays = async () => {
    const unSubscribe = onSnapshot(
      collection(db, "holidays"),
      (collectionSnapshot) => {
        const holidays = [];
        collectionSnapshot.forEach((doc) => {
          holidays.push({
            holiday: doc.data().holiday,
            addDate: doc.data().addDate,
            id: doc.id
          });
        });
        handleHolidayData(holidays);
      },
      (error) => {
        dispatch(error);
      }
    );  
    return () => unSubscribe();
  }

  const handleHolidayData = (holidays) => {
    const action = getHolidaysLoaded(holidays);
    dispatch(action);

    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const listYear = holidays[0].addDate.slice(0,4);

    if (month === 0 && year !== listYear) {
      console.log("calling for holidays")
      makeAPICall();
    } 
  }

  // const makeAPICall = () => {
  //   const year = new Date().getFullYear();
  //   fetch('/.netlify/functions/getHolidays')
  //   // fetch(`https://calendarific.com/api/v2/holidays?&api_key=${process.env.REACT_APP_API_KEY_HOLIDAY}&country=US&year=${year}`)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(`${response.status}: ${response.statusText}`);
  //       } else {
  //         return response.json()
  //       }
  //     })
  //     .then((jsonifiedResponse) => {
  //       const action = getHolidaySuccess(jsonifiedResponse.response.holidays)
  //       dispatch(action)
  //     })
  //     .catch((error) => {
  //       const action = getFetchFailure(error.message)
  //       dispatch(action)
  //     });
  // }

  const makeAPICall = async () => {
    console.log('making weather call')
    fetch('/.netlify/functions/getHolidays')  
      .then(response => response.json()) 
      .then((jsonifiedResponse) => {
        if (jsonifiedResponse.statusCode === 200) {
          const data = jsonifiedResponse.response.holidays;  
          const action = getHolidaySuccess(data);  
          dispatch(action);
        } else {
          throw new Error(`Error: ${jsonifiedResponse.error || 'Unknown error'}`);
        }
      })
      .catch((error) => {
        const action = getFetchFailure(error.message);  // Dispatch failure action
        dispatch(action);
      });
  }

  const { error, newHolidaysLoaded, isLoaded, holidayList, id } = state;

  const handleAddingHolidays = async () => {
    const addHolidays = { 
      holiday: holidayList, 
      addDate: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })
    };
    await addDoc(collection(db, "holidays"), addHolidays);
    await loadHolidays();
  }

  const deleteHolidayData = async (id) => {
    await deleteDoc(doc(db, "holidays", id));
  }

  useEffect(() => {
    loadHolidays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(newHolidaysLoaded) {
      handleAddingHolidays();
      deleteHolidayData(id);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newHolidaysLoaded])

  
  return [holidayList, isLoaded, error];
}

export default useHolidays;