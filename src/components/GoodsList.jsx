import React, { useEffect, useState } from "react";
import Goods from "./Goods";
import PropTypes from 'prop-types';
import styles from "./GoodsList.module.css";
import styles2 from "./CostGoodsControl.module.css";
// import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const {barWrapper, nameWrapper, containerWrapper, goodsListWrapper, iconWrapper, downWrap, goodsIcon, iconText, upWrap, invListWrapper} = styles;
const { greenArrow, redArrow, decreaseContainer, increaseContainer, goodsCard, decreasePercent, decreaseCost, decreaseCostContainer, percentSign, dollarSign, cents, decreaseItem, decreaseImg, costFooter, costGoodsSubhead, footerLeft, invoiceMgmntContainer, nav5, nav6 } = styles2;

function GoodsList (props) {

  const [goodsListCode, setGoodsListCode] = useState(null);
  const [goodsLoaded, setGoodsLoaded] = useState(false);
  const { goods } = props;

  useEffect(() => {
    const allItemCode = goods.reduce((array, value) => array.concat(value.itemCode), []);
    const uniqueGoodsCode = [...new Set(allItemCode)];
    const goodsList = uniqueGoodsCode.map(item => {
      return goods.filter(value => value.itemCode === item);
    });
    setGoodsListCode(goodsList);
    setGoodsLoaded(true);
  }, [goods])

  return (
    <>
      <svg className={greenArrow} xmlns="http://www.w3.org/2000/svg" width="20" height="13" viewBox="0 0 27 13" fill="none">
        <g filter="url(#filter0_i_1052_1324)">
          <path d="M27 1.18021e-06L0 0L13.5 13L27 1.18021e-06Z" fill="#66FF97"/>
        </g>
        <defs>
          <filter id="filter0_i_1052_1324" x="-6" y="-6" width="33" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="-6" dy="-6"/>
            <feGaussianBlur stdDeviation="4"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.42 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1052_1324"/>
          </filter>
        </defs>
      </svg>
      <svg className={redArrow} xmlns="http://www.w3.org/2000/svg" width="20" height="13" viewBox="0 0 27 13" fill="none">
        <g filter="url(#filter0_i_1052_1327)">
          <path d="M-1.07288e-06 13L27 13L13.5 -1.17426e-06L-1.07288e-06 13Z" fill="#F54949"/>
        </g>
        <defs>
          <filter id="filter0_i_1052_1327" x="-6" y="-6" width="33" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="-6" dy="-6"/>
            <feGaussianBlur stdDeviation="4"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.14 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1052_1327"/>
          </filter>
        </defs>
      </svg>
      <div className={decreaseContainer}>
        <div className={goodsCard}>
          <div className={decreasePercent}>
            <p>- 5</p>
            <p id={percentSign}>%</p>
          </div>
          <div className={decreaseCostContainer}>
            <div className={decreaseCost}>
              <p id={dollarSign}>$</p>
              <p>89</p>
              <p id={cents}>95</p>
            </div>
          </div>
          <div className={decreaseItem}>
            <p>potato sweet jumbo 40#</p>
          </div>
            <div className={decreaseImg} style={{ backgroundImage: `url("/img/sweetPotatoes.png")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
          </div>
        </div>
      </div>
      <div className={increaseContainer}>
      </div>
      <div className={costFooter}>
        <div className={footerLeft}></div>
        <p className={costGoodsSubhead}>cost per item flucuation (%)</p>
        {/* <div className={invoiceMgmntContainer}>
          <button className={nav5} onClick={props.onManageInvoicesClick}>MANAGE INVOICES</button>
          <button className={nav6} onClick={props.onAddInvoiceClick}>ADD INVOICE</button>
        </div> */}
      </div>

        {/* { 
        goodsLoaded ?
        <div className={invListWrapper}>
          {goodsListCode.map((entry, index) => 
            <Goods
              itemCodeList={entry} 
              key={index} />
          )}
        </div>
        :
          <p><em>...Loading</em></p>
        } */}
      
    </>
  );
}

GoodsList.propTypes = {
  goods: PropTypes.array
};

export default GoodsList;