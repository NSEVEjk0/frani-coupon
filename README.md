# Frani Coupon

Merchants issue signed, one-time discount coupons on Unicity testnet2. Each
coupon carries a secret code; redemption consumes a use and marks the coupon
spent when exhausted.

Made by **CRYPTFRANI**. Owner / creator: **Itachi**.

---

## Track

Payments and markets.

## Is it Agentic?

No. Frani Coupon issues and redeems coupons against fixed rules. No autonomous
behaviour, no model in the loop.

## Runs on AstridOS?

No.

## Live on-network

- Network: **testnet2**
- Each deployment holds its own wallet and prints its address at startup.

## SDK features used

| Feature | Where |
|---|---|
| Wallet identity | `src/wallet.js` (Sphere SDK) |

## Commands

```bash
npm run issue -- --merchant "Agora" --discount 500
npm run redeem -- <couponId> --code <CODE> --by 0x…
npm run list
```
