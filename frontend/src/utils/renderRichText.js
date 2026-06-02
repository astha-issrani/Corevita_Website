import React from 'react';
import { Link } from 'react-router-dom';

function safeHref(url) {
  const u = String(url || '').trim();
  if (!u) return null;
  if (u.startsWith('/') || u.startsWith('#')) return u;
  if (/^https?:\/\//i.test(u) || /^mailto:/i.test(u)) return u;
  return `https://${u}`;
}

function stripAlignTags(text) {
  return String(text || '').replace(/\[align:(left|center|right|justify)\]|\[\/align\]/g, '');
}

/** Strip markdown formatting for plain-text fields (product name, slugs, etc.) */
export function stripMarkdown(text) {
  return String(text || '')
    .replace(/\{c:[^}]+\}([\s\S]*?)\{\/c\}/g, '$1')
    .replace(/\[align:(left|center|right|justify)\]|\[\/align\]/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\+\+([^+]+)\+\+/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/==([^=]+)==/g, '$1')
    .replace(/,,([^,]+),,/g, '$1')
    .replace(/\^([^^]+)\^/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

/** Parse inline **bold**, *italic*, ++underline++, ~~strike~~, ==highlight==, ^sup^, ,,sub,,, {c:color}text{/c}, [label](url) */
export function parseInlineRichText(text, keyPrefix = '') {
  if (!text) return [];

  const src = stripAlignTags(text);
  const re = /(\{c:([^}]+)\}([\s\S]*?)\{\/c\}|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|==([^=]+)==|~~([^~]+)~~|\+\+([^+]+)\+\+|,,([^,]+),,|\^([^^]+)\^|\*([^*]+)\*)/g;

  const nodes = [];
  let last = 0;
  let m;
  let i = 0;

  while ((m = re.exec(src)) !== null) {
    if (m.index > last) nodes.push(src.slice(last, m.index));
    const k = `${keyPrefix}-${i++}`;

    if (m[1]?.startsWith('{c:')) {
      nodes.push(
        <span key={k} style={{ color: m[2] }}>
          {parseInlineRichText(m[3], `${k}-inner`)}
        </span>
      );
    } else if (m[4] != null) {
      const href = safeHref(m[5]);
      if (href && href.startsWith('/')) {
        nodes.push(<Link key={k} to={href} className="rich-link">{m[4]}</Link>);
      } else if (href) {
        nodes.push(<a key={k} href={href} target="_blank" rel="noopener noreferrer" className="rich-link">{m[4]}</a>);
      } else {
        nodes.push(m[0]);
      }
    } else if (m[6] != null) {
      nodes.push(<strong key={k}>{m[6]}</strong>);
    } else if (m[7] != null) {
      nodes.push(<mark key={k} className="rich-highlight">{m[7]}</mark>);
    } else if (m[8] != null) {
      nodes.push(<del key={k}>{m[8]}</del>);
    } else if (m[9] != null) {
      nodes.push(<u key={k}>{m[9]}</u>);
    } else if (m[10] != null) {
      nodes.push(<sub key={k}>{m[10]}</sub>);
    } else if (m[11] != null) {
      nodes.push(<sup key={k}>{m[11]}</sup>);
    } else if (m[12] != null) {
      nodes.push(<em key={k}>{m[12]}</em>);
    }
    last = re.lastIndex;
  }

  if (last < src.length) nodes.push(src.slice(last));
  return nodes;
}

function renderListBlock(lines, bi) {
  const isOrdered = /^\d+\.\s/.test(lines[0]);
  const Tag = isOrdered ? 'ol' : 'ul';
  return (
    <Tag key={bi} className="rich-text-list">
      {lines.map((line, li) => {
        const content = line.replace(/^(\d+\.|-|\*)\s+/, '');
        return <li key={li}>{parseInlineRichText(content, `li-${bi}-${li}`)}</li>;
      })}
    </Tag>
  );
}

function getAlignClass(text) {
  const m = String(text).match(/\[align:(left|center|right|justify)\]/);
  return m ? `rich-align-${m[1]}` : '';
}

/** Paragraphs separated by blank lines; lines starting/ending with ** become h2 */
export function renderRichText(text, { className = '' } = {}) {
  if (!text) return null;
  const alignClass = getAlignClass(text);
  const blocks = String(text).split(/\n\n+/);

  return (
    <div className={`${className || 'rich-text'} ${alignClass}`.trim()}>
      {blocks.map((block, bi) => {
        const para = block.trim();
        if (!para) return null;

        const cleanPara = stripAlignTags(para).trim();
        const lines = cleanPara.split('\n').filter(Boolean);

        if (lines.length > 1 && lines.every((l) => /^(\d+\.|-|\*)\s/.test(l.trim()))) {
          return renderListBlock(lines.map((l) => l.trim()), bi);
        }

        if (/^\*\*[^*]+\*\*$/.test(cleanPara)) {
          return (
            <h2 key={bi} className="rich-text-h2">
              {cleanPara.slice(2, -2)}
            </h2>
          );
        }

        return (
          <p key={bi} className="rich-text-p">
            {parseInlineRichText(cleanPara, `b${bi}`)}
          </p>
        );
      })}
    </div>
  );
}

/** Inline only — for use inside <p> tags */
export function renderBoldText(text) {
  if (!text) return null;
  return parseInlineRichText(text, 'inline');
}
