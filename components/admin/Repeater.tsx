"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type Key = string;
type Row = { _k: number; values: Record<Key, string> };

/**
 * Editable list of small records (features, process steps, FAQs). Serialised
 * to JSON in a hidden input; validated again on the server.
 */
export default function Repeater({
  name,
  defaultValue,
  fields,
  addLabel,
  max = 24,
  error,
}: {
  name: string;
  defaultValue: Record<Key, string>[];
  fields: { key: Key; label: string; multiline?: boolean; maxLength: number }[];
  addLabel: string;
  max?: number;
  error?: string[];
}) {
  const blank = () => Object.fromEntries(fields.map((f) => [f.key, ""])) as Record<Key, string>;
  const [rows, setRows] = useState<Row[]>(() => defaultValue.map((r, i) => ({ values: { ...r }, _k: i })));
  const [nextKey, setNextKey] = useState(defaultValue.length);

  const update = (i: number, key: Key, v: string) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, values: { ...r.values, [key]: v } } : r)));
  const move = (i: number, d: number) =>
    setRows((rs) => {
      const j = i + d;
      if (j < 0 || j >= rs.length) return rs;
      const copy = [...rs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const clean = rows.map((r) => r.values).filter((r) => Object.values(r).some((v) => v.trim()));

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={JSON.stringify(clean)} />
      {rows.map((r, i) => (
        <div key={r._k} className="rounded-xl border border-a-bd bg-a-card2 p-3.5">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="font-admin-mono text-[11px] text-a-t3">#{i + 1}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="flex h-7 w-7 items-center justify-center rounded-lg text-a-t3 hover:bg-a-card hover:text-a-t1 disabled:opacity-30"><ArrowUp size={14} /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="Move down" className="flex h-7 w-7 items-center justify-center rounded-lg text-a-t3 hover:bg-a-card hover:text-a-t1 disabled:opacity-30"><ArrowDown size={14} /></button>
              <button type="button" onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} aria-label="Remove" className="flex h-7 w-7 items-center justify-center rounded-lg text-a-t3 hover:bg-a-rose/10 hover:text-a-rose"><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {fields.map((f) =>
              f.multiline ? (
                <textarea key={f.key} aria-label={`${f.label} ${i + 1}`} placeholder={f.label} value={r.values[f.key] ?? ""} maxLength={f.maxLength} rows={2} onChange={(e) => update(i, f.key, e.target.value)} className="a-input resize-y" />
              ) : (
                <input key={f.key} aria-label={`${f.label} ${i + 1}`} placeholder={f.label} value={r.values[f.key] ?? ""} maxLength={f.maxLength} onChange={(e) => update(i, f.key, e.target.value)} className="a-input font-semibold" />
              ),
            )}
          </div>
        </div>
      ))}
      {rows.length < max ? (
        <button
          type="button"
          onClick={() => {
            setRows((rs) => [...rs, { values: blank(), _k: nextKey }]);
            setNextKey((k) => k + 1);
          }}
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-a-bd2 py-2.5 text-[13px] font-semibold text-a-t2 hover:border-a-brand hover:text-a-brand"
        >
          <Plus size={15} /> {addLabel}
        </button>
      ) : null}
      {error?.length ? <p role="alert" className="m-0 text-[12px] font-medium text-a-rose">{error[0]}</p> : null}
    </div>
  );
}
