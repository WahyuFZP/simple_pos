// components/receipt/ReceiptDocument.tsx
// Root PDF document — menggabungkan semua sub-komponen struk

import "./fonts";
import { Document, Page, View, StyleSheet } from "@react-pdf/renderer";
import { ReceiptHeader } from "./ReceiptHeader";
import { ReceiptItems } from "./ReceiptItems";
import { ReceiptSummary } from "./ReceiptSummary";
import { ReceiptFooter } from "./ReceiptFooter";
import type { ReceiptData } from "./useDownloadReceipt";

const styles = StyleSheet.create({
  page: {
    width: "80mm",
    paddingTop: 10,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
});

interface ReceiptDocumentProps {
  data: ReceiptData;
}

export function ReceiptDocument({ data }: ReceiptDocumentProps) {
  return (
    <Document>
      <Page size={{ width: "80mm", height: "auto" }} style={styles.page} wrap={false}>
        <View style={styles.content}>
          <ReceiptHeader
            storeName={data.storeName}
            storeAddress={data.storeAddress}
            orderId={data.orderId}
            cashierName={data.cashierName}
            date={data.date}
          />
          <ReceiptItems items={data.items} />
          <ReceiptSummary
            total={data.total}
            paymentAmount={data.paymentAmount}
            change={data.change}
          />
          <ReceiptFooter />
        </View>
      </Page>
    </Document>
  );
}
