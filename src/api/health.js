export async function getHealth() {
  const res = await fetch('/api/health', { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json(); // esperado: { status:"UP", db:"UP" | "DOWN", error? }
}