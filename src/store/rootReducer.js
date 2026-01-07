import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from '../features/loginSlice'
import bannerReducer from '../features/bannersSlice';
import categoryReducer from '../features/categoriesSlice';
import productReducer from '../features/productsSlice';
import employeeReducer from '../features/employeesSlice';
import usersReducer from '../features/usersSlice';
import contactsReducer from  '../features/callUsSlice';
import socialsReducer from  '../features/SocialLinksSlice';
import settingsReducer from  '../features/settingsSlice';
import notificationsReducer from  '../features/NotificationSlice';
import installmentReducer from '../features/installemntsSlice';
import ordersReducer from '../features/ordersSlice';
import cartReducer from '../features/cartSlice';
import offersReducer from "../features/offersSlice";
import adminTransactions from '../features/transactionSlice'
import homeReducer from '../features/homeSlice'
import creditFormReducer from '../features/creditFormSlice'
import permissionsReducer from '../features/permissionsSlice'
import adminsTransactionsReducer from '../features/aminTransactionSlice';

export const rootReducers = combineReducers({
    login: loginReducer,
    banner : bannerReducer,
    categories: categoryReducer,
    products: productReducer,
    offers: offersReducer,
    employees :  employeeReducer,
    users:usersReducer,
    contacts: contactsReducer,
    socials: socialsReducer,
    settings : settingsReducer,
    notifications:notificationsReducer,
    installments: installmentReducer,
    orders : ordersReducer,
    cart : cartReducer,
    adminTransactions , 
    statistics : homeReducer,
    creditForm : creditFormReducer,
    permissions:  permissionsReducer,
    adminTransactions : adminsTransactionsReducer
})