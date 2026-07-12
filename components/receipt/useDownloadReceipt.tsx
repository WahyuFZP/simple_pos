// components/receipt/useDownloadReceipt.ts
// Hook: generate PDF blob dan trigger download

import { pdf } from "@react-pdf/renderer";
import { ReceiptDocument } from "./ReceiptDocument";

export interface ReceiptData {
  storeName: string;
  storeAddress?: string;
  orderId: string;
  cashierName: string;
  date: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentAmount: number;
  change: number;
}

export function useDownloadReceipt() {
  const downloadReceipt = async (data: ReceiptData) => {
    const blob = await pdf(<ReceiptDocument data={data} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `struk-${data.orderId.replace("#", "")}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return { downloadReceipt };
}
