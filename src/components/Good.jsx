import React, { useEffect, useState } from "react"
import styles from "./Good.module.css";
import PropTypes from 'prop-types';

const {
        goodsCardDecrease, decreasePercent, percentSign, costContainer, 
        cost, dollarSign, cents, date, item, decreaseImg,
        goodsCardIncrease, increasePercent, increaseImg,
      } = styles;

function Good({ decItem, incItem }) {

  return (
    <> 
          { incItem && (
        <>
          <div className={goodsCardIncrease}>
            <div className={increaseImg} style={{ backgroundImage: `url("/img/goods/${incItem.itemCode}.png")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
            <div className={item}>
              <p>{incItem.name}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="37" viewBox="0 0 2 47" fill="none">
              <path d="M0.500002 46C0.500002 46.2761 0.72386 46.5 1 46.5C1.27614 46.5 1.5 46.2761 1.5 46L0.500002 46ZM0.5 2.18557e-08L0.500002 46L1.5 46L1.5 -2.18557e-08L0.5 2.18557e-08Z" fill="#363937"/>
            </svg>
            {/* <div></div> */}
            <div className={costContainer}>
              <div className={cost}>
                <p id={dollarSign}>$</p>
                <p>{incItem.priceDollars}</p>
                <p id={cents}>{incItem.priceCents === 0 ? '00' : incItem.priceCents}</p>
              </div>
              <div className={date}>
                <p>{incItem.date}</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="37" viewBox="0 0 2 47" fill="none">
              <path d="M0.500002 46C0.500002 46.2761 0.72386 46.5 1 46.5C1.27614 46.5 1.5 46.2761 1.5 46L0.500002 46ZM0.5 2.18557e-08L0.500002 46L1.5 46L1.5 -2.18557e-08L0.5 2.18557e-08Z" fill="#363937"/>
            </svg>
            {/* <div></div> */}
            <div className={increasePercent}>
              <p><span>+ </span>{incItem.percentIncrease}</p>
              <p id={percentSign}>%</p>
            </div>
          </div>
        </>
      )}
      { decItem && (
        <>
          <div className={goodsCardDecrease}>
            <div className={decreasePercent}>
              <p>- {decItem.percentDecrease}</p>
              <p id={percentSign}>%</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="37" viewBox="0 0 2 47" fill="none">
              <path d="M0.500002 46C0.500002 46.2761 0.72386 46.5 1 46.5C1.27614 46.5 1.5 46.2761 1.5 46L0.500002 46ZM0.5 2.18557e-08L0.500002 46L1.5 46L1.5 -2.18557e-08L0.5 2.18557e-08Z" fill="#363937"/>
            </svg>
            {/* <div></div> */}
            <div className={costContainer}>
              <div className={cost}>
                <p id={dollarSign}>$</p>
                <p>{decItem.priceDollars}</p>
                <p id={cents}>{decItem.priceCents === 0 ? '00' : decItem.priceCents}</p>
              </div>
              <div className={date}>
                <p>{decItem.date}</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="37" viewBox="0 0 2 47" fill="none">
              <path d="M0.500002 46C0.500002 46.2761 0.72386 46.5 1 46.5C1.27614 46.5 1.5 46.2761 1.5 46L0.500002 46ZM0.5 2.18557e-08L0.500002 46L1.5 46L1.5 -2.18557e-08L0.5 2.18557e-08Z" fill="#363937"/>
            </svg>
            {/* <div></div> */}
            <div className={item}>
              <p>{decItem.name}</p>
            </div>
              <div className={decreaseImg} style={{ backgroundImage: `url("/img/goods/${decItem.itemCode}.png")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            </div>
          </div>
        </>
      )}
    </>
  );
}

Good.propTypes = {
  item: PropTypes.object
};

export default Good;
