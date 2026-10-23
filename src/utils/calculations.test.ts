import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRentalFees,
  calculateBookingCost,
  calculateDistanceKm,
  formatFCFA,
  getWhatsAppLink,
} from './calculations';

test('calculateRentalFees returns exact Ivorian standard breakdown (1 rent + 2 caution + 2 advance = 5x)', () => {
  const result = calculateRentalFees(120000);
  assert.equal(result.monthlyRent, 120000);
  assert.equal(result.firstMonth, 120000);
  assert.equal(result.cautionMonths, 2);
  assert.equal(result.cautionAmount, 240000);
  assert.equal(result.advanceMonths, 2);
  assert.equal(result.advanceAmount, 240000);
  assert.equal(result.totalEstimated, 600000);
});

test('calculateRentalFees handles edge cases gracefully', () => {
  const resultZero = calculateRentalFees(0);
  assert.equal(resultZero.totalEstimated, 0);

  const resultNegative = calculateRentalFees(-50000);
  assert.equal(resultNegative.totalEstimated, 0);
});

test('calculateBookingCost calculates nights and total correctly for valid dates', () => {
  const result = calculateBookingCost(35000, '2026-11-01', '2026-11-04');
  assert.equal(result.valid, true);
  assert.equal(result.nights, 3);
  assert.equal(result.total, 105000);
});

test('calculateBookingCost flags invalid or negative date ranges', () => {
  const resultSameDay = calculateBookingCost(35000, '2026-11-01', '2026-11-01');
  assert.equal(resultSameDay.valid, false);

  const resultInverted = calculateBookingCost(35000, '2026-11-05', '2026-11-01');
  assert.equal(resultInverted.valid, false);
});

test('calculateDistanceKm computes distance between Cocody and Marcory (approx 6-9km)', () => {
  // Cocody: 5.3533, -3.9855
  // Marcory: 5.2982, -3.9806
  const distance = calculateDistanceKm(5.3533, -3.9855, 5.2982, -3.9806);
  assert.ok(distance > 5 && distance < 10, `Distance should be ~6km, got ${distance}`);
});

test('formatFCFA formats amounts cleanly with suffix', () => {
  const formatted = formatFCFA(120000);
  // French locale space separator
  assert.ok(formatted.includes('120') && formatted.includes('FCFA'));
});

test('getWhatsAppLink creates encoded URL with Ivorian country code +225', () => {
  const link = getWhatsAppLink('0707070707', 'Studio Cocody', '120 000 FCFA/mois');
  assert.ok(link.startsWith('https://wa.me/2250707070707'));
  assert.ok(link.includes('Studio%20Cocody'));
});
