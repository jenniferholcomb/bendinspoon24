import React, { useEffect, useState, useRef } from "react";
import Good from "./Good";
import PropTypes from 'prop-types';
import useResize from "./useResize";
import styles from "./GoodsList.module.css";
import styles2 from "./CostGoodsControl.module.css";

// const {barWrapper, nameWrapper, containerWrapper, goodsListWrapper, iconWrapper, downWrap, goodsIcon, iconText, upWrap, invListWrapper} = styles;
const { porArrowContainerInc, porArrowContainerDec, greenArrow, redArrow, goodsContainer, decreaseContainer, increaseContainer, shadowTop, shadowBottom, allGoodsContent, incGoodsContent, decGoodsContent, costFooter, costGoodsSubhead, footerLeft, invoiceMgmntContainer, nav5, nav6 } = styles2;

function GoodsList ({ allGoods }) {

  const [goodsListCode, setGoodsListCode] = useState(null);
  const [listOrderDec, setListOrderDec] = useState(false);
  const decreaseList = useRef([]);
  const [finalDecList, setFinalDecList] = useState();
  const increaseList = useRef([]);
  const [finalIncList, setFinalIncList] = useState([]);
  const [completeList, setCompleteList] = useState([]);
  const [orientation, isMobile, isTablet] = useResize();

  const redArrowSVG =       
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="13" viewBox="0 0 27 13" fill="none">
                        <g filter="url(#filter0_i_1052_1327)">
                          <path d="M-1.07288e-06 13L27 13L13.5 -1.17426e-06L-1.07288e-06 13Z" fill="#F54949"/>
                        </g>
                        <defs>
                          <filter id="filter0_i_1052_1327" x="-6" y="-6" width="33" height="19" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dx="-6" dy="-6"/>
                            <feGaussianBlur stdDeviation="4"/>
                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.14 0"/>
                            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1052_1327"/>
                          </filter>
                        </defs>
                      </svg> ;

  const greenArrowSVG = 
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="13" viewBox="0 0 27 13" fill="none">
                        <g filter="url(#filter0_i_1052_1324)">
                          <path d="M27 1.18021e-06L0 0L13.5 13L27 1.18021e-06Z" fill="#0ce6cd"/>
                        </g>
                        <defs>
                          <filter id="filter0_i_1052_1324" x="-6" y="-6" width="33" height="19" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dx="-6" dy="-6"/>
                            <feGaussianBlur stdDeviation="4"/>
                            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.42 0"/>
                            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1052_1324"/>
                          </filter>
                        </defs>
                      </svg> ;

  const handleSortingGood = (good) => {
    const sortedArray = good.sort((a,b) => {
      return new Date(a.date) - new Date(b.date);
    });
    const ascendingArray = sortedArray.reverse();
    
    if (ascendingArray.length >= 2) {
      if (ascendingArray[0].unitPrice < ascendingArray[1].unitPrice) {
        const percent = (1 - (ascendingArray[0].unitPrice / ascendingArray[1].unitPrice)).toFixed(2);
        const percentDecrease = parseFloat(percent);
        const list = [...decreaseList.current, 
                      {'name': good[0].description,
                       'date': good[0].date.substring(5,7) + '/' + good[0].date.substring(8),
                       'priceDollars': Math.floor(good[0].unitPrice), 
                       'priceCents': Math.round((good[0].unitPrice - Math.floor(good[0].unitPrice)) * 100),
                       'itemCode': good[0].itemCode, 
                       'percentDecrease': Math.floor(percentDecrease * 100),
                       'category': 'decrease'}];
        decreaseList.current = list;
      } else if (ascendingArray[0].unitPrice > ascendingArray[1].unitPrice) {
        const percent = ((ascendingArray[0].unitPrice / ascendingArray[1].unitPrice) - 1).toFixed(2);
        const percentIncrease = parseFloat(percent);
        const list = [...increaseList.current, 
                      {'name': good[0].description,
                       'date': good[0].date.substring(5,7) + '/' + good[0].date.substring(8),
                       'priceDollars': Math.floor(good[0].unitPrice), 
                       'priceCents': Math.round((good[0].unitPrice - Math.floor(good[0].unitPrice)) * 100),
                       'itemCode': good[0].itemCode, 
                       'percentIncrease': Math.floor(percentIncrease * 100),
                       'category': 'increase'}];
        increaseList.current = list;
      } 
    } 
  };

  const handleListOrder = () => {
    setListOrderDec(!listOrderDec);
    setCompleteList(completeList.reverse());
  };

  useEffect(() => {
    const allItemCode = allGoods.reduce((array, value) => array.concat(value.itemCode), []);
    const uniqueGoodsCode = [...new Set(allItemCode)];
    const goodsList = uniqueGoodsCode.map(item => {
      return allGoods.filter(value => value.itemCode === item);
    });
    setGoodsListCode(goodsList);
  }, [allGoods]);

  useEffect(() => {
    if (goodsListCode) {
      goodsListCode.map(item => handleSortingGood(item))
    }
    const finalDecList = decreaseList.current.sort((a,b) => a.percentDecrease - b.percentDecrease).reverse();
    setFinalDecList(finalDecList);
    decreaseList.current = [];

    const finalIncList = increaseList.current.sort((a,b) => a.percentIncrease - b.percentIncrease).reverse();
    setFinalIncList(finalIncList);
    increaseList.current = [];

    setCompleteList([...finalIncList, ...finalDecList.reverse()]);

  }, [goodsListCode]);

  return (
    <>
    { isTablet ?
      <>
        <div className={listOrderDec ? porArrowContainerDec : porArrowContainerInc} onClick={handleListOrder}>
          {listOrderDec ?
            <>
              {greenArrowSVG}
              {redArrowSVG}
            </>
          :
            <>
              {redArrowSVG}
              {greenArrowSVG}
            </>
          }
        </div>
        <div className={goodsContainer}>
          <div className={shadowTop}></div>
          <div className={allGoodsContent}>
            { completeList && (
              completeList.map((item, index) => 
                <Good
                  foodItem={item} 
                  key={index} />
              )
            )}
          </div>
          <div className={shadowBottom}></div>
        </div>
      </>
    :
      <>
        <div className={greenArrow}>{greenArrowSVG}</div>
        <div className={redArrow}>{redArrowSVG}</div>
        <div className={decreaseContainer}>
          <div className={shadowTop}></div>
          <div className={decGoodsContent}>
            { finalDecList && (
              finalDecList.map((item, index) => 
                <Good
                  decItem={item} 
                  key={index} />
              )
            )}
          </div>
          <div className={shadowBottom}></div>
        </div>
        <div className={increaseContainer}>
          <div className={shadowTop}></div>
          <div className={incGoodsContent}>
            { finalIncList && (
              finalIncList.map((item, index) => 
                <Good
                  incItem={item} 
                  key={index} />
              )
            )}
          </div>
          <div className={shadowBottom}></div>
        </div>
      </>
    }

      <div className={costFooter}>
        <div className={footerLeft}></div>
        {/* <div className={invoiceMgmntContainer}>
          <button className={nav5} onClick={props.onManageInvoicesClick}>MANAGE INVOICES</button>
          <button className={nav6} onClick={props.onAddInvoiceClick}>ADD INVOICE</button>
        </div> */}
      </div>
    </>
  );
}

GoodsList.propTypes = {
  goods: PropTypes.array
};

export default GoodsList;