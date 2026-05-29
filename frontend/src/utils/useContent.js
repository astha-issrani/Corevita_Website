import { useState, useEffect } from 'react';

const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';

// Cache so pages don't re-fetch on every render
const cache = {};

/**
 * useContent('home')  →  { c, loading }
 * c('hero', 'title', 'Default text')  →  string from DB or fallback
 */
export function useContent(page) {
  const [data, setData] = useState(cache[page] || []);
  const [loading, setLoading] = useState(!cache[page]);

  useEffect(() => {
    if (cache[page]) { setData(cache[page]); setLoading(false); return; }
    fetch(`${BASE}/content/${page}`)
      .then(r => r.ok ? r.json() : [])
      .then(rows => { cache[page] = rows; setData(rows); setLoading(false); })
      .catch(() => setLoading(false));
  }, [page]);

  /** Get a field value. Falls back to `fallback` string. */
  const c = (section, field, fallback = '') => {
    const row = data.find(r => r.section === section && r.field === field);
    return (row && row.value !== undefined && row.value !== '') ? row.value : fallback;
  };

  return { c, loading, raw: data };
}

/** Invalidate cache for a page (call after admin save) */
export function invalidateContent(page) {
  delete cache[page];
}