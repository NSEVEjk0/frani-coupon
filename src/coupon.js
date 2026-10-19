// Frani Coupon — signed one-time coupon domain logic.
// A merchant issues a coupon with a secret code and a discount in basis
// points. Redemption consumes one use; codes are single-use by default.

export function newId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function issueCoupon({ merchant, discountBps, maxUses = 1 }) {
  if (!merchant) throw new Error('a coupon needs a merchant');
  const bps = Number(discountBps);
  if (!Number.isInteger(bps) || bps < 0 || bps > 10000) {
    throw new Error('discountBps must be an integer 0–10000');
  }
  const uses = Number(maxUses);
  if (!Number.isInteger(uses) || uses < 1) throw new Error('maxUses must be ≥ 1');
  return {
    id: newId('cpn'),
    merchant,
    code: genCode(),
    discountBps: bps,
    maxUses: uses,
    uses: 0,
    active: true,
    createdAt: new Date().toISOString(),
  };
}

export function redeem(coupon, code, redeemer) {
  if (!coupon) throw new Error('coupon not found');
  if (!coupon.active) throw new Error('coupon is inactive');
  if (coupon.code !== code) throw new Error('invalid code');
  if (coupon.uses >= coupon.maxUses) throw new Error('coupon fully redeemed');
  coupon.uses += 1;
  if (coupon.uses >= coupon.maxUses) coupon.active = false;
  coupon.lastRedeemedBy = redeemer;
  coupon.lastRedeemedAt = new Date().toISOString();
  return coupon.uses;
}

export function renderCoupon(coupon) {
  const pct = (coupon.discountBps / 100).toFixed(2);
  return `${coupon.id} · ${coupon.merchant} · ${pct}% off · ${coupon.uses}/${coupon.maxUses} used · ${coupon.active ? 'active' : 'spent'}`;
}
