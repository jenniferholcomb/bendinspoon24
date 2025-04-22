import { useEffect, useReducer, useState } from 'react';
import agentsReducer from '../reducers/agents-reducer';
import { getFetchFailure, getEventsSuccess, getEventsLoaded } from '../actions';

import db from './../firebase.jsx';
import { collection, addDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';

const initialState = {
  isLoaded: false,
  eventsList: [
    {'addDate': '2024-10-17'},
    {'events': [
      {'name': 'Bend Fall Festival', 'date': ['2024-11-02', '2024-11-03'], 'description': 'A festival celebrating the season with live music, art, food, and family-friendly activities.', 'month': ['11']},
      {'name': 'Holiday Lights Paddle Parade', 'date': ['2024-12-15'], 'description': 'A unique event where kayakers and paddleboarders decorate their vessels and float down the Deschutes River.', 'month': ['12']},
      {'name': 'Downtown Bend Artisans Market', 'date': ['2024-10-19'], 'description': 'An open-air market with local artisans selling handcrafted goods in the heart of Bend.', 'month': ['10']},
      {'name': 'Mt Bachelor Opening Day', 'date': ['2024-11-15'], 'description': 'The winter season kicks off with the anticipated opening of Mt. Bachelor for skiing and snowboarding', 'month': ['11']},
      {'name': 'Hippie Death Cult', 'date': ['2024-11-09'], 'description': 'Psychedelic doom rock band performing at the Volcanic Theatre Pub.', 'month': ['11']},
      {'name': 'Hot Buttered Rum', 'date': ['2024-11-10'], 'description': 'A bluegrass and Americana band performing at the Midtown Ballroom.', 'month': ['11']},
      {'name': 'Curtis Salgado', 'date': ['2024-11-15'], 'description': 'A  blues performance at the Midtown Ballroom.', 'month': ['11']},
      {'name': 'Terrapin Flyer', 'date': ['2024-11-17'], 'description': 'A popular Grateful Dead tribute band performing at the Volcanic Theatre Pub', 'month': ['11']},
      {'name': 'SANTA SLAYED: A La Bon Burlesque Murder Mystery', 'date': ['2024-12-28'], 'description': 'Interactive and immersive investigative experience.', 'month': ['12']},
      {'name': 'Sweeney Todd: The Demon Barber of Fleet Street', 'date': ['2024-12-29'], 'description': 'Musical showing at Greenhouse Cabaret; pie-shop owner Sweeney embarks on quest for vengeance.', 'month': ['12']},
      {'name': 'Disco Inferno Ball New Year’s Eve with Patrick Lamb', 'date': ['2024-12-31'], 'description': 'Riverhouse Lodge celebration includes 4-course dinner, spirits tasting, dancing and costume contest.', 'month': ['12']},
      // {'name': 'Sweeney Todd: The Demon Barber of Fleet Street', 'date': ['2024-12-29'], 'description': 'Musical where pie-shop owner Sweeney embarks on a quest for vengeance.', 'month': ['12']},
      // {'name': 'Sweeney Todd: The Demon Barber of Fleet Street', 'date': ['2024-12-29'], 'description': 'Musical where pie-shop owner Sweeney embarks on a quest for vengeance.', 'month': ['12']},    
    ]}
  ],
  error: null
}; 

const useEvents = () => {

  const [state, dispatch] = useReducer(agentsReducer, initialState);
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorChat, setErrorChat] = useState(null);

  const { error, isLoaded, eventsList, dbEventsList, id } = state;

  const loadEvents = async () => {
    const unSubscribe = onSnapshot(
      collection(db, "events"),
      (collectionSnapshot) => {
        const allEvents = [];
        collectionSnapshot.forEach((doc) => {
          allEvents.push({
            events: doc.data().events,
            addDate: doc.data().addDate,
            id: doc.id
          });
        });
        const action = getEventsLoaded(allEvents);
        dispatch(action);
      },
      (error) => {
        dispatch(error);
      }
    );  
    return () => unSubscribe();
  }

  const handleComparingEventLists = () => {
    const initialEvents = eventsList.filter(item => item.events);
    const updatedEvents = dbEventsList.filter(item => item.events);

    // Find added events in updatedList
    const addedEvents = updatedEvents.filter(event => 
      !initialEvents.some(initialEvent => initialEvent.name === event.name)
    );
  
    // Find removed events in updatedList
    const removedEvents = initialEvents.filter(event => 
      !updatedEvents.some(updatedEvent => updatedEvent.name === event.name)
    );

    // console.log(addedEvents)
    // console.log(removedEvents)

    if (addedEvents.length !== 0 || removedEvents.length !== 0) {
      console.log("adding new events")
      handleUpdatingEvents();
      deleteEventsData();
    }
  }

  const handleUpdatingEvents = async () => {
    const updateEvents = { 
      events: eventsList, 
      addDate: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })
    };
    await addDoc(collection(db, "events"), updateEvents);
    await loadEvents();
  }

  const deleteEventsData = async () => {
    await deleteDoc(doc(db, "events", id));
  }
  
  useEffect(() => {
    if(dbEventsList) {
      handleComparingEventLists();
    }
  }, [dbEventsList])

  useEffect(() => {
    loadEvents();
  }, [])
  
  // get data from serverless function
  const fetchEvents = async () => {
    setLoading(true);
    setErrorChat(null);

    try {
      const response = await fetch('/.netlify/functions/getEvents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data.events)
      setEvents(data.events); 
    } catch (err) {
      setErrorChat('Failed to fetch events');
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return [ eventsList, isLoaded, error ];
}

export default useEvents;

