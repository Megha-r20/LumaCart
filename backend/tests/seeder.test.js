import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldAutoSeedDatabase } from '../utils/seeder.js';

test('auto-seeding should trigger when the database is empty', () => {
  assert.equal(shouldAutoSeedDatabase({ userCount: 0, productCount: 0 }), true);
});

test('auto-seeding should not trigger when demo data already exists', () => {
  assert.equal(shouldAutoSeedDatabase({ userCount: 2, productCount: 50 }), false);
});
