import { useState, useRef, useEffect } from 'react';
import db from '../firebase.jsx';
import { collection, addDoc, doc, deleteDoc, getDocs } from 'firebase/firestore'; 

const usePropertyListing = () => {
  const newPercentsTallied = useRef(false);
  const errorCount = useRef(0);

  const [propertyList, setPropertyList] = useState(null);
  const [processedIndices, setProcessedIndices] = useState([]);

  const [listingsOccupied, setListingsOccupied] = useState(null);
  const [percentsError, setError] = useState(null);


  const handleSendingAvail = async (percents) => {
    console.log('handle sending', percents)
    await addDoc(collection(db, "listings"), percents);
  };

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

  const parseData = async (data) => {
    const mergedDataMap = new Map();
  
    data.forEach(id => {
      id.forEach(item => {
        const { date, available } = item;
        if (mergedDataMap.has(date)) {
          mergedDataMap.get(date).available.push(available);
        } else {
          mergedDataMap.set(date, { date, available: [available] });
        }
      });
    });

    const mergedArr = Array.from(mergedDataMap.values());

    const finalArr = mergedArr.map(item => {
      const totalSum = item.available.reduce((sum, value) => sum + value) / item.available.length;
      const sumAvailability = 100 - (100 * totalSum.toFixed(2));
      return {
        [item.date]: sumAvailability 
      };
    });

    const finalByMonth = groupByMonth(finalArr);
    await Promise.all(finalByMonth.map(item => handleSendingAvail(item)));
    console.log('final percents by month', finalByMonth);
    return finalByMonth;
  };

  const apiCall = async (singleId, index) => {
    const unprocessed = processedIndices.filter(id => id === singleId);
    console.log(unprocessed.length)
    if (unprocessed.length === 0) {
      try {
        const response = await fetch(`/.netlify/functions/getPropertyListings?singleId=${singleId}`);

        const text = await response.text();  // Check raw text if JSON fails
        console.log('Raw response:', text);

        const jsonifiedResponse = await response.json();
        console.log('json', singleId, index, jsonifiedResponse)
        if (jsonifiedResponse.error) {
          errorCount.current = errorCount.current + 1;
          return;
        } else {
          return jsonifiedResponse;
        }
      } catch (err) {
        return err;
      }
    } else {
      return;
    }
  };

  const handleSequentialCalls = async () => {
    if (!newPercentsTallied.current) {
      const results = [];
      const updatedIndices = [];
      const delay = 200;

      for (const [index, propertyId] of propertyList.entries()) {
        try {
          const data = await apiCall(propertyId, index);
          if (data) {
            results.push(data.results);
          }
          // console.log('index', index, 'proertyId', propertyId)
          updatedIndices.push(propertyId);
        } catch (err) {
          console.error(`Failed to fetch data for property ${propertyId}`, err);
          setError(err);
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      console.log('Finished processing all API calls. Error count =', errorCount.current);

      setProcessedIndices([...processedIndices, ...updatedIndices]);

      const parsed = await parseData(results);
      if (parsed) {
        const percents = await loadPercentsOnce();
        handleCheckingPercents(percents);
        newPercentsTallied.current = true;
      }
    }
  };

  const handleCheckingScheduledNewData = () => {
    const today = new Date();
    const todayNum = today.getDay();
    const todayStr = today.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
    const todayMonthYearStr = todayStr.substring(0,7);

    const index = listingsOccupied.findIndex(item => item.month === todayMonthYearStr);

    const dataDate = listingsOccupied[index].date;
    // const dataDate = listingsOccupied[0].date;
    const oldData = new Date(parseInt(dataDate.substring(0, 4)), (parseInt(dataDate.substring(5, 7)) - 1), parseInt(dataDate.substring(8)));
    const daysPassed = (today.getTime() - oldData.getTime()) / (1000 * 60 * 60 * 24);

    // if (dataDate !== todayStr && (daysPassed > 5 || todayNum === 1 || todayNum === 4)) {
    if (dataDate !== todayStr && (daysPassed > 5)) {
    // if (!daysPassed) {
      return true;    
    } else {
      return false;
    }
  };

  useEffect(() => {
    const processCalls = async () => {
      const proceedToCalls = handleCheckingScheduledNewData();
      // console.log('proceedToCalls', proceedToCalls)
      if (proceedToCalls) {
        await handleSequentialCalls();
      }
    }

    if (listingsOccupied && !newPercentsTallied.current) {
      processCalls();
    }
  }, [listingsOccupied]);

  const handleDeleteMonth = async (month) => {
    await deleteDoc(doc(db, "listings", month.id));
  };

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

  const handleCheckingExpiredMonths = async (percents) => {
    try {
      const { indicesToRemove } = processPercentData(percents);
      // console.log('indices to remove', indicesToRemove)
      if (indicesToRemove.length > 0) {
        await Promise.all(indicesToRemove.map(item => handleDeleteMonth(percents[item])));
      }
      return true;
    } catch (err) {
      console.error('Error in handleCheckingExpiredMonths:', err);
      setError(err);
      return false; 
    }
  };

  const handleCheckingPercents = async (percents) => {
    const proceed = await handleCheckingExpiredMonths(percents);
    if (proceed) {
      // console.log(proceed)
      setListingsOccupied(percents);
    } else {
      setError("please stand by ...");
    }
  };

  // const loadPercents = async () => {
  //   try {
  //     const unSubscribe = onSnapshot(
  //       collection(db, "listings"),
  //       async (collectionSnapshot) => {
  //         const percents = [];
  //         collectionSnapshot.forEach((doc) => {
  //           percents.push({
  //             date: doc.data().date,
  //             availability: doc.data().datesPercent,
  //             month: doc.data().month,
  //             id: doc.id
  //           });
  //         });
  //         handleCheckingPercents(percents);                
  //       },
  //       (error) => {
  //         setError(error);
  //       }
  //     );
  //     return () => unSubscribe();
  //   } catch (error) {
  //     setError(error);
  //   }
  // };

  const loadPercentsOnce = async () => {
    const snapshot = await getDocs(collection(db, "listings"));
    const percents = [];
    snapshot.forEach((doc) => {
      percents.push({
        date: doc.data().date,
        availability: doc.data().datesPercent,
        month: doc.data().month,
        id: doc.id
      });
    });

    return percents;
  };

  const handlePropList = async (properties) => {
    if (!properties || properties.length === 0) {
      // console.log("No properties to process.");
      return;
    }
    
    if (properties === propertyList) {
      // console.log("Properties unchanged; skipping processing.");
      return;
    }
    
    const processedSet = new Set(processedIndices);
    const unprocessedList = properties.filter((_, index) => !processedSet.has(index));
    
    if (unprocessedList.length === 0) {
      console.log("All indices processed, skipping API calls.");
      return;
    }
    
    // Update state only when properties actually change
    setPropertyList(properties);
    loadPercentsOnce().then((percents) => handleCheckingPercents(percents));
  };

  return [listingsOccupied, handlePropList, percentsError];
}

export default usePropertyListing;
