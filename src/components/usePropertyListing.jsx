import { useState, useRef } from 'react';
import db from '../firebase.jsx';
import { collection, addDoc, onSnapshot } from 'firebase/firestore'; 

const usePropertyListing = () => {

  const [error, setError] = useState(null);
  const [listingAvailability, setListingAvailability] = useState(null);
  const [runCall, setRunCall] = useState(true);

  const propertyList = useRef();
  const listingsLoaded = useRef(false);
  const listingsArr = useRef();
  const percentArr = useRef(null);
  const propLength = useRef();

  // Load listings from Firebase
  const loadListings = async () => {
    if (!listingsLoaded.current) {
      const unSubscribe = onSnapshot(
        collection(db, "listings"),
        (collectionSnapshot) => {
          const listings = [];
          collectionSnapshot.forEach((doc) => {
            listings.push({
              date: doc.data().date,
              availability: doc.data().datesPercent,
              month: doc.data().month,
              id: doc.id
            });
          });
          percentArr.current = listings;
          listingsLoaded.current = true;
          handleGetListingAvail();
        },
        (error) => setError(error)
      );
      return () => unSubscribe();
    }
  };

  // const apiCall = async (singleId, index) => {
  //   console.log("id index", singleId, index)
  //   console.log('prop length', propLength.current)

  //   try {
  //     const response = await fetch(`https://airbnb-listings.p.rapidapi.com/v2/listingAvailabilityFull?id=${singleId}&rapidapi-key=${process.env.REACT_APP_API_KEY}`);

  //     if (!response.ok) {
  //       throw new Error(`${response.status}: ${response.statusText}`);
  //     }
      
  //     const jsonifiedResponse = await response.json();
  //     if (jsonifiedResponse.error) {
  //       propLength.current = propLength.current - 1;
  //     } else {
  //       parseData(jsonifiedResponse.results);
  //     }

  //     if (index < (propertyList.current.length) - 1) {
  //       handleScheduledCall(index + 1);
  //     }
  //   } catch (err) {
  //     setError(err);
  //   }
  // };

  const apiCall = async (singleId, index) => {
    console.log("id index", singleId, index)
    console.log('prop length', propLength.current)

    try {
      const response = await fetch(`/.netlify/functions/getWeather?singleId=${singleId}`);
      
      const jsonifiedResponse = await response.json();
      if (jsonifiedResponse.statusCode === 500) {
        propLength.current = propLength.current - 1;
      } else {
        parseData(jsonifiedResponse.results);
      }

      if (index < (propertyList.current.length) - 1) {
        handleScheduledCall(index + 1);
      }
    } catch (err) {
      setError(err);
    }
  };

  // Check availability and schedule API call if needed
  const handleGetListingAvail = () => {
    if (percentArr.current.length === 0) {
      handleScheduledCall(0);
    } else {
      const today = new Date();
      const dataDate = percentArr.current[0].date;
      const oldData = new Date(parseInt(dataDate.substring(0, 4)), (parseInt(dataDate.substring(5, 7)) - 1), parseInt(dataDate.substring(8)));
      const daysPassed = (today.getTime() - oldData.getTime()) / (1000 * 60 * 60 * 24);
      if (daysPassed > 5) {
        handleScheduledCall(0);
      } else {
        setListingAvailability(percentArr.current);
      }
    }
  };


  const handleScheduledCall = (index) => {
    if (runCall && propertyList.current) {
      setRunCall(false);
      setTimeout(() => {
        apiCall(propertyList.current[index], index);
      }, 1000);
    }
  };

  // Parse data and update availability
  const parseData = (newListings) => {
    const reduced = newListings.map(item => ({
      "date": item.date,
      "available": [item.available]
    }));

    if (!listingsArr.current) {
      listingsArr.current = reduced;
    } else {
      const merged = listingsArr.current.map(item => {
        const newArr = reduced.find(i => i.date === item.date);
        return {
          "date": item.date,
          "available": [...item.available, ...(newArr ? newArr.available : [])]
        };
      });
      listingsArr.current = merged;
    }

    if (listingsArr.current[0].available.length === propLength.current) {
      const finalArr = listingsArr.current.map(item => {
        const totalSum = item.available.reduce((sum, value) => sum + value) / item.available.length;
        const sumAvailability = 100 - (100 * totalSum.toFixed(2));
        return {
          [item.date]: sumAvailability 
        };
      });

      const finalByMonth = groupByMonth(finalArr);
      finalByMonth.forEach(x => handleSendingAvail(x));
      console.log(finalByMonth);
      setRunCall(false);
      listingsLoaded.current = false;
    }
  };

  // Group by month for sending data
  const groupByMonth = (array) => {
    const grouped = array.reduce((acc, obj) => {
      const dateStr = Object.keys(obj)[0];
      const month = dateStr.substring(0, 7);
  
      if (!acc[month]) {
        acc[month] = [];
      }
  
      acc[month].push(obj);
  
      return acc;
    }, {});

    return Object.keys(grouped).map(month => ({
      date: new Date().toISOString().substring(0, 10),
      month: month,
      datesPercent: grouped[month]
    }));
  };

  
  const handleSendingAvail = async (percents) => {
    await addDoc(collection(db, "listings"), percents);
  };

  // Pass property list to load listings
  const handlePropList = (properties) => {
    if (properties) {
      propertyList.current = properties;
      propLength.current = properties.length;
      loadListings();
    }
  };

  return [listingAvailability, handlePropList, error];
}

export default usePropertyListing;
