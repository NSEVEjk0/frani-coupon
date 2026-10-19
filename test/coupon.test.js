// Frani Coupon — unit tests (plain node).
import assert from 'node:assert/strict';
import { issueCoupon, redeem } from '../src/coupon.js';

const coupon = issueCoupon({ merchant: 'Agora', discountBps: 500, maxUses: 1 });

assert.equal(coupon.discountBps, 500);
assert.equal(coupon.maxUses, 1);
assert.equal(coupon.active, true);

// wrong code rejected
assert.throws(() => redeem(coupon, 'WRONG', '0x…'), /invalid code/);

// correct code redeems
redeem(coupon, coupon.code, '0x…');
assert.equal(coupon.uses, 1);
assert.equal(coupon.active, false);

// spent coupon rejected
assert.throws(() => redeem(coupon, coupon.code, '0x…'), /fully redeemed|inactive/);

// multi-use coupon stays active until exhausted
const multi = issueCoupon({ merchant: 'Bazaar', discountBps: 200, maxUses: 3 });
redeem(multi, multi.code, '0x1');
assert.equal(multi.active, true);
redeem(multi, multi.code, '0x2');
redeem(multi, multi.code, '0x3');
assert.equal(multi.active, false);

console.log('coupon.test.js — all passed');
