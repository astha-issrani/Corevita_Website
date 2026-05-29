import React, { useRef, useCallback } from 'react';
import './RichTextEditor.css';

export default function RichTextEditor({ value, onChange, rows = 4, placeholder = '' }) {
  const ref = useRef(null);

  const applyWrap = useCallback(
    (before, after, placeholderText = 'text') => {
      const el = ref.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = value.substring(start, end) || placeholderText;
      const next = value.substring(0, start) + before + selected + after + value.substring(end);
      onChange(next);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start + before.length, start + before.length + selected.length);
      });
    },
    [value, onChange]
  );

  const applyLink = () => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end) || 'link text';
    const url = window.prompt('Link URL (https://...)', 'https://');
    if (url == null || !String(url).trim()) return;
    const u = String(url).trim();
    const next =
      value.substring(0, start) + `[${selected}](${u})` + value.substring(end);
    onChange(next);
    el.focus();
  };

  return (
    <div className="rte">
      <div className="rte-toolbar" role="toolbar" aria-label="Formatting">
        <button type="button" className="rte-btn" title="Bold (**text**)" onClick={() => applyWrap('**', '**', 'bold')}>
          <strong>B</strong>
        </button>
        <button type="button" className="rte-btn" title="Italic (*text*)" onClick={() => applyWrap('*', '*', 'italic')}>
          <em>I</em>
        </button>
        <button type="button" className="rte-btn rte-btn-link" title="Insert link" onClick={applyLink}>
          Link
        </button>
        <span className="rte-toolbar-hint">Select text first, then click a button</span>
      </div>
      <textarea
        ref={ref}
        className="rte-area ac-input"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="rte-format-hint">
        <strong>Format:</strong> **bold** · *italic* · [link label](https://url) · blank line = new paragraph
      </p>
    </div>
  );
}
