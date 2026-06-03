export type GoldSilverData = {
  goldUsdPerOz: number;
  silverUsdPerOz: number;
  updatedAt: string;
  source: string;
};

type GoldApiPriceResponse = {
  price?: number;
  timestamp?: number | string;
};

async function fetchMetalPrice(symbol: "XAU" | "XAG"): Promise<GoldApiPriceResponse> {
  const response = await fetch(`https://api.gold-api.com/price/${symbol}`);
  if (!response.ok) {
    throw new Error(`API request failed for ${symbol}: ${response.status}`);
  }

  const json = (await response.json()) as GoldApiPriceResponse;
  if (typeof json.price !== "number") {
    throw new Error(`Invalid price response for ${symbol}`);
  }

  return json;
}

function toIsoDate(timestamp: number | string | undefined): string {
  if (typeof timestamp === "number") {
    // Supports seconds or milliseconds.
    const millis = timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp;
    return new Date(millis).toISOString();
  }

  if (typeof timestamp === "string") {
    const parsed = Date.parse(timestamp);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toISOString();
    }
  }

  return new Date().toISOString();
}

export async function fetchGoldSilverPrices(): Promise<GoldSilverData> {
  const [gold, silver] = await Promise.all([
    fetchMetalPrice("XAU"),
    fetchMetalPrice("XAG"),
  ]);

  return {
    goldUsdPerOz: gold.price as number,
    silverUsdPerOz: silver.price as number,
    updatedAt: toIsoDate(gold.timestamp ?? silver.timestamp),
    source: "api.gold-api.com",
  };
}

