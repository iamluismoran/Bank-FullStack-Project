import { useEffect, useRef, useState } from "react";

export default function SearchBar({ value, onChange, delay = 400, placeholder = "Buscar por nombre o ID..." }) {
  const [local, setLocal] = useState(value || "");
  const t = useRef(null);

  useEffect(() => { setLocal(value || ""); }, [value]);

  useEffect(() => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => onChange(local), delay);
    return () => t.current && clearTimeout(t.current);
  }, [local, delay, onChange]);

  return (
    <input
      aria-label="Buscar"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      placeholder={placeholder}
    />
  );
}
