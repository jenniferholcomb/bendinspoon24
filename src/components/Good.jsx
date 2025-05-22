import React, { useEffect, useState } from "react"
import styles from "./Good.module.css";
import PropTypes from 'prop-types';

const {
        goodsCardDecrease, decreasePercent, percentSign, costContainer, 
        cost, dollarSign, cents, date, item, decreaseImg,
        goodsCardIncrease, increasePercent, increaseImg, srOnly
      } = styles;

function Good({ foodItem, decItem, incItem }) {

  const dividerLine = <svg xmlns="http://www.w3.org/2000/svg" width="2" height="37" viewBox="0 0 2 47" fill="none" aria-hidden="true">
                        <path d="M0.500002 46C0.500002 46.2761 0.72386 46.5 1 46.5C1.27614 46.5 1.5 46.2761 1.5 46L0.500002 46ZM0.5 2.18557e-08L0.500002 46L1.5 46L1.5 -2.18557e-08L0.5 2.18557e-08Z" fill="#363937"/>
                      </svg> ;

  return (
    <> 
      { incItem && (
        <>
          <li className={goodsCardIncrease} aria-label={incItem.name}>
            <div className={increaseImg} style={{ backgroundImage: `url("/img/goods/${incItem.itemCode}.png")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }} aria-hidden="true"></div>
            <div className={item} aria-hidden="true">
              <p>{incItem.name}</p>
            </div>
            {dividerLine}
            <div className={costContainer} aria-hidden="true">
              <div className={cost} aria-hidden="true">
                <p id={dollarSign}>$</p>
                <p>{incItem.priceDollars}</p>
                <p id={cents}>{incItem.priceCents === 0 ? '00' : incItem.priceCents}</p>
              </div>
              {/* <div className={date}>
                <p>{incItem.date}</p>
              </div> */}
            </div>
            <span className={srOnly}>
              {`$${incItem.priceDollars}.${incItem.priceCents === 0 ? '00' : incItem.priceCents} per unit. Increased by ${incItem.percentIncrease}%.`}
            </span>
            {dividerLine}
            {/* <div></div> */}
            <div className={increasePercent} aria-hidden="true">
              <p><span>+ </span>{incItem.percentIncrease}</p>
              <p id={percentSign}>%</p>
            </div>
          </li>
        </>
      )}
      { (decItem || foodItem) && (
        <>
          <li className={goodsCardDecrease} aria-label={foodItem ? foodItem.name : decItem.name}>
            { foodItem && (
              foodItem.percentDecrease ?
                <div className={decreasePercent}>
                  <p aria-hidden="true">- {foodItem.percentDecrease}</p>
                  <p id={percentSign} aria-hidden="true">%</p>
                </div>
              :
                <div className={increasePercent} >
                  <p aria-hidden="true"><span>+ </span>{foodItem.percentIncrease}</p>
                  <p id={percentSign} aria-hidden="true">%</p>
                </div>
            )}
            { decItem && (
              <div className={decreasePercent}>
                <p aria-hidden="true">- {decItem.percentDecrease}</p>
                <p id={percentSign} aria-hidden="true">%</p>
              </div>
            )}

            {dividerLine}
            <div className={costContainer} aria-hidden="true">
              <div className={cost} aria-hidden="true">
                <p id={dollarSign}>$</p>
                <p>{foodItem ? foodItem.priceDollars : decItem.priceDollars}</p>
                <p id={cents}>{foodItem ? (foodItem.priceCents === 0 ? '00' : foodItem.priceCents) : (decItem.priceCents === 0 ? '00' : decItem.priceCents)}</p>
              </div>
              {/* <div className={date}>
                <p>{foodItem ? foodItem.date : decItem.date}</p>
              </div> */}
            </div>
            <span className={srOnly}>
              {`$${foodItem ? foodItem.priceDollars : decItem.priceDollars}.${foodItem ? (foodItem.priceCents === 0 ? '00' : foodItem.priceCents) : (decItem.priceCents === 0 ? '00' : decItem.priceCents)} per unit. ${foodItem ? foodItem.percentDecrease ? 'Decreased' : 'Increased' : 'Decreased'} by ${foodItem ? foodItem.percentDecrease ? foodItem.percentDecrease : foodItem.percentIncrease : decItem.percentDecrease}%.`}
            </span>
            {dividerLine}
            <div className={item} aria-hidden="true">
              <p>{foodItem ? foodItem.name : decItem.name}</p>
            </div>
            <div className={decreaseImg} style={{ backgroundImage: `url("/img/goods/${foodItem ? foodItem.itemCode : decItem.itemCode}.png")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }} aria-hidden="true">
            </div>
          </li>
        </>
      )}
    </>
  );
}

Good.propTypes = {
  foodItem: PropTypes.object,
  incItem: PropTypes.object,
  decItem: PropTypes.object
};

export default Good;
