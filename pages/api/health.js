// pages/api/health.js
export default function handler(req, res) {
  res.setHeader('content-type', 'application/json');
  res.status(200).send(JSON.stringify({ ok: true, route: '/api/health' }));
}
