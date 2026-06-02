const API_ORIGIN = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

export function resolveUploadUrl(url) {
  if (!url) return '';
  const u = String(url).trim();
  if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
  if (u.startsWith('/uploads/')) return `${API_ORIGIN}${u}`;
  return u;
}

export function getUploadEndpoint(type = 'image') {
  return `${API_ORIGIN}/api/uploads/${type}`;
}
