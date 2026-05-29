import React from 'react';
import { Link } from 'react-router-dom';

function safeHref(url) {
  const u = String(url || '').trim();
  if (!u) return null;
  if (u.startsWith('/') || u.startsWith('#')) return u;
  if (/^https?:\/\//i.test(u) || /^mailto:/i.test(u)) return u;
  return `https://${u}`;
}

/** Parse inline **bold**, *italic*, [label](url) */
export function parseInlineRichText(text, keyPrefix = '') {
  if (!text) return [];
  const re = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  const nodes = [];
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    const k = `${keyPrefix}-${i++}`;
    if (m[2] != null) {
      const href = safeHref(m[3]);
      if (href && href.startsWith('/')) {
        nodes.push(
          <Link key={k} to={href} className="rich-link">
            {m[2]}
          </Link>
        );
      } else if (href) {
        nodes.push(
          <a key={k} href={href} target="_blank" rel="noopener noreferrer" className="rich-link">
            {m[2]}
          </a>
        );
      } else {
        nodes.push(m[0]);
      }
    } else if (m[4] != null) {
      nodes.push(<strong key={k}>{m[4]}</strong>);
    } else if (m[5] != null) {
      nodes.push(<em key={k}>{m[5]}</em>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Paragraphs separated by blank lines; lines starting/ending with ** become h2 */
export function renderRichText(text, { className = '' } = {}) {
  if (!text) return null;
  const blocks = String(text).split(/\n\n+/);
  return (
    <div className={className || 'rich-text'}>
      {blocks.map((block, bi) => {
        const para = block.trim();
        if (!para) return null;
        if (/^\*\*[^*]+\*\*$/.test(para)) {
          return (
            <h2 key={bi} className="rich-text-h2">
              {para.slice(2, -2)}
            </h2>
          );
        }
        return (
          <p key={bi} className="rich-text-p">
            {parseInlineRichText(para, `b${bi}`)}
          </p>
        );
      })}
    </div>
  );
}

/** Inline only — for use inside &lt;p&gt; tags */
export function renderBoldText(text) {
  if (!text) return null;
  return parseInlineRichText(text, 'inline');
}
