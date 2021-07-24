import { CREATE_INVOICE } from "./types";

export function createInvoice(invoice) {
    console.log(invoice)
    return {
        type: CREATE_INVOICE,
        payload: invoice
    }
}