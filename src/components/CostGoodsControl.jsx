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
const { tabCostGoodsWrapper, costGoodsWrapper, hiddenCostGoodsWrapper, costGoodsHeader, costLabelContainer, costLabel, controlContainer, costGoodsSubhead } = styles;

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

function CostGoodsControl ({ selectedTab, isMobile }) {
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
      <div className={isMobile ? (selectedTab === 'costGoods' ? tabCostGoodsWrapper : hiddenCostGoodsWrapper) : costGoodsWrapper}>
        <div className={costGoodsHeader}>
          <div className={costLabelContainer}>
            <h3 className={costLabel}>cost of goods</h3>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
            <path d="M8.55 14.25H10.45V8.55H8.55V14.25ZM9.5 6.65C9.76917 6.65 9.99479 6.55896 10.1769 6.37687C10.359 6.19479 10.45 5.96917 10.45 5.7C10.45 5.43083 10.359 5.20521 10.1769 5.02312C9.99479 4.84104 9.76917 4.75 9.5 4.75C9.23083 4.75 9.00521 4.84104 8.82312 5.02312C8.64104 5.20521 8.55 5.43083 8.55 5.7C8.55 5.96917 8.64104 6.19479 8.82312 6.37687C9.00521 6.55896 9.23083 6.65 9.5 6.65ZM9.5 19C8.18583 19 6.95083 18.7506 5.795 18.2519C4.63917 17.7531 3.63375 17.0762 2.77875 16.2212C1.92375 15.3662 1.24687 14.3608 0.748125 13.205C0.249375 12.0492 0 10.8142 0 9.5C0 8.18583 0.249375 6.95083 0.748125 5.795C1.24687 4.63917 1.92375 3.63375 2.77875 2.77875C3.63375 1.92375 4.63917 1.24687 5.795 0.748125C6.95083 0.249375 8.18583 0 9.5 0C10.8142 0 12.0492 0.249375 13.205 0.748125C14.3608 1.24687 15.3662 1.92375 16.2212 2.77875C17.0762 3.63375 17.7531 4.63917 18.2519 5.795C18.7506 6.95083 19 8.18583 19 9.5C19 10.8142 18.7506 12.0492 18.2519 13.205C17.7531 14.3608 17.0762 15.3662 16.2212 16.2212C15.3662 17.0762 14.3608 17.7531 13.205 18.2519C12.0492 18.7506 10.8142 19 9.5 19ZM9.5 17.1C11.6217 17.1 13.4187 16.3637 14.8912 14.8912C16.3637 13.4187 17.1 11.6217 17.1 9.5C17.1 7.37833 16.3637 5.58125 14.8912 4.10875C13.4187 2.63625 11.6217 1.9 9.5 1.9C7.37833 1.9 5.58125 2.63625 4.10875 4.10875C2.63625 5.58125 1.9 7.37833 1.9 9.5C1.9 11.6217 2.63625 13.4187 4.10875 14.8912C5.58125 16.3637 7.37833 17.1 9.5 17.1Z" fill="#7B817B"/>
          </svg>
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
          <>
            <div className={controlContainer}>
              <GoodsList
                allGoods={currentGoods.current} 
                onManageInvoicesClick={handleManageInvoicesClick}
                onAddInvoiceClick={handleAddInvoicesClick} />
            </div>
            <div className={costGoodsSubhead}>
              <p>cost flucuation by item</p>
            </div>
          </>
        :
          null
        }   
      </div>
    </>
  );
}

export default CostGoodsControl;
