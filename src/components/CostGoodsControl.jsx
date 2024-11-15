import React, { useEffect, useReducer, useRef } from "react";
import AddNewInvoice from "./AddNewInvoice.jsx";
import AddNewItems from "./AddNewItems";
import GoodsList from './GoodsList.jsx';
import InvoiceList from './InvoiceList.jsx';
import InvoiceDetail from "./InvoiceDetail.jsx";
import UpdateInvoiceForm from "./UpdateInvoiceForm.jsx";
import { getFormVisible, getCreateInvoice, getInvoices, 
         getAddItemsInvoice, getCompleteInvoice, getDataFailure,
         getManageInvoice, getSelectedInvoice, 
         getEditInvoice, getGoods, getReset, getUpdatedItems } from "../actions/index.jsx";
import styles from "./CostGoodsControl.module.css";
import styles2 from "./GoodsList.module.css";
import goodsControlReducer from "../reducers/goods-control-reducer.jsx";
import db from '../firebase.jsx';
import { collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const {goodsControlWrapper, loading} = styles2;
const {barWrapper, nameWrapper, containerWrapper, nav5, nav6, goodsListWrapper} = styles2;
const { costGoodsWrapper, costLabelContainer, costLabel } = styles;

const initialState = {
  formVisible: false,
  itemsFormVisible: false,
  addItemsAgain: false,
  invoiceData: [],
  goodsData: [],
  goodsLoaded: false,
  createInvoice: [],
  selectedInvoice: [],
  manageInvoiceVisible: false,
  invoiceDetailVisible: false,
  editFormVisible: false,
  // goodsList: true,
  error: null
};

function CostGoodsControl () {
  const [state, dispatch] = useReducer(goodsControlReducer, initialState);
  const currentItems = useRef(state.createInvoice);
  const currentGoods = useRef(state.goodsData);
  const internalRef = useRef(null);

  const loadInvoices = () => {
    const unSubscribe = onSnapshot(
      collection(db, "invoices"),
      (collectionSnapshot) => {
        const invoices = [];
        collectionSnapshot.forEach((doc) => {
          invoices.push({
            purveyor: doc.data().purveyor,
            invoiceNumber: doc.data().invoiceNumber,
            date: doc.data().date,
            numberItems: doc.data().numberItems,
            total: doc.data().total,
            id: doc.id
          });
        });
        const action = getInvoices(invoices);
        dispatch(action);
      },
      (error) => {
        const action = getDataFailure(error.message);
        dispatch(action);
      }
    );

    return () => unSubscribe();
  };

  const loadItems = () => {
    const unSubscribe = onSnapshot(
      collection(db, "items"),
      (collectionSnapshot) => {
        const goods = [];
        collectionSnapshot.forEach((doc) => {
          goods.push({
            itemCode: doc.data().itemCode,
            description: doc.data().description.toUpperCase(),
            quantity: doc.data().quantity,
            unitPrice: doc.data().unitPrice,
            extendedAmount: doc.data().extendedAmount, 
            invoiceNumber: doc.data().invoiceNumber,
            date: doc.data().date,
            id: doc.id
          });
        });
        const action = getGoods(goods);
        dispatch(action);
      },
      (error) => {
        const action = getDataFailure(error.message);
        dispatch(action);
      }
    );

    return () => unSubscribe();
  };

  useEffect(() => { 
    loadInvoices();
    loadItems();
  }, []);

  const handleManageInvoicesClick = () => {
    dispatch(getManageInvoice());
  };

  const handleAddInvoicesClick = () => {
    dispatch(getFormVisible());
  };

  const handleSendingData = async () => {
    const infoIndex = currentItems.current.length-1;
    await addDoc(collection(db, "invoices"), currentItems.current[infoIndex]);
    await currentItems.current.slice(0, infoIndex).map(item => 
      addDoc(collection(db, "items"), item)
    );
    clearInterval(internalRef.current);
    internalRef.current = null;
    const action = getReset();
    dispatch(action);
  }

  const handleCompleteAddingItems = (finalValues) => {
    const action = getCompleteInvoice(finalValues);
    dispatch(action);

    internalRef.current = setInterval(() => {
      handleSendingData();
    }, 1000);
  }

  const handleAddingInvoiceInfo = (newInfo) => {
    const action = getCreateInvoice(newInfo);
    dispatch(action);
  }

  const handleAddingMoreItems = (newItemsData) => {
    const action = getAddItemsInvoice(newItemsData);
    dispatch(action);
  }

  const handleSelectedInvoice = (id) => {
    const action = getSelectedInvoice(id);
    dispatch(action);
  } 

  const handleDeleteClick = async () => {
    await deleteDoc(doc(db, "invoices", createInvoice[0].id));
    await createInvoice.slice(1).map(entry => 
      deleteDoc(doc(db, "items", entry.id))
    );
    dispatch(getReset());
  }

  const handleUpdatingInvoice = async (updatedInvoice) => {
    const invoiceRef = doc(db, "invoices", updatedInvoice[0].id);
    await updateDoc(invoiceRef, updatedInvoice[0]);
    await updatedInvoice.slice(1).forEach(item => {
      const itemsRef = doc(db, "items", item.id);
      updateDoc(itemsRef, item);
    });
    dispatch(getManageInvoice());
  }

  const handleDeletingItem = async (itemId, updatedItems) => {
    await deleteDoc(doc(db, "items", itemId));
    currentItems.current = updatedItems;
    dispatch(getUpdatedItems(updatedItems));
  }

  const { formVisible, itemsFormVisible, invoiceData, goodsData, goodsLoaded, createInvoice, invoiceDetailVisible, manageInvoiceVisible, editFormVisible, error } = state;
  currentItems.current = createInvoice;
  currentGoods.current = goodsData;

  return (
    <>
      <div className={costGoodsWrapper}>
        <div className={costLabelContainer}>
          <h3 className={costLabel}>cost of goods</h3>
        </div>
        { 
        error ?
          <p>Theres was an error: {error}</p>
        : formVisible ? 
          <AddNewInvoice 
            onNewInvoiceCreation={handleAddingInvoiceInfo}
            onReset={() => dispatch(getReset())} />
        : itemsFormVisible ?
          <AddNewItems
            onAddItemsCreation={handleAddingMoreItems}
            onCompleteAddingItems={handleCompleteAddingItems}
            currentInvoice={currentItems}
            onReset={() => dispatch(getReset())} />
        : manageInvoiceVisible ?
          <InvoiceList 
            onInvoiceSelection={handleSelectedInvoice}
            invoices={invoiceData}
            onReset={() => dispatch(getReset())}
            onManageInvoices={() => dispatch(getManageInvoice())} /> 
        : invoiceDetailVisible ?
          <InvoiceDetail 
            invoice={currentItems.current} 
            onClickingDelete = {handleDeleteClick}
            onClickingEdit = {() => dispatch(getEditInvoice())}
            onReset={() => dispatch(getReset())} />
        : editFormVisible ?
          // <div className="update-wrapper">
            <UpdateInvoiceForm
              invoice={currentItems.current}
              onEditFormCreation={handleUpdatingInvoice} 
              onDeleteItem={handleDeletingItem} 
              onClickingDelete = {handleDeleteClick}
              onReset={() => dispatch(getReset())}/>
          // </div> 
        : goodsLoaded ?
          <GoodsList
            goods={currentGoods.current} 
            onManageInvoicesClick={handleManageInvoicesClick}
            onAddInvoiceClick={handleAddInvoicesClick} />
        :
          <>
            <div className={goodsListWrapper}>
              <p className={loading}>...Loading</p>
            </div>
          </>
        }   
      </div>
    </>
  );
  // return (
  //   <>
  //     <div className={costGoodsWrapper}>
  //       <div className={costLabelContainer}>
  //         <h3 className={costLabel}>cost of goods</h3>
  //       </div>
  //         <svg className={greenArrow} xmlns="http://www.w3.org/2000/svg" width="20" height="13" viewBox="0 0 27 13" fill="none">
  //           <g filter="url(#filter0_i_1052_1324)">
  //             <path d="M27 1.18021e-06L0 0L13.5 13L27 1.18021e-06Z" fill="#66FF97"/>
  //           </g>
  //           <defs>
  //             <filter id="filter0_i_1052_1324" x="-6" y="-6" width="33" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
  //               <feFlood flood-opacity="0" result="BackgroundImageFix"/>
  //               <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
  //               <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
  //               <feOffset dx="-6" dy="-6"/>
  //               <feGaussianBlur stdDeviation="4"/>
  //               <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
  //               <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.42 0"/>
  //               <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1052_1324"/>
  //             </filter>
  //           </defs>
  //         </svg>
  //         <svg className={redArrow} xmlns="http://www.w3.org/2000/svg" width="20" height="13" viewBox="0 0 27 13" fill="none">
  //           <g filter="url(#filter0_i_1052_1327)">
  //             <path d="M-1.07288e-06 13L27 13L13.5 -1.17426e-06L-1.07288e-06 13Z" fill="#F54949"/>
  //           </g>
  //           <defs>
  //             <filter id="filter0_i_1052_1327" x="-6" y="-6" width="33" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
  //               <feFlood flood-opacity="0" result="BackgroundImageFix"/>
  //               <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
  //               <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
  //               <feOffset dx="-6" dy="-6"/>
  //               <feGaussianBlur stdDeviation="4"/>
  //               <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
  //               <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.14 0"/>
  //               <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1052_1327"/>
  //             </filter>
  //           </defs>
  //         </svg>
  //         <div className={decreaseContainer}>
  //           <div className={goodsCard}>
  //             <div className={decreasePercent}>
  //               <p>- 5</p>
  //               <p id={percentSign}>%</p>
  //             </div>
  //             <div className={decreaseCostContainer}>
  //               <div className={decreaseCost}>
  //                 <p id={dollarSign}>$</p>
  //                 <p>89</p>
  //                 <p id={cents}>95</p>
  //               </div>
  //             </div>
  //             <div className={decreaseItem}>
  //               <p>potato sweet jumbo 40#</p>
  //             </div>
  //               <div className={decreaseImg} style={{ backgroundImage: `url("/img/sweetPotatoes.png")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
  //             </div>
  //           </div>
  //         </div>
  //         <div className={increaseContainer}>

  //         </div>
  //         <div className={costFooter}>
  //           <div className={footerLeft}></div>
  //           <p className={costGoodsSubhead}>cost per item flucuation (%)</p>
  //           <div className={invoiceMgmntContainer}>
  //             <button className={nav5} onClick={() => dispatch(getManageInvoice())}>MANAGE INVOICES</button>
  //             <button className={nav6} onClick={() => dispatch(getFormVisible())}>ADD INVOICE</button>
  //           </div>
  //         </div>
  //     </div>
  //   </>
  // );
}

export default CostGoodsControl;
