import test from 'node:test';
import assert from 'node:assert/strict';
import { addRecentSearch, deleteRecentSearch, RecentSearch } from './recentSearches';

test('addRecentSearch prepends new search and caps list to exactly 3 items', () => {
  const initial: RecentSearch[] = [
    { id: '1', label: 'Cocody', timestamp: 1 },
    { id: '2', label: 'Marcory', timestamp: 2 },
    { id: '3', label: 'Plateau', timestamp: 3 },
  ];

  const updated = addRecentSearch(initial, { label: 'Yopougon', commune: 'Yopougon' });
  assert.equal(updated.length, 3);
  assert.equal(updated[0].label, 'Yopougon');
  assert.equal(updated[1].label, 'Cocody');
  assert.equal(updated[2].label, 'Marcory');
});

test('addRecentSearch deduplicates existing search and moves it to top', () => {
  const initial: RecentSearch[] = [
    { id: '1', label: 'Cocody', timestamp: 1 },
    { id: '2', label: 'Marcory', timestamp: 2 },
    { id: '3', label: 'Plateau', timestamp: 3 },
  ];

  const updated = addRecentSearch(initial, { label: 'cocody' });
  assert.equal(updated.length, 3);
  assert.equal(updated[0].label, 'cocody');
  assert.equal(updated[1].label, 'Marcory');
  assert.equal(updated[2].label, 'Plateau');
});

test('deleteRecentSearch removes targeted search', () => {
  const initial: RecentSearch[] = [
    { id: '1', label: 'Cocody', timestamp: 1 },
    { id: '2', label: 'Marcory', timestamp: 2 },
  ];

  const updated = deleteRecentSearch(initial, '1');
  assert.equal(updated.length, 1);
  assert.equal(updated[0].id, '2');
});
