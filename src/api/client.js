export async function api(url, { method = 'GET', headers = {}, body } = {}) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers }
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  // OJO: gracias al proxy, llamamos directo a /api/...
  const res = await fetch(url, opts);

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = (isJson && (data.message || data.error)) || res.statusText;
    throw new Error(`${res.status} ${msg}`);
  }
  return data;
}

export const get = (url) => api(url);
export const post = (url, body, headers) => api(url, { method: 'POST', body, headers });
export const patch = (url, body, headers) => api(url, { method: 'PATCH', body, headers });
export const del = (url, headers) => api(url, { method: 'DELETE', headers });
