/**
 * Etherscan API service — fetches real Ethereum wallet transactions.
 * Free tier: 5 calls/sec, 100k calls/day.
 * Get a free API key at: https://etherscan.io/apis
 *
 * IMPORTANT: Replace ETHERSCAN_API_KEY below with your real key.
 * Without a key, requests are rate-limited to 1 call per 5 seconds.
 */

const ETHERSCAN_API_KEY = 'W87ZHCJ491S679ESSECN9J1C99WDHKYP8Q';
// V2 endpoint — no deprecation warnings, multi-chain support
const BASE_URL = 'https://api.etherscan.io/v2/api';
const CHAIN_ID = 1; // 1 = Ethereum mainnet

export interface EthTx {
  hash: string;
  from: string;
  to: string;
  value: string;        // in Wei
  timeStamp: string;
  blockNumber: string;
  gasUsed: string;
  isError: string;
  tokenSymbol?: string;
}

export interface WalletSummary {
  address: string;
  balanceEth: number;
  txCount: number;
  transactions: EthTx[];
  error?: string;
}

/** Convert Wei to ETH */
export const weiToEth = (wei: string): number =>
  parseFloat(wei) / 1e18;

/** Convert ETH to USD (approximate, uses fixed rate for prototype) */
export const ethToUsd = (eth: number): number =>
  Math.round(eth * 2480); // approx ETH/USD at time of prototype

/** Fetch all normal transactions for a wallet */
export async function fetchWalletTransactions(address: string): Promise<WalletSummary> {
  // Validate address format first
  if (!address.startsWith('0x') || address.length !== 42) {
    return {
      address,
      balanceEth: 0,
      txCount: 0,
      transactions: [],
      error: 'Invalid Ethereum address format. Must start with 0x and be 42 characters.',
    };
  }

  try {
    // Fetch balance
    const balanceRes = await fetch(
      `${BASE_URL}?chainid=${CHAIN_ID}&module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
    );
    const balanceData = await balanceRes.json();
    const balanceEth = balanceData.status === '1' ? weiToEth(balanceData.result) : 0;

    // Fetch transactions (last 100)
    const txRes = await fetch(
      `${BASE_URL}?chainid=${CHAIN_ID}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${ETHERSCAN_API_KEY}`
    );
    const txData = await txRes.json();

    if (txData.status === '0' && txData.message === 'NOTOK') {
      return {
        address,
        balanceEth,
        txCount: 0,
        transactions: [],
        error: txData.result === 'Max rate limit reached'
          ? 'API rate limit reached. Add your Etherscan API key in etherscanApi.ts'
          : txData.result,
      };
    }

    const transactions: EthTx[] = txData.status === '1' ? txData.result : [];

    return {
      address,
      balanceEth,
      txCount: transactions.length,
      transactions,
    };
  } catch (err) {
    return {
      address,
      balanceEth: 0,
      txCount: 0,
      transactions: [],
      error: 'Network error. Check your internet connection.',
    };
  }
}

/** Check if an address is a known exchange (simplified lookup) */
export const KNOWN_ADDRESSES: Record<string, string> = {
  '0xd551234ae421e3bcba99a0da6d736074f22192ff': 'Binance Hot Wallet',
  '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8': 'Binance Cold Wallet',
  '0x28c6c06298d514db089934071355e5743bf21d60': 'Binance 14',
  '0x21a31ee1afc51d94c2efccaa2092ad1028285549': 'Binance 15',
  '0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43': 'Coinbase Prime',
  '0x503828976d22510aad0201ac7ec88293211d23da': 'Coinbase 2',
};

export function identifyAddress(address: string): string | null {
  return KNOWN_ADDRESSES[address.toLowerCase()] || null;
}
