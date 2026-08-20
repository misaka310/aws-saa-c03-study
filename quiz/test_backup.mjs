import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('./backup.js', import.meta.url), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const backup = sandbox.window.SAA_BACKUP;

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
    dump() { return Object.fromEntries(values); },
  };
}

test('成績と画面状態をJSONへ書き出し、初期化後に往復復元できる', () => {
  const results = {
    'secure-01': {
      pick: [0], ok: false,
      attempts: [{ pick: [0], ok: false, at: '2026-08-02T00:00:00.000Z' }],
    },
  };
  const state = { mode: 'weakness', order: ['secure-01'], index: 0, domain: null, start: 12345 };
  const storage = createStorage({
    [backup.RESULTS_KEY]: JSON.stringify(results),
    [backup.STATE_KEY]: JSON.stringify(state),
  });

  const bundle = backup.createBundle(storage, new Date('2026-08-02T09:00:00+09:00'));
  storage.removeItem(backup.RESULTS_KEY);
  storage.removeItem(backup.STATE_KEY);
  backup.restoreBundle(storage, JSON.parse(JSON.stringify(bundle)));

  assert.deepEqual(JSON.parse(storage.getItem(backup.RESULTS_KEY)), results);
  assert.deepEqual(JSON.parse(storage.getItem(backup.STATE_KEY)), state);
});

test('旧形式の成績オブジェクトも同じlocalStorageキーへ復元できる', () => {
  const legacy = { 'cost-01': { pick: [1], ok: true, at: '2026-07-01T00:00:00.000Z' } };
  const storage = createStorage();
  backup.restoreBundle(storage, legacy);
  assert.deepEqual(JSON.parse(storage.getItem(backup.RESULTS_KEY)), legacy);
  assert.equal(storage.getItem(backup.STATE_KEY), null);
});
