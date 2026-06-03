import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/colors";
import { useFont } from "@/lib/fonts";

const GRAMS_PER_TROY_OUNCE = 31.1034768;
const GST_RATE = 0.03;
const PREMIUM_RATE = 0.015;
const PRICE_MULTIPLIER = (1 + GST_RATE) * (1 + PREMIUM_RATE);

type MetalApiResponse = {
  price?: number;
  timestamp?: number | string;
};

type ForexApiResponse = {
  result?: string;
  rates?: Record<string, number>;
  time_last_update_unix?: number;
};

type PriceModel = {
  usdInr: number;
  goldUsdPerOz: number;
  silverUsdPerOz: number;
  gold24kInrPerGram: number;
  gold24kInrPer10g: number;
  gold22kInrPerGram: number;
  gold22kInrPer10g: number;
  silverInrPerGram: number;
  silverInrPer10g: number;
  updatedAt: string;
  source: string;
};

type UiCopy = {
  title: string;
  subtitle: string;
  gold24kPerGram: string;
  gold24kPer10g: string;
  gold22kPerGram: string;
  gold22kPer10g: string;
  silverPerGram: string;
  silverPer10g: string;
  inrUnit: string;
  updated: string;
  refresh: string;
  loading: string;
  failed: string;
  disclaimer: string;
  fxRate: string;
};

const EN_COPY: UiCopy = {
  title: "Gold & Silver Prices",
  subtitle: "Estimated Indian bullion rates",
  gold24kPerGram: "24K Gold / 1g",
  gold24kPer10g: "24K Gold / 10g",
  gold22kPerGram: "22K Gold / 1g",
  gold22kPer10g: "22K Gold / 10g",
  silverPerGram: "Silver / 1g",
  silverPer10g: "Silver / 10g",
  inrUnit: "INR",
  updated: "Last updated",
  refresh: "Refresh",
  loading: "Fetching live prices...",
  failed: "Could not fetch prices.",
  disclaimer: "Estimated Indian bullion price including GST & premium. Local prices may vary.",
  fxRate: "USD/INR",
};

const TA_COPY: UiCopy = {
  title: "தங்கம் & வெள்ளி விலை",
  subtitle: "இந்திய மதிப்பீட்டு புலியன் விலை",
  gold24kPerGram: "24K தங்கம் / 1 கிராம்",
  gold24kPer10g: "24K தங்கம் / 10 கிராம்",
  gold22kPerGram: "22K தங்கம் / 1 கிராம்",
  gold22kPer10g: "22K தங்கம் / 10 கிராம்",
  silverPerGram: "வெள்ளி / 1 கிராம்",
  silverPer10g: "வெள்ளி / 10 கிராம்",
  inrUnit: "ரூபாய்",
  updated: "கடைசியாக புதுப்பித்த நேரம்",
  refresh: "புதுப்பிக்கவும்",
  loading: "நேரடி விலைகள் பெறப்படுகிறது...",
  failed: "விலைகளை பெற முடியவில்லை.",
  disclaimer: "GST மற்றும் பிரீமியம் சேர்த்த மதிப்பீட்டு இந்திய புலியன் விலை. உள்ளூர் விலை மாறலாம்.",
  fxRate: "USD/INR",
};

async function fetchMetalUsdPerOz(symbol: "XAU" | "XAG"): Promise<MetalApiResponse> {
  const response = await fetch(`https://api.gold-api.com/price/${symbol}`);
  if (!response.ok) {
    throw new Error(`Metal API failed for ${symbol}: ${response.status}`);
  }
  const json = (await response.json()) as MetalApiResponse;
  if (typeof json.price !== "number") {
    throw new Error(`Invalid metal price response for ${symbol}`);
  }
  return json;
}

async function fetchUsdInrRate(): Promise<{ rate: number; timestamp: number }> {
  const response = await fetch("https://open.er-api.com/v6/latest/USD");
  if (!response.ok) {
    throw new Error(`Forex API failed: ${response.status}`);
  }
  const json = (await response.json()) as ForexApiResponse;
  const inr = json.rates?.INR;
  if (json.result !== "success" || typeof inr !== "number") {
    throw new Error("Invalid forex response for USD/INR");
  }
  return {
    rate: inr,
    timestamp: json.time_last_update_unix ?? Math.floor(Date.now() / 1000),
  };
}

function toIso(value?: number | string): string {
  if (typeof value === "number") {
    const millis = value < 1_000_000_000_000 ? value * 1000 : value;
    return new Date(millis).toISOString();
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString();
  }
  return new Date().toISOString();
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function usdOzToEstimatedInrGram(usdPerOz: number, usdInr: number): number {
  return usdPerOz * usdInr / GRAMS_PER_TROY_OUNCE * PRICE_MULTIPLIER;
}

export default function GoldSilverScreen() {
  const { i18n } = useTranslation();
  const fonts = useFont();

  const [data, setData] = useState<PriceModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const copy = useMemo(
    () => (i18n.language?.startsWith("ta") ? TA_COPY : EN_COPY),
    [i18n.language],
  );

  const loadPrices = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [gold, silver, forex] = await Promise.all([
        fetchMetalUsdPerOz("XAU"),
        fetchMetalUsdPerOz("XAG"),
        fetchUsdInrRate(),
      ]);

      const gold24kInrPerGram = usdOzToEstimatedInrGram(gold.price as number, forex.rate);
      const gold22kInrPerGram = gold24kInrPerGram * (22 / 24);
      const silverInrPerGram = usdOzToEstimatedInrGram(silver.price as number, forex.rate);
      const updatedAt = toIso(gold.timestamp ?? forex.timestamp);

      setData({
        usdInr: forex.rate,
        goldUsdPerOz: gold.price as number,
        silverUsdPerOz: silver.price as number,
        gold24kInrPerGram: round2(gold24kInrPerGram),
        gold24kInrPer10g: round2(gold24kInrPerGram * 10),
        gold22kInrPerGram: round2(gold22kInrPerGram),
        gold22kInrPer10g: round2(gold22kInrPerGram * 10),
        silverInrPerGram: round2(silverInrPerGram),
        silverInrPer10g: round2(silverInrPerGram * 10),
        updatedAt,
        source: "api.gold-api.com + open.er-api.com",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : copy.failed);
    } finally {
      setIsLoading(false);
    }
  }, [copy.failed]);

  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  const formatInr = (value?: number) =>
    typeof value === "number"
      ? value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "--";

  const formattedUpdatedAt = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleString(i18n.language?.startsWith("ta") ? "ta-IN" : "en-IN")
    : "--";

  return (
    <>
      <Stack.Screen options={{ title: copy.title }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { fontFamily: fonts.bold }]}>{copy.title}</Text>
        <Text style={[styles.subtitle, { fontFamily: fonts.regular }]}>{copy.subtitle}</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.labelWrap}>
              <Ionicons name="diamond-outline" size={18} color={Colors.gold} />
              <Text style={[styles.label, { fontFamily: fonts.medium }]}>{copy.gold24kPerGram}</Text>
            </View>
            <Text style={[styles.value, { fontFamily: fonts.bold }]}>
              {copy.inrUnit} {formatInr(data?.gold24kInrPerGram)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelWrap}>
              <Ionicons name="diamond" size={18} color={Colors.gold} />
              <Text style={[styles.label, { fontFamily: fonts.medium }]}>{copy.gold24kPer10g}</Text>
            </View>
            <Text style={[styles.value, { fontFamily: fonts.bold }]}>
              {copy.inrUnit} {formatInr(data?.gold24kInrPer10g)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelWrap}>
              <Ionicons name="diamond-outline" size={18} color={Colors.warning} />
              <Text style={[styles.label, { fontFamily: fonts.medium }]}>{copy.gold22kPerGram}</Text>
            </View>
            <Text style={[styles.value, { fontFamily: fonts.bold }]}>
              {copy.inrUnit} {formatInr(data?.gold22kInrPerGram)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelWrap}>
              <Ionicons name="diamond" size={18} color={Colors.warning} />
              <Text style={[styles.label, { fontFamily: fonts.medium }]}>{copy.gold22kPer10g}</Text>
            </View>
            <Text style={[styles.value, { fontFamily: fonts.bold }]}>
              {copy.inrUnit} {formatInr(data?.gold22kInrPer10g)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelWrap}>
              <Ionicons name="ellipse-outline" size={18} color={Colors.info} />
              <Text style={[styles.label, { fontFamily: fonts.medium }]}>{copy.silverPerGram}</Text>
            </View>
            <Text style={[styles.value, { fontFamily: fonts.bold }]}>
              {copy.inrUnit} {formatInr(data?.silverInrPerGram)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.labelWrap}>
              <Ionicons name="ellipse" size={18} color={Colors.info} />
              <Text style={[styles.label, { fontFamily: fonts.medium }]}>{copy.silverPer10g}</Text>
            </View>
            <Text style={[styles.value, { fontFamily: fonts.bold }]}>
              {copy.inrUnit} {formatInr(data?.silverInrPer10g)}
            </Text>
          </View>

          <Text style={[styles.meta, { fontFamily: fonts.regular }]}>
            {copy.fxRate}: {formatInr(data?.usdInr)}
          </Text>
          <Text style={[styles.meta, { fontFamily: fonts.regular }]}>
            {copy.updated}: {formattedUpdatedAt}
          </Text>
          {data?.source ? (
            <Text style={[styles.source, { fontFamily: fonts.regular }]}>Source: {data.source}</Text>
          ) : null}
        </View>

        <View style={styles.noteCard}>
          <Text style={[styles.noteText, { fontFamily: fonts.regular }]}>{copy.disclaimer}</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={[styles.loadingText, { fontFamily: fonts.regular }]}>{copy.loading}</Text>
          </View>
        ) : null}

        {!isLoading && error ? (
          <View style={styles.errorCard}>
            <Text style={[styles.errorTitle, { fontFamily: fonts.semiBold }]}>{copy.failed}</Text>
            <Text style={[styles.errorText, { fontFamily: fonts.regular }]}>{error}</Text>
          </View>
        ) : null}

        <Pressable style={styles.refreshBtn} onPress={loadPrices} disabled={isLoading}>
          <Ionicons name="refresh" size={18} color="#fff" />
          <Text style={[styles.refreshText, { fontFamily: fonts.semiBold }]}>{copy.refresh}</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 6, marginBottom: 16 },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 16,
    padding: 16,
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  labelWrap: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  label: { fontSize: 15, color: Colors.text, flexShrink: 1 },
  value: { fontSize: 20, color: Colors.text, textAlign: "right" },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 14 },
  meta: { marginTop: 8, fontSize: 13, color: Colors.textSecondary },
  source: { marginTop: 4, fontSize: 12, color: Colors.textTertiary },
  noteCard: {
    marginTop: 14,
    backgroundColor: Colors.accentLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: 12,
  },
  noteText: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  loadingWrap: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 16 },
  loadingText: { color: Colors.textSecondary, fontSize: 13 },
  errorCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
  },
  errorTitle: { color: Colors.error, fontSize: 14 },
  errorText: { color: Colors.error, fontSize: 13, marginTop: 4 },
  refreshBtn: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  refreshText: { color: "#fff", fontSize: 16 },
});

