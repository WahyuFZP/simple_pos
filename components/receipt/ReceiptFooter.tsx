// components/receipt/ReceiptFooter.tsx

import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderTopStyle: "dashed",
    borderTopColor: "#E2DCD3",
    paddingTop: 12,
    alignItems: "center",
  },
  thanks: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 10,
    fontWeight: 600,
    color: "#1A1A1A",
    marginBottom: 4,
  },
  message: {
    fontFamily: "Inter",
    fontSize: 7,
    fontWeight: 400,
    color: "#6B645C",
    textAlign: "center",
    lineHeight: 1.4,
  },
});

export function ReceiptFooter() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.thanks}>Terima kasih!</Text>
      <Text style={styles.message}>
        Simpan struk ini sebagai{"\n"}bukti pembayaran.
      </Text>
    </View>
  );
}
