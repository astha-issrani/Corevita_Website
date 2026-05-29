import { useState, useEffect, useCallback } from 'react';

const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';

const cache = {};

async function fetchPageContent(page) {
  const res = await fetch(`${BASE}/content/${page}`);
  if (!res.ok) return [];
  const rows = await res.json();
  return Array.isArray(rows) ? rows : [];
}

/**
 * useContent('home')  →  { c, loading }
 * c('hero', 'title', 'Default text')  →  string from DB or fallback
 */
export function useContent(page) {
  const [data, setData] = useState(cache[page] || []);
  const [loading, setLoading] = useState(!cache[page]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await fetchPageContent(page);
      cache[page] = rows;
      setData(rows);
    } catch {
      setData([]);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    load();
    const onUpdate = (e) => {
      if (e.detail?.page === page) load();
    };
    window.addEventListener('content-updated', onUpdate);
    return () => window.removeEventListener('content-updated', onUpdate);
  }, [page, load]);

  const c = (section, field, fallback = '') => {
    const row = data.find(r => r.section === section && r.field === field);
    if (row && row.value !== undefined && row.value !== null) return row.value;
    return fallback;
  };

  return { c, loading, raw: data };
}

/** Invalidate cache for a page (call after admin save) */
export function invalidateContent(page) {
  delete cache[page];
  window.dispatchEvent(new CustomEvent('content-updated', { detail: { page } }));
}