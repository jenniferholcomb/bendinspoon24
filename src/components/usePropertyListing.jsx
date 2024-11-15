import { useState, useRef, useEffect } from 'react';
import db from '../firebase.jsx';
import { collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore'; 

const usePropertyListing = () => {

  const propertyList = useRef();                                         // property list sent from tourism
  const propLength = useRef();                                           // length of property list

  const [percentsLoaded, setPercentsLoaded] = useState(null);           // set to true after percents loaded from firestore
  const newPercentsTallied = useRef(false);                             // set to true after api calls complete and new listings loaded

  const listingsArr = useRef();
  const percentArr = useRef(null);


  const [error, setError] = useState(null);
  const [listingsOccupied, setListingsOccupied] = useState(null);

  const processPercentData = (rentalData) => {
    const uniqueEntries = new Map();
    const indicesToRemove = [];

    rentalData.forEach((item, index) => {
      if (!uniqueEntries.has(item.month)) {
        uniqueEntries.set(item.month, { date: item.date, index });
      } else {
        const existingEntry = uniqueEntries.get(item.month);

        if (item.date > existingEntry.date) {
          indicesToRemove.push(existingEntry.index);
          uniqueEntries.set(item.month, { date: item.date, index });
        } else {
          indicesToRemove.push(index);
        }
      }
    });
    return { indicesToRemove };
  };

  const handleDeleteMonth = async (month) => {
    await deleteDoc(doc(db, "listings", month.id));
  };

  const handleCheckingExpiredMonths = async () => {
    const rentalData = percentArr.current;
    const { indicesToRemove } = processPercentData(rentalData);
  
    if (indicesToRemove.length > 0) {
      await Promise.all(indicesToRemove.map(item => handleDeleteMonth(rentalData[item])));
      return false; 
    }
    return true;
  };

  const handleCheckingScheduledNewData = () => {
    const today = new Date();
    const todayNum = today.getDay();
    const todayStr = today.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
    const todayMonthYearStr = todayStr.substring(0,7);

    const index = percentArr.current.findIndex(item => item.month === todayMonthYearStr);
    // const index = 0;
    const dataDate = percentArr.current[0].date;
    const oldData = new Date(parseInt(dataDate.substring(0, 4)), (parseInt(dataDate.substring(5, 7)) - 1), parseInt(dataDate.substring(8)));
    const daysPassed = (today.getTime() - oldData.getTime()) / (1000 * 60 * 60 * 24);

    // if (dataDate !== todayStr && (daysPassed > 5 || todayNum === 1 || todayNum === 4)) {
    if (dataDate !== todayStr && (daysPassed > 20)) {
      return true;    
    } else {
      return false;
    }
  };

  const apiCall = async (singleId, index) => {
    console.log("id index", singleId, index);
    console.log('prop length', propLength.current);
  
    try {
      const response = await fetch(`/.netlify/functions/getWeather?singleId=${singleId}`);

      const jsonifiedResponse = await response.json();
      if (!jsonifiedResponse.error) {
        propLength.current = propLength.current - 1;
        propertyList.current.splice(index, 1);                    // remove failed item from propertyList
      } else {
        parseData(jsonifiedResponse.results);
      }
    } catch (err) {
      setError(err);
    }
  };

  const handleSequentialCalls = async () => {
    if (!newPercentsTallied.current) {
      let index = 0; // Start at the first index
    
      while (index < propertyList.current.length) {
        console.log('Current index:', index);
        console.log('Current prop length:', propertyList.current.length);
    
        await new Promise((resolve) => {
          setTimeout(async () => {
            await apiCall(propertyList.current[index], index);
            resolve(); // Proceed to the next iteration after apiCall completes
          }, 105);
        });
    
        if (index < propertyList.current.length - 1) { 
          index++; 
        } else {
          break; 
        }
      }
      console.log('Finished processing all API calls');
      finalizeData();
    }
  };

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
    console.log('listinsArr length', listingsArr.current[0].available.length)
    console.log('prop length', propLength.current)
  };

  const finalizeData = async () => {
    const finalArr = listingsArr.current.map(item => {
      const totalSum = item.available.reduce((sum, value) => sum + value) / item.available.length;
      const sumAvailability = 100 - (100 * totalSum.toFixed(2));
      return {
        [item.date]: sumAvailability 
      };
    });

    const finalByMonth = groupByMonth(finalArr);
    await Promise.all(finalByMonth.map(item => handleSendingAvail(item)));
    console.log('final percents by month', finalByMonth);

    newPercentsTallied.current = true;                                        // calls completed, block app from making more calls
    setPercentsLoaded(false);                                                 // ready to load new percents
  }

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

  useEffect(() => {
    const loadPercents = async () => {
      try {
        const unSubscribe = onSnapshot(
          collection(db, "listings"),
          async (collectionSnapshot) => {
            const percents = [];
            collectionSnapshot.forEach((doc) => {
              percents.push({
                date: doc.data().date,
                availability: doc.data().datesPercent,
                month: doc.data().month,
                id: doc.id
              });
            });
            percentArr.current = percents;                               // percentArr variable holding data from firestore
            setPercentsLoaded(true);                                     // percents loaded = true
          },
          (error) => {
            setError(error);
          }
        );
        return () => unSubscribe();
      } catch (error) {
        setError(error);
      }
    };

    if (!percentsLoaded) {
      loadPercents();
    }

  }, [percentsLoaded]);

  useEffect(() => {
    if (percentsLoaded) {
      const proceed = handleCheckingExpiredMonths();
      if (proceed) {                                                  // no expired months, fine to proceed with originally loaded data
        const proceedToCalls = handleCheckingScheduledNewData();
        if (proceedToCalls) {                                         // calls are scheduled, start api calls
          handleSequentialCalls();
        }
        setListingsOccupied(percentArr.current);                   // // send just loaded percent data from firestore to tourism (send if calls scheduled or not)

      } else {                                                        // expired months, need to load percents from firestore again
        setPercentsLoaded(false);                                     // set percents loaded to false
      }
    }
  }, [percentsLoaded]);

  const handlePropList = (properties) => {
    if (properties) {
      propertyList.current = properties;
      propLength.current = properties.length;
      setPercentsLoaded(false);
    }
  };

  return [listingsOccupied, handlePropList, error];
}

export default usePropertyListing;


// import { useState, useRef } from 'react';
// import db from '../firebase.jsx';
// import { collection, addDoc, onSnapshot } from 'firebase/firestore'; 

// const usePropertyListing = () => {

//   const [error, setError] = useState(null);
//   const [listingAvailability, setListingAvailability] = useState(null);
//   const [runCall, setRunCall] = useState(true);

//   const propertyList = useRef();
//   const listingsLoaded = useRef(false);
//   const listingsArr = useRef();
//   const percentArr = useRef(null);
//   const propLength = useRef();

//   // Load listings from Firebase
//   const loadListings = async () => {
//     if (!listingsLoaded.current) {
//       const unSubscribe = onSnapshot(
//         collection(db, "listings"),
//         (collectionSnapshot) => {
//           const listings = [];
//           collectionSnapshot.forEach((doc) => {
//             listings.push({
//               date: doc.data().date,
//               availability: doc.data().datesPercent,
//               month: doc.data().month,
//               id: doc.id
//             });
//           });
//           percentArr.current = listings;
//           listingsLoaded.current = true;
//           handleGetListingAvail();
//         },
//         (error) => setError(error)
//       );
//       return () => unSubscribe();
//     }
//   };

//   // const apiCall = async (singleId, index) => {
//   //   console.log("id index", singleId, index)
//   //   console.log('prop length', propLength.current)

//   //   try {
//   //     const response = await fetch(`https://airbnb-listings.p.rapidapi.com/v2/listingAvailabilityFull?id=${singleId}&rapidapi-key=${process.env.REACT_APP_API_KEY}`);

//   //     if (!response.ok) {
//   //       throw new Error(`${response.status}: ${response.statusText}`);
//   //     }
      
//   //     const jsonifiedResponse = await response.json();
//   //     if (jsonifiedResponse.error) {
//   //       propLength.current = propLength.current - 1;
//   //     } else {
//   //       parseData(jsonifiedResponse.results);
//   //     }

//   //     if (index < (propertyList.current.length) - 1) {
//   //       handleScheduledCall(index + 1);
//   //     }
//   //   } catch (err) {
//   //     setError(err);
//   //   }
//   // };

//   const apiCall = async (singleId, index) => {
//     console.log("id index", singleId, index)
//     console.log('prop length', propLength.current)

//     try {
//       const response = await fetch(`/.netlify/functions/getWeather?singleId=${singleId}`);
      
//       const jsonifiedResponse = await response.json();
//       if (jsonifiedResponse.statusCode === 500) {
//         propLength.current = propLength.current - 1;
//       } else {
//         parseData(jsonifiedResponse.results);
//       }

//       if (index < (propertyList.current.length) - 1) {
//         handleScheduledCall(index + 1);
//       }
//     } catch (err) {
//       setError(err);
//     }
//   };

//   // Check availability and schedule API call if needed
//   const handleGetListingAvail = () => {
//     if (percentArr.current.length === 0) {
//       handleScheduledCall(0);
//     } else {
//       const today = new Date();
//       const dataDate = percentArr.current[0].date;
//       const oldData = new Date(parseInt(dataDate.substring(0, 4)), (parseInt(dataDate.substring(5, 7)) - 1), parseInt(dataDate.substring(8)));
//       const daysPassed = (today.getTime() - oldData.getTime()) / (1000 * 60 * 60 * 24);
//       if (daysPassed > 5) {
//         handleScheduledCall(0);
//       } else {
//         setListingAvailability(percentArr.current);
//       }
//     }
//   };


//   const handleScheduledCall = (index) => {
//     if (runCall && propertyList.current) {
//       setRunCall(false);
//       setTimeout(() => {
//         apiCall(propertyList.current[index], index);
//       }, 1000);
//     }
//   };

//   // Parse data and update availability
//   const parseData = (newListings) => {
//     const reduced = newListings.map(item => ({
//       "date": item.date,
//       "available": [item.available]
//     }));

//     if (!listingsArr.current) {
//       listingsArr.current = reduced;
//     } else {
//       const merged = listingsArr.current.map(item => {
//         const newArr = reduced.find(i => i.date === item.date);
//         return {
//           "date": item.date,
//           "available": [...item.available, ...(newArr ? newArr.available : [])]
//         };
//       });
//       listingsArr.current = merged;
//     }

//     if (listingsArr.current[0].available.length === propLength.current) {
//       const finalArr = listingsArr.current.map(item => {
//         const totalSum = item.available.reduce((sum, value) => sum + value) / item.available.length;
//         const sumAvailability = 100 - (100 * totalSum.toFixed(2));
//         return {
//           [item.date]: sumAvailability 
//         };
//       });

//       const finalByMonth = groupByMonth(finalArr);
//       finalByMonth.forEach(x => handleSendingAvail(x));
//       console.log(finalByMonth);
//       setRunCall(false);
//       listingsLoaded.current = false;
//     }
//   };

//   // Group by month for sending data
//   const groupByMonth = (array) => {
//     const grouped = array.reduce((acc, obj) => {
//       const dateStr = Object.keys(obj)[0];
//       const month = dateStr.substring(0, 7);
  
//       if (!acc[month]) {
//         acc[month] = [];
//       }
  
//       acc[month].push(obj);
  
//       return acc;
//     }, {});

//     return Object.keys(grouped).map(month => ({
//       date: new Date().toISOString().substring(0, 10),
//       month: month,
//       datesPercent: grouped[month]
//     }));
//   };

  
//   const handleSendingAvail = async (percents) => {
//     await addDoc(collection(db, "listings"), percents);
//   };

//   // Pass property list to load listings
//   const handlePropList = (properties) => {
//     if (properties) {
//       propertyList.current = properties;
//       propLength.current = properties.length;
//       loadListings();
//     }
//   };

//   return [listingAvailability, handlePropList, error];
// }

// export default usePropertyListing;
