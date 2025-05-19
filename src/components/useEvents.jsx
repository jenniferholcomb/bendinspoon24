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
      {'name': 'Of Montreal', 'date': ['2025-07-21'], 'description': 'Band performing at the Volcanic Theatre Pub, eclectic sound and theatrical performance.', 'month': ['07']},
      {'name': 'Scott Bradlees Postmodern Jukebox', 'date': ['2025-07-01'], 'description': 'Iconic pop hits with American Style at the Tower Theatre.', 'month': ['07']},    
      {'name': 'Speak Up Pink Duck 5k run/walk', 'date': ['2025-06-29'], 'description': 'Race to fundraise and bring awareness to local human trafficking.', 'month': ['06']},    
      {'name': 'Oregon Trail Gravel Grinder', 'date': ['2025-06-25', '2025-06-26', '2025-06-27', '2025-06-28', '2025-06-29'], 'description': 'Mountain biking through the heart of the Cascades.', 'month': ['07']},    
      {'name': 'Alpine Solstice', 'date': ['2025-06-21'], 'description': '55k + half marathon at Swampy Lakes Sno Park', 'month': ['06']},    
      {'name': 'Cascade Cycling Classic Criterium', 'date': ['2025-06-14'], 'description': 'Cycling Race through downtown Bend.', 'month': ['06']},    
      {'name': 'The Dollop', 'date': ['2025-06-08'], 'description': 'Podcast hosted by American comedians Dave Anthony and Gareth Reynolds. At Tower Theatre.', 'month': ['06']},    
      {'name': 'Traveling Wilburys Revue', 'date': ['2025-06-07'], 'description': 'Veteran musicians stage a night of Traveling Wilburys greatest hits. At Tower Theatre.', 'month': ['06']},    
      {'name': 'Skyview Falcon 5K/Mile Adventure Run', 'date': ['2025-05-25'], 'description': 'A fun-filled, family-friendly run/walk event at Skyview Middle School.', 'month': ['05']}, 
      {'name': 'Footzone Dirty Half', 'date': ['2025-05-31'], 'description': 'Half marathon on dirt and single track. Starts at Unitarian Church.', 'month': ['05']},  
      {'name': 'The Wailin Jennys', 'date': ['2025-05-27'], 'description': 'International folk-roots band performing at the Tower Theatre.', 'month': ['05']},   
      {'name': 'The War and Treaty', 'date': ['2025-05-22'], 'description': 'American Roots husband/wife duo perform at the Tower Theatre.', 'month': ['05']},   
      {'name': 'Neal Francis with Color Green', 'date': ['2025-05-15'], 'description': 'Delivering soulful, deeply funky tunes at Volcanic Theatre', 'month': ['05']},   
      {'name': 'The Wooten Brothers', 'date': ['2025-05-10'], 'description': 'R&B/Soul/Jazz at Volcanic Theatre', 'month': ['05']},   
      {'name': 'Central Oregon Youth Orchestra: Spring Concert', 'date': ['2025-05-07'], 'description': 'At the Tower Theatre.', 'month': ['05']},  
      {'name': 'Rett Madison & John-Robert', 'date': ['2025-05-04'], 'description': 'Music that mixes rock, pop, folk, Americana, indie and soul, at Volcanic Theatre.', 'month': ['05']},  
      {'name': 'Bryan Martin', 'date': ['2025-05-02'], 'description': 'Country music at Midtown Ballroom.', 'month': ['05']},  
      {'name': 'The Liverpool Legends, Beatles Tribute', 'date': ['2025-05-01'], 'description': 'Four lads, hand-picked by Louise Harrison, performing at Tower Theatre.', 'month': ['05']},   
      {'name': 'Robert Cray Band', 'date': ['2025-04-29'], 'description': 'American music, revitalising both blues and soul. At the Tower Theatre.', 'month': ['04']},   
      {'name': 'State Ballet Theatre of Ukraine: Sleeping Beauty', 'date': ['2025-04-27'], 'description': 'Experience the most famous love story of all time! At the Tower Theatre.', 'month': ['04']},  
      {'name': 'Portland Cello Project', 'date': ['2025-04-23'], 'description': 'Featuring the music of Beethoven, The Beatles & Billy Eilish. At the Tower Theatre.', 'month': ['04']},  
      {'name': 'James Taylor and His All-Star Band', 'date': ['2025-05-19'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['05']},   
      {'name': 'Sting 3.0 Tour', 'date': ['2025-05-25', '2025-05-26'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['05']},   
      {'name': 'Khruangbin - A La Sala Tour', 'date': ['2025-05-19'], 'description': 'At the Tower Theatre.', 'month': ['05']},   
      {'name': 'Brad Paisley: Truck Still Works World Tour', 'date': ['2025-05-29'], 'description': 'Country concert at Hayden Homes Amphitheater.', 'month': ['05']},   
      {'name': 'An Evening With Goose', 'date': ['2025-05-30'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['05']},   
      {'name': 'The Black Keys: No Rain, No Flowers', 'date': ['2025-05-31'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['05']},   
      {'name': 'Leon Bridges: The Leon Tour with LA LOM', 'date': ['2025-06-01'], 'description': 'R&B concert at Hayden Homes Amphitheater.', 'month': ['06']},   
      {'name': 'Mumford & Sons - 2025 Tour', 'date': ['2025-06-05', '2025-06-06'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['06']},   
      {'name': 'Yacht Rock Revue - Yacht Rock Forever Tour Presented by CANN', 'date': ['2025-06-07'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['06']},   
      {'name': 'Styx & Kevin Cronin + Don Felder The Brotherhood of Rock Tour', 'date': ['2025-06-14'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['06']},   
      {'name': 'Peter Frampton - Lets Do It Again!', 'date': ['2025-06-15'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['06']},   
      {'name': 'Jon Pardi: Honkytonk Hollywood Tour', 'date': ['2025-06-21'], 'description': 'Country concert at Hayden Homes Amphitheater.', 'month': ['06']},   
      {'name': 'Earth, Wind & Fire', 'date': ['2025-06-22'], 'description': 'R&B concert at Hayden Homes Amphitheater.', 'month': ['06']},   
      {'name': 'Barenaked Ladies: Last Summer On Earth Tour 2025', 'date': ['2025-06-28'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['06']},   
      {'name': 'Pink Martini', 'date': ['2025-06-29'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['06']},   
      {'name': 'Lake Street Dive', 'date': ['2025-07-02'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['07']},   
      {'name': 'Collective Soul & +LIVE+ - Summer Unity Tour', 'date': ['2025-07-09'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['07']},   
      {'name': 'Billy Currington & Kip Moore', 'date': ['2025-07-11'], 'description': 'Country concert at Hayden Homes Amphitheater.', 'month': ['07']},   
      {'name': 'Trevor Noah', 'date': ['2025-07-12'], 'description': 'Comedy at Hayden Homes Amphitheater.', 'month': ['07']},   
      {'name': 'Jerry Seinfeld', 'date': ['2025-07-18'], 'description': 'Comedy at Hayden Homes Amphitheater.', 'month': ['07']},   
      {'name': 'Dropkick Murphys and Bad Religion', 'date': ['2025-07-23'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['07']},   
      {'name': 'MAOLI LAST SIP OF SUMMER TOUR', 'date': ['2025-07-24'], 'description': 'Reggae concert at Hayden Homes Amphitheater.', 'month': ['07']},   
      {'name': 'The Red Clay Strays: Get Right Tour', 'date': ['2025-07-26'], 'description': 'Country concert at Hayden Homes Amphitheater.', 'month': ['07']},   
      {'name': 'Old Dominion: How Good Is That - World Tour', 'date': ['2025-07-30'], 'description': 'Country concert at Hayden Homes Amphitheater.', 'month': ['07']},   
      {'name': 'DISPATCH W/ JOHN BUTLER (WITH BAND) - SUMMER TOUR 2025', 'date': ['2025-07-31'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['07']},   
      {'name': 'Caamp', 'date': ['2025-08-02'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'Joe Bonamassa', 'date': ['2025-08-03'], 'description': 'Blues concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'MY MORNING JACKET "is" ON TOUR!', 'date': ['2025-08-05'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'Tedeschi Trucks Band & Whiskey Myers: Live in 25', 'date': ['2025-08-07', '2025-08-08'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'LCD Soundsystem', 'date': ['2025-08-09', '2025-08-10'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'Rainbow Kitten Surprise: Thanks For Coming Tour', 'date': ['2025-08-11'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'RÜFÜS DU SOL Inhale / Exhale World Tour 2025', 'date': ['2025-08-12'], 'description': 'Dance/electronic at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'The Lumineers: The Automatic World Tour', 'date': ['2025-08-13', '2025-08-14'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'Trampled By Turtles And Shakey Graves', 'date': ['2025-08-15'], 'description': 'Folk concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'Glass Animals: Tour Of Earth', 'date': ['2025-08-16'], 'description': 'POP concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'Alabama Shakes', 'date': ['2025-08-17'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'Counting Crows: The Complete Sweets! Tour with The Gaslight', 'date': ['2025-08-19'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'Lainey Wilson: Whirlwind World Tour', 'date': ['2025-08-21'], 'description': 'Country concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'Mt. Joy', 'date': ['2025-08-22'], 'description': 'Folk concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'Matt Rife: Stay Golden Tour', 'date': ['2025-08-23'], 'description': 'Comedy at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'GOO GOO DOLLS with DASHBOARD CONFESSIONAL - Summer Anthem', 'date': ['2025-08-29'], 'description': 'Comedy at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'Japanese Breakfast - The Melancholy Tour', 'date': ['2025-08-30'], 'description': 'POP concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'An Evening with Chicago', 'date': ['2025-08-31'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['08']},   
      {'name': 'Neil Young and the Chrome Hearts - Love Earth', 'date': ['2025-09-10'], 'description': 'Rock concert at Hayden Homes Amphitheater.', 'month': ['09']},   
      {'name': 'Warren Zeiders: Relapse, Lies, and Betrayal Tour', 'date': ['2025-09-18'], 'description': 'Country concert at Hayden Homes Amphitheater.', 'month': ['09']},   

    ]}
  ],
  error: null
}; 

const useEvents = () => {

  const [state, dispatch] = useReducer(agentsReducer, initialState);
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorChat, setErrorChat] = useState();

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


  // get content post from "Portfolio stretch goals" doc in Google Docs!!!

  // useEffect(() => {
  //   // get data from serverless function
  //   const fetchEvents = async () => {
  //     setLoading(true);
  //     setErrorChat(null);

  //     try {
  //       const response = await fetch('/.netlify/functions/getEvents', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
        
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }

  //       const data = await response.json();
  //       console.log(data.events)
  //       setEvents(data.events); 
  //     } catch (err) {
  //       setErrorChat('Failed to fetch events');
  //       console.error(err);
  //     }

  //     setLoading(false);
  //   };

  //   fetchEvents();
  // }, []);

  return [ eventsList, isLoaded, error ];
}

export default useEvents;

