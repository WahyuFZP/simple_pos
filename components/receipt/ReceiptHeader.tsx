// components/receipt/ReceiptHeader.tsx

import { View, Text, StyleSheet } from "@react-pdf/renderer";

interface ReceiptHeaderProps {
  storeName: string;
  storeAddress?: string;
  orderId: string;
  cashierName: string;
  date: string;
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomStyle: "dashed",
    borderBottomColor: "#E2DCD3",
    paddingBottom: 10,
    marginBottom: 10,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    gap: 4,
  },
  logoIcon: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 16,
    fontWeight: 700,
    color: "#C73B2B",
  },
  storeName: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    fontWeight: 700,
    color: "#1A1A1A",
    textAlign: "center",
  },
  storeAddress: {
    fontFamily: "Inter",
    fontSize: 7,
    fontWeight: 400,
    color: "#6B645C",
    textAlign: "center",
    marginBottom: 4,
  },
  headerDivider: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomStyle: "dashed",
    borderBottomColor: "#E2DCD3",
  },
  metaSection: {
    paddingHorizontal: 2,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  metaLabel: {
    fontFamily: "Inter",
    fontSize: 7,
    fontWeight: 400,
    color: "#6B645C",
  },
  metaValue: {
    fontFamily: "JetBrains Mono",
    fontSize: 7,
    fontWeight: 400,
    color: "#1A1A1A",
  },
});

export function ReceiptHeader({ storeName, storeAddress, orderId, cashierName, date }: ReceiptHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.brandRow}>
        <Text style={styles.logoIcon}>🛍️</Text>
        <Text style={styles.storeName}>{storeName}</Text>
      </View>
      {storeAddress && <Text style={styles.storeAddress}>{storeAddress}</Text>}
      <View style={styles.headerDivider} />
      <View style={styles.metaSection}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Order</Text>
          <Text style={styles.metaValue}>{orderId}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Tanggal</Text>
          <Text style={styles.metaValue}>{date}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Kasir</Text>
          <Text style={styles.metaValue}>{cashierName}</Text>
        </View>
      </View>
    </View>
  );
}
