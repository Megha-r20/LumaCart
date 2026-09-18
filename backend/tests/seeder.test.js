import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldAutoSeedDatabase } from '../utils/seeder.js';
import { shouldUseInMemoryMongo } from '../config/db.js';

test('auto-seeding should trigger when the database is empty', () => {
  assert.equal(shouldAutoSeedDatabase({ userCount: 0, productCount: 0 }), true);
});

test('auto-seeding should not trigger when demo data already exists', () => {
  assert.equal(shouldAutoSeedDatabase({ userCount: 2, productCount: 50 }), false);
});

test('an explicit MongoDB URI should not silently fall back to an in-memory database', () => {
  const originalUri = process.env.MONGODB_URI;

  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/lumacart';
  assert.equal(shouldUseInMemoryMongo(), false);

  delete process.env.MONGODB_URI;
  assert.equal(shouldUseInMemoryMongo(), true);

  if (originalUri) {
    process.env.MONGODB_URI = originalUri;
  }
});
