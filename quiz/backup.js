(() => {
  'use strict';

  const RESULTS_KEY = 'saa-c03-study-results-v2';
  const STATE_KEY = 'saa-c03-study-state-v3';
  const FORMAT = 'saa-c03-study-backup';

  function parseStored(value, fallback) {
    if (value == null || value === '') return fallback;
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function createBundle(storage, now = new Date()) {
    return {
      format: FORMAT,
      version: 1,
      exportedAt: now.toISOString(),
      results: parseStored(storage.getItem(RESULTS_KEY), {}),
      state: parseStored(storage.getItem(STATE_KEY), null),
    };
  }

  function normalizePayload(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('SAA学習データのJSONではありません。');
    }

    if (payload.format === FORMAT) {
      if (!payload.results || typeof payload.results !== 'object' || Array.isArray(payload.results)) {
        throw new Error('バックアップ内の成績データが正しくありません。');
      }
      return {
        results: payload.results,
        state: payload.state && typeof payload.state === 'object' && !Array.isArray(payload.state)
          ? payload.state
          : null,
      };
    }

    if (payload.results && typeof payload.results === 'object' && !Array.isArray(payload.results)) {
      return {
        results: payload.results,
        state: payload.state && typeof payload.state === 'object' && !Array.isArray(payload.state)
          ? payload.state
          : null,
      };
    }

    // 旧形式では localStorage の成績オブジェクト自体を書き出していた場合がある。
    return { results: payload, state: null };
  }

  function restoreBundle(storage, payload) {
    const normalized = normalizePayload(payload);
    storage.setItem(RESULTS_KEY, JSON.stringify(normalized.results));
    if (normalized.state) storage.setItem(STATE_KEY, JSON.stringify(normalized.state));
    else storage.removeItem(STATE_KEY);
    return normalized;
  }

  window.SAA_BACKUP = Object.freeze({
    RESULTS_KEY,
    STATE_KEY,
    FORMAT,
    createBundle,
    normalizePayload,
    restoreBundle,
  });
})();
