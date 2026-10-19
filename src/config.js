// Frani Invoice — configuration.
// Made by CRYPTFRANI. Owner / creator: Itachi. Unicity testnet2 only.

import process from 'node:process';

export const NETWORK = process.env.COUPON_NETWORK || 'testnet2';

export const config = {
  network: NETWORK,
  dataDir: process.env.COUPON_DATA_DIR || './wallet-data',
  walletApiBaseUrl:
    process.env.COUPON_WALLET_API || 'https://wallet-api.unicity.network',
  // Public testnet2 oracle key — not a secret.
  oracleApiKey:
    process.env.COUPON_ORACLE_KEY || 'sk_ddc3cfcc001e4a28ac3fad7407f99590',
  deviceId: process.env.COUPON_DEVICE_ID || 'frani-coupon-1',
  nametag: process.env.COUPON_NAMETAG || '',
  // Where invoices are stored as JSON.
  dataDir: process.env.COUPON_DIR || './coupons',
  // UCT uses 18 decimals on Unicity testnet2.
  decimals: Number(process.env.COUPON_DECIMALS || '18'),
};

export function assertTestnet2() {
  if (config.network !== 'testnet2' && !process.env.COUPON_ALLOW_NONTESTNET2) {
    throw new Error(
      `Frani Invoice is testnet2-only. Refusing to start on '${config.network}'. ` +
        `Set COUPON_ALLOW_NONTESTNET2=1 only if you truly mean it.`,
    );
  }
}
