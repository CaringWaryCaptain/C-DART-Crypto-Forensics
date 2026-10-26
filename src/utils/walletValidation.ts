/**
 * C-DART Multi-Chain Wallet Address Validator
 * Supports EVM (Ethereum/Polygon/BSC), TRON (TRC-20), Bitcoin, and Solana
 */

export interface WalletValidationResult {
  isValid: boolean;
  networkDetected: 'Ethereum' | 'Tron' | 'Bitcoin' | 'Solana' | 'Unknown';
  message: string;
  charCount: number;
  expectedLength: string | number;
  status: 'valid' | 'invalid' | 'warning' | 'idle';
  remainingChars?: number;
}

export function validateWalletAddress(address: string): WalletValidationResult {
  const trimmed = address.trim();

  if (!trimmed) {
    return {
      isValid: false,
      networkDetected: 'Unknown',
      message: 'Enter suspect wallet address (EVM, TRON, or Bitcoin)',
      charCount: 0,
      expectedLength: '42 / 34',
      status: 'idle',
    };
  }

  // 1. Ethereum / EVM (Starts with 0x)
  if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) {
    const isHex = /^0x[0-9a-fA-F]*$/i.test(trimmed);
    const length = trimmed.length;

    if (!isHex) {
      return {
        isValid: false,
        networkDetected: 'Ethereum',
        message: 'Invalid EVM Address: Contains non-hexadecimal characters',
        charCount: length,
        expectedLength: 42,
        status: 'invalid',
      };
    }

    if (length < 42) {
      return {
        isValid: false,
        networkDetected: 'Ethereum',
        message: `Incomplete EVM Address: ${length}/42 characters (${42 - length} more required)`,
        charCount: length,
        expectedLength: 42,
        status: 'warning',
        remainingChars: 42 - length,
      };
    }

    if (length > 42) {
      return {
        isValid: false,
        networkDetected: 'Ethereum',
        message: `Exceeds EVM Address Length: ${length}/42 characters (must be exactly 42 chars)`,
        charCount: length,
        expectedLength: 42,
        status: 'invalid',
      };
    }

    return {
      isValid: true,
      networkDetected: 'Ethereum',
      message: 'Valid EVM Address (Ethereum / Polygon / BSC · 42 characters)',
      charCount: 42,
      expectedLength: 42,
      status: 'valid',
    };
  }

  // 2. TRON (TRC-20) - Starts with T
  if (trimmed.startsWith('T')) {
    const isBase58 = /^[1-9A-HJ-NP-za-km-z]*$/.test(trimmed);
    const length = trimmed.length;

    if (!isBase58) {
      return {
        isValid: false,
        networkDetected: 'Tron',
        message: 'Invalid TRON Address: Contains invalid Base58 characters',
        charCount: length,
        expectedLength: 34,
        status: 'invalid',
      };
    }

    if (length < 34) {
      return {
        isValid: false,
        networkDetected: 'Tron',
        message: `Incomplete TRON Address: ${length}/34 characters (${34 - length} more required)`,
        charCount: length,
        expectedLength: 34,
        status: 'warning',
        remainingChars: 34 - length,
      };
    }

    if (length > 34) {
      return {
        isValid: false,
        networkDetected: 'Tron',
        message: `Exceeds TRON Address Length: ${length}/34 characters (must be exactly 34 chars)`,
        charCount: length,
        expectedLength: 34,
        status: 'invalid',
      };
    }

    return {
      isValid: true,
      networkDetected: 'Tron',
      message: 'Valid TRON TRC-20 Address (Mainnet · 34 characters)',
      charCount: 34,
      expectedLength: 34,
      status: 'valid',
    };
  }

  // 3. Bitcoin - Starts with 1, 3, or bc1
  if (trimmed.startsWith('1') || trimmed.startsWith('3') || trimmed.startsWith('bc1')) {
    const length = trimmed.length;

    if (length < 26) {
      return {
        isValid: false,
        networkDetected: 'Bitcoin',
        message: `Incomplete Bitcoin Address (${length} chars, minimum 26 required)`,
        charCount: length,
        expectedLength: '26-42',
        status: 'warning',
      };
    }

    if (length > 62) {
      return {
        isValid: false,
        networkDetected: 'Bitcoin',
        message: `Invalid Bitcoin Address: Exceeds maximum length (${length}/62 chars)`,
        charCount: length,
        expectedLength: '26-42',
        status: 'invalid',
      };
    }

    return {
      isValid: true,
      networkDetected: 'Bitcoin',
      message: `Valid Bitcoin Address (${trimmed.startsWith('bc1') ? 'Bech32 SegWit' : 'Legacy / P2SH'} · ${length} chars)`,
      charCount: length,
      expectedLength: '26-42',
      status: 'valid',
    };
  }

  // 4. Solana (Base58, 32-44 characters)
  if (/^[1-9A-HJ-NP-za-km-z]{32,44}$/.test(trimmed)) {
    return {
      isValid: true,
      networkDetected: 'Solana',
      message: `Valid Solana Address (${trimmed.length} characters)`,
      charCount: trimmed.length,
      expectedLength: '32-44',
      status: 'valid',
    };
  }

  // 5. Unknown / Invalid Prefix
  return {
    isValid: false,
    networkDetected: 'Unknown',
    message: `Unrecognized Address Format (${trimmed.length} chars). Must start with '0x' (EVM, 42 chars), 'T' (TRON, 34 chars), or '1/3/bc1' (BTC).`,
    charCount: trimmed.length,
    expectedLength: '42 / 34',
    status: 'invalid',
  };
}
