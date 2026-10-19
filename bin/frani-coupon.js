#!/usr/bin/env node
// Frani Coupon — CLI + daemon entrypoint.
// Made by CRYPTFRANI. Owner / creator: Itachi. Unicity testnet2 only.

import process from 'node:process';
import { config } from '../src/config.js';
import { Store } from '../src/store.js';
import { issueCoupon, redeem, renderCoupon } from '../src/coupon.js';

export const HELP = `Frani Coupon — signed one-time coupons on Unicity testnet2

Usage:
  frani-coupon issue --merchant <name> --discount <bps> [--max-uses <n>]
  frani-coupon redeem <couponId> --code <CODE> --by <address>
  frani-coupon list
  frani-coupon about
  frani-coupon help
`;

export const aboutText = `Frani Coupon — merchants issue signed discount coupons on Unicity testnet2.
Made by CRYPTFRANI. Owner / creator: Itachi.
`;

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq !== -1) out[a.slice(2, eq)] = a.slice(eq + 1);
      else if (argv[i + 1] && !argv[i + 1].startsWith('--')) out[a.slice(2)] = argv[++i];
      else out[a.slice(2)] = true;
    } else out._.push(a);
  }
  return out;
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  const store = new Store(config.dataDir);

  switch (cmd) {
    case 'issue': {
      const coupon = issueCoupon({
        merchant: args.merchant,
        discountBps: args.discount,
        maxUses: args['max-uses'] !== undefined ? Number(args['max-uses']) : 1,
      });
      await store.save(coupon);
      console.log(`Issued ${renderCoupon(coupon)}`);
      console.log(`Secret code: ${coupon.code}`);
      break;
    }
    case 'redeem': {
      const coupon = await store.get(rest[0]);
      redeem(coupon, args.code, args.by || 'anon');
      await store.save(coupon);
      console.log(`Redeemed ${coupon.id} by ${args.by || 'anon'} — ${renderCoupon(coupon)}`);
      break;
    }
    case 'list': {
      const coupons = await store.list();
      if (coupons.length === 0) console.log('No coupons yet.');
      for (const c of coupons) console.log(renderCoupon(c));
      break;
    }
    case 'about':
      console.log(aboutText);
      break;
    case 'help':
    case undefined:
      console.log(HELP);
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      console.log(HELP);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
