import { useEffect, useState } from 'react'

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/accounts/1/balance')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(setData)
      .catch(err => setError(err.message))
  }, [])

  return (
    <div style={{ padding: 16 }}>
      <h1>Demo BankBack</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Cargando…</p>}
    </div>
  )
}
