import { useState } from "react";
import styles from "./CostGoods.module.scss";

const { costGoodsWrapper, costLabelContainer, costLabel, popover, box } = styles;

function CostGoods () {
  return (
    <>
      <div className={costGoodsWrapper}>
        <div className={costLabelContainer}>
          <h3 className={costLabel}>cost of goods</h3>
        </div>
      </div>

    </>
  );
}

export default CostGoods;
