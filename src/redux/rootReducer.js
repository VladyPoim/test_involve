import { combineReducers } from "redux";
import { invoiceReducer } from "./invoiceReducer";

export const rootReducer = combineReducers({
    invoice: invoiceReducer
})