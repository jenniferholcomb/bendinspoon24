import React, { useEffect, useReducer, useCallback } from 'react';
import agentsReducer from '../reducers/agents-reducer';
import { getFetchFailure, getWeatherLoaded, getWeatherSuccess } from '../actions';

import db from './../firebase.jsx';
import { collection, addDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

const initialState = {
  isLoaded: false,
  newWeatherLoaded: false,
  forecast: [],
  id: null,
  error: null
};

function useWeather () {

  const [state, dispatch] = useReducer(agentsReducer, initialState);
  const { newWeatherLoaded, forecast, id } = state;

  // const loadWeather = async (callback) => {
  //   const unSubscribe = onSnapshot( 
  //     collection(db, "weather"),
  //     (collectionSnapshot) => {
  //       const weatherForecast = [];
  //       collectionSnapshot.forEach((doc) => {
  //         weatherForecast.push({
  //           forecast: doc.data().forecast,
  //           date: doc.data().date,
  //           id: doc.id
  //         });
  //       });

  //       if (callback) callback(weatherForecast); // Pass the data to the callback
  //       handleWeatherData(weatherForecast);
  //     },
  //     (error) => {
  //       dispatch(getFetchFailure(error.message));
  //     }
  //   );
  //   return () => unSubscribe; // Return the unsubscribe function
  // };

  const loadWeather = useCallback((callback) => {
    return onSnapshot(
      collection(db, "weather"),
      (collectionSnapshot) => {
        const weatherForecast = [];
        collectionSnapshot.forEach((doc) => {
          weatherForecast.push({
            forecast: doc.data().forecast,
            date: doc.data().date,
            id: doc.id,
          });
        });
  
        if (callback) callback(weatherForecast[0].forecast); // Notify the caller with the data
        // dispatch(getWeatherLoaded(weatherForecast)); // Update state with Firestore data
        handleWeatherData(weatherForecast);
      },
      (error) => {
        dispatch(getFetchFailure(error.message)); // Handle Firestore errors
      }
    );
  }, []);
  

  const handleWeatherData = (weatherForecast) => {
    dispatch(getWeatherLoaded(weatherForecast));

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
    if (weatherForecast[0].date !== today) {
      console.log('making API weather call')
      makeAPICall();
    } 
  };

  const makeAPICall = async () => {
    // fetch('/.netlify/functions/getWeather', { cache: 'no-store' })  
    //   .then(response => response.json()) 
    //   .then((jsonifiedResponse) => {
    //     if (jsonifiedResponse.data) {
    //       const data = jsonifiedResponse.data;  
    //       const action = getWeatherSuccess(data);  
    //       dispatch(action);
    //     } else {
    //       throw new Error(`Error: ${jsonifiedResponse.error || 'Unknown error'}`);
    //     }
    //   })
    //   .catch((error) => {
    //     const action = getFetchFailure(error.message);  // Dispatch failure action
    //     dispatch(action);
    //   });

    try {
      const response = await fetch('/.netlify/functions/getWeather', { cache: 'no-store' });
      const jsonifiedResponse = await response.json();

      if (jsonifiedResponse.data) {
        const data = jsonifiedResponse.data;  
        dispatch(getWeatherSuccess(data)); // Dispatch action for success
      } else {
        throw new Error(`Error: ${jsonifiedResponse.error || 'Unknown error'}`);
      }
    } catch (error) {
      dispatch(getFetchFailure(error.message)); // Dispatch failure action
    }
  };


  const handleAddingWeather = async () => {
    const addForecast = { 
      forecast: forecast, 
      date: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })
    };
    await addDoc(collection(db, "weather"), addForecast);
  };

  const deleteWeatherData = async (id) => {
    await deleteDoc(doc(db, "weather", id));
  };

  useEffect(() => {
    if (newWeatherLoaded) {
      console.log('how many times new weather loaded')
      handleAddingWeather();
      if (id) deleteWeatherData(id);
    }
  }, [newWeatherLoaded, forecast, id]);


  // const loadWeather = async () => {
  //   const unSubscribe = onSnapshot(
  //     collection(db, "weather"),
  //     (collectionSnapshot) => {
  //       const weatherForecast = [];
  //       collectionSnapshot.forEach((doc) => {
  //         weatherForecast.push({
  //           forecast: doc.data().forecast,
  //           date: doc.data().date,
  //           id: doc.id
  //         });
  //       });
  //       handleWeatherData(weatherForecast);
  //       console.log(weatherForecast)
  //       return weatherForecast;
  //     },
  //     (error) => {
  //       dispatch(error);
  //     }
  //   );  
  //   return () => unSubscribe();
  // }
  

  return [loadWeather];
}

export default useWeather;
