// components/receipt/ReceiptItems.tsx

import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { formatNumber } from "@/lib/utils";

interface ReceiptItemsProps {
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  itemLeft: {
    flexDirection: "column",
    flex: 1,
  },
  itemName: {
    fontFamily: "Inter",
    fontSize: 8,
    fontWeight: 500,
    color: "#1A1A1A",
  },
  itemQty: {
    fontFamily: "Inter",
    fontSize: 7,
    fontWeight: 400,
    color: "#6B645C",
    marginTop: 1,
  },
  itemPrice: {
    fontFamily: "JetBrains Mono",
    fontSize: 8,
    fontWeight: 500,
    color: "#1A1A1A",
    textAlign: "right",
  },
});

export function ReceiptItems({ items }: ReceiptItemsProps) {
  return (
    <View style={styles.wrapper}>
      {items.map((item, i) => (
        <View key={item.id || i} style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQty}>x{item.quantity} @ Rp{formatNumber(item.price)}</Text>
          </View>
          <Text style={styles.itemPrice}>Rp{formatNumber(item.price * item.quantity)}</Text>
        </View>
      ))}
    </View>
  );
}
