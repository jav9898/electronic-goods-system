// website/src/App.js
import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

const API_BASE = 'http://localhost:5000';

export default function App() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [sel, setSel] = useState(new Set()); // selected IDs

  // query state
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(true);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const load = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        q,
        sort,
        page: String(page),
        pageSize: String(pageSize),
      }).toString();

      const res = await fetch(`${API_BASE}/api/product?${params}`);
      if (!res.ok) throw new Error('Failed to load items');
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
      // clear selections if page changes and some ids are not present anymore
      setSel((prev) => new Set([...prev].filter(id => (data.items || []).some(it => it.id === id))));
    } catch (e) {
      console.error(e);
      alert('Failed to load items. Check server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort, page, pageSize]);

  const toggleSelect = (id) => {
    setSel(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const selectAllOnPage = () => {
    setSel(prev => {
      const s = new Set(prev);
      items.forEach(it => s.add(it.id));
      return s;
    });
  };
  const clearSelection = () => setSel(new Set());

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    // optimistic remove
    const prev = items;
    setItems(prev.filter(it => it.id !== id));
    try {
      const res = await fetch(`${API_BASE}/api/product/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      setTotal(t => Math.max(0, t - 1));
      setSel(s => { const n = new Set(s); n.delete(id); return n; });
    } catch (e) {
      console.error(e);
      alert('Delete failed. Restoring item.');
      setItems(prev); // rollback
    }
  };

  const handleBulkDelete = async () => {
    if (sel.size === 0) return alert('No items selected.');
    if (!window.confirm(`Delete ${sel.size} selected item(s)?`)) return;

    const ids = [...sel];
    // optimistic
    const prev = items;
    setItems(prev.filter(it => !sel.has(it.id)));
    try {
      const res = await fetch(`${API_BASE}/api/product`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error(await res.text());
      setTotal(t => Math.max(0, t - ids.length));
      setSel(new Set());
    } catch (e) {
      console.error(e);
      alert('Bulk delete failed. Restoring items.');
      setItems(prev); // rollback
    }
  };

  const onChangePageSize = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="wrap">
      <header className="topbar">
        <h1>Assignment 1 — Items</h1>
        <div className="toolbar">
          <input
            className="input"
            placeholder="Search name or brand…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="brand_asc">Brand A–Z</option>
            <option value="brand_desc">Brand Z–A</option>
          </select>
          <select className="select" value={pageSize} onChange={onChangePageSize}>
            <option value={6}>6 / page</option>
            <option value={12}>12 / page</option>
            <option value={24}>24 / page</option>
          </select>
          <button className="btn" onClick={selectAllOnPage} disabled={!items.length}>Select page</button>
          <button className="btn" onClick={clearSelection} disabled={sel.size === 0}>Clear select</button>
          <button className="btn danger" onClick={handleBulkDelete} disabled={sel.size === 0}>
            Delete selected ({sel.size})
          </button>
        </div>
      </header>

      {loading ? (
        <div className="empty">Loading items…</div>
      ) : items.length === 0 ? (
        <div className="empty">No items found.</div>
      ) : (
        <>
          <ul className="grid">
            {items.map((it) => (
              <li className="card" key={it.id}>
                <div className="row">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={sel.has(it.id)}
                      onChange={() => toggleSelect(it.id)}
                    />
                    <span />
                  </label>

                  <div className="card__title">{it.name}</div>
                  <button className="card__delete" onClick={() => handleDelete(it.id)} title="Delete">✕</button>
                </div>

                {it.imageURL ? (
                  <div className="card__image">
                    <img src={it.imageURL} alt={it.name}
                         onError={(e)=>{ e.currentTarget.style.display='none'; }} />
                  </div>
                ) : null}

                <div className="card__meta">
                  {it.brand && <span className="pill">Brand: {it.brand}</span>}
                  {Number.isInteger(it.categoryID) && <span className="pill">CatID: {it.categoryID}</span>}
                </div>

                {it.description && <p className="card__desc">{it.description}</p>}
              </li>
            ))}
          </ul>

          <div className="pager">
            <button className="btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span>Page {page} / {totalPages}</span>
            <button className="btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        </>
      )}
    </div>
  );
}
