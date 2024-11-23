import { useState } from "react";
import Goods from "./Goods";
// import styles from "./CostGoods.module.css";

const { costGoodsWrapper, costGoodsHeader, costLabelContainer, costLabel, greenArrow, redArrow, decreaseContainer, increaseContainer, goodsCard, decreasePercent, decreaseCost, decreaseCostContainer, percentSign, dollarSign, cents, decreaseItem, decreaseImg, costFooter, costGoodsSubhead } = styles;

function CostGoods () {
  return (
    <>
      <div className={costGoodsWrapper}>
        <div className={costGoodsHeader}>
          <div className={costLabelContainer}>
            <h3 className={costLabel}>cost of goods</h3>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
            <path d="M8.55 14.25H10.45V8.55H8.55V14.25ZM9.5 6.65C9.76917 6.65 9.99479 6.55896 10.1769 6.37687C10.359 6.19479 10.45 5.96917 10.45 5.7C10.45 5.43083 10.359 5.20521 10.1769 5.02312C9.99479 4.84104 9.76917 4.75 9.5 4.75C9.23083 4.75 9.00521 4.84104 8.82312 5.02312C8.64104 5.20521 8.55 5.43083 8.55 5.7C8.55 5.96917 8.64104 6.19479 8.82312 6.37687C9.00521 6.55896 9.23083 6.65 9.5 6.65ZM9.5 19C8.18583 19 6.95083 18.7506 5.795 18.2519C4.63917 17.7531 3.63375 17.0762 2.77875 16.2212C1.92375 15.3662 1.24687 14.3608 0.748125 13.205C0.249375 12.0492 0 10.8142 0 9.5C0 8.18583 0.249375 6.95083 0.748125 5.795C1.24687 4.63917 1.92375 3.63375 2.77875 2.77875C3.63375 1.92375 4.63917 1.24687 5.795 0.748125C6.95083 0.249375 8.18583 0 9.5 0C10.8142 0 12.0492 0.249375 13.205 0.748125C14.3608 1.24687 15.3662 1.92375 16.2212 2.77875C17.0762 3.63375 17.7531 4.63917 18.2519 5.795C18.7506 6.95083 19 8.18583 19 9.5C19 10.8142 18.7506 12.0492 18.2519 13.205C17.7531 14.3608 17.0762 15.3662 16.2212 16.2212C15.3662 17.0762 14.3608 17.7531 13.205 18.2519C12.0492 18.7506 10.8142 19 9.5 19ZM9.5 17.1C11.6217 17.1 13.4187 16.3637 14.8912 14.8912C16.3637 13.4187 17.1 11.6217 17.1 9.5C17.1 7.37833 16.3637 5.58125 14.8912 4.10875C13.4187 2.63625 11.6217 1.9 9.5 1.9C7.37833 1.9 5.58125 2.63625 4.10875 4.10875C2.63625 5.58125 1.9 7.37833 1.9 9.5C1.9 11.6217 2.63625 13.4187 4.10875 14.8912C5.58125 16.3637 7.37833 17.1 9.5 17.1Z" fill="#666B69"/>
          </svg>
        </div>
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
            <p className={costGoodsSubhead}>cost per item flucuation (%)</p>
          </div>
      </div>
    </>
  );
}

export default CostGoods;
