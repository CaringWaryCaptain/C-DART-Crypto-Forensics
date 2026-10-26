/**
 * C-DART Currency Utilities
 * Formats currency in dual display: Primary ₹ INR with secondary $ USD/USDT
 * Follows the Indian Numbering System (Lakhs & Crores) as required by LEAs
 */

export const USD_TO_INR_RATE = 84; // Standard 1 USDT = ₹84 INR

/**
 * Formats an amount into dual display:
 * Full: "₹15,47,280 ($18,420)"
 * Compact: "₹15.47 L ($18.4k)"
 */
export function formatDualCurrency(
  usdAmount: number,
  options?: { compact?: boolean; token?: string; hideToken?: boolean }
): string {
  const inrAmount = Math.round(usdAmount * USD_TO_INR_RATE);
  const token = options?.hideToken ? '' : ` ${options?.token || 'USDT'}`;

  if (options?.compact) {
    if (inrAmount >= 10000000) {
      const cr = (inrAmount / 10000000).toFixed(2);
      const usdStr = usdAmount >= 1000000 ? `$${(usdAmount / 1000000).toFixed(1)}M` : `$${(usdAmount / 1000).toFixed(0)}k`;
      return `₹${cr} Cr (${usdStr})`;
    }
    if (inrAmount >= 100000) {
      const lakh = (inrAmount / 100000).toFixed(2);
      const usdStr = usdAmount >= 1000 ? `$${(usdAmount / 1000).toFixed(1)}k` : `$${usdAmount}`;
      return `₹${lakh} L (${usdStr})`;
    }
  }

  const inrFormatted = inrAmount.toLocaleString('en-IN');
  const usdFormatted = usdAmount.toLocaleString('en-US');

  return `₹${inrFormatted} ($${usdFormatted}${token})`;
}

/**
 * Returns just the formatted INR value: "₹15,47,280"
 */
export function formatINR(usdAmount: number): string {
  const inr = Math.round(usdAmount * USD_TO_INR_RATE);
  return `₹${inr.toLocaleString('en-IN')}`;
}

/**
 * Returns formatted INR with Lakhs / Crores suffix: "₹15.47 Lakh" or "₹11.93 Crore"
 */
export function formatINRSuffix(usdAmount: number): string {
  const inr = Math.round(usdAmount * USD_TO_INR_RATE);
  if (inr >= 10000000) {
    return `₹${(inr / 10000000).toFixed(2)} Crore`;
  }
  if (inr >= 100000) {
    return `₹${(inr / 100000).toFixed(2)} Lakh`;
  }
  return `₹${inr.toLocaleString('en-IN')}`;
}
