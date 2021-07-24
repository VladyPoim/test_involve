import { CREATE_INVOICE } from "./types"

const initialState = {
    invoiceCurrency: null,
    invoiceCurrencyId: null,
    invoiceAmount: null,
    withdrawCurrency: null,
    withdrawCurrencyId: null,
    withdrawAmount: null
}

export const invoiceReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_INVOICE:
            return action.payload
        default: return state
    }
}