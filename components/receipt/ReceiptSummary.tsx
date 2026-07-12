// components/receipt/ReceiptSummary.tsx

import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { formatNumber } from "@/lib/utils";

interface ReceiptSummaryProps {
  total: number;
  paymentAmount: number;
  change: number;
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderTopStyle: "dashed",
    borderTopColor: "#E2DCD3",
    paddingTop: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontFamily: "Inter",
    fontSize: 8,
    fontWeight: 400,
    color: "#6B645C",
  },
  labelTotal: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 10,
    fontWeight: 600,
    color: "#1A1A1A",
  },
  value: {
    fontFamily: "JetBrains Mono",
    fontSize: 9,
    fontWeight: 500,
    color: "#1A1A1A",
  },
  valueTotal: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 12,
    fontWeight: 700,
    color: "#1A1A1A",
  },
  valueSuccess: {
    fontFamily: "JetBrains Mono",
    fontSize: 9,
    fontWeight: 500,
    color: "#2B7A4B",
  },
  spacer: {
    height: 4,
  },
});

export function ReceiptSummary({ total, paymentAmount, change }: ReceiptSummaryProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.value}>Rp{formatNumber(total)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Bayar</Text>
        <Text style={styles.value}>Rp{formatNumber(paymentAmount)}</Text>
      </View>
      <View style={styles.spacer} />
      <View style={styles.row}>
        <Text style={styles.labelTotal}>Kembali</Text>
        <Text style={styles.valueSuccess}>✅ Rp{formatNumber(change)}</Text>
      </View>
    </View>
  );
}
