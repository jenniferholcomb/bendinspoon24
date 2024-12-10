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
const { tabCostGoodsWrapper, costGoodsWrapper, hiddenCostGoodsWrapper, costGoodsHeader, costLabelContainer, costLabel } = styles;

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
            allGoods={currentGoods.current} 
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
}

export default CostGoodsControl;
