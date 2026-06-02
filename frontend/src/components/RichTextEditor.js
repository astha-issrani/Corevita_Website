import React, { useRef, useCallback, useState } from 'react';
import {
  IconFontFamily, IconFontSize, IconGrowFont, IconShrinkFont, IconChangeCase,
  IconClearFormat, IconBulletList, IconNumberList, IconMultiList,
  IconDecreaseIndent, IconIncreaseIndent, IconBold, IconItalic, IconUnderline,
  IconStrikethrough, IconSubscript, IconSuperscript, IconTextEffects,
  IconHighlight, IconFontColor, IconAlignLeft, IconAlignCenter, IconAlignRight,
  IconAlignJustify, IconLineSpacing, IconShading, IconLink, IconHeading, IconDropdown,
} from './WordToolbarIcons';
import './RichTextEditor.css';

const FONT_FAMILIES = ['Inter', 'Geist', 'Calibri', 'Arial', 'Georgia', 'Times New Roman'];
const FONT_SIZES = ['10', '11', '12', '14', '16', '18', '20', '24', '28', '32'];

function ToolbarDivider() {
  return <span className="rte-divider" aria-hidden="true" />;
}

function ToolbarBtn({ title, onClick, active, children, wide, className = '' }) {
  return (
    <button
      type="button"
      className={`rte-btn ${active ? 'active' : ''} ${wide ? 'rte-btn-wide' : ''} ${className}`.trim()}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ToolbarSelect({ value, onChange, options, ariaLabel, className = '' }) {
  return (
    <label className={`rte-select-wrap ${className}`.trim()}>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={ariaLabel}>
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>
        ))}
      </select>
      <IconDropdown />
    </label>
  );
}

export default function RichTextEditor({ value, onChange, rows = 4, placeholder = '', compact = false }) {
  const ref = useRef(null);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState('12');
  const [align, setAlign] = useState('left');

  const getSelection = useCallback(() => {
    const el = ref.current;
    if (!el) return { start: 0, end: 0, selected: '', el: null };
    return {
      start: el.selectionStart,
      end: el.selectionEnd,
      selected: value.substring(el.selectionStart, el.selectionEnd),
      el,
    };
  }, [value]);

  const replaceSelection = useCallback(
    (next, selStart, selEnd) => {
      onChange(next);
      requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        el.focus();
        if (selStart != null && selEnd != null) {
          el.setSelectionRange(selStart, selEnd);
        }
      });
    },
    [onChange]
  );

  const applyWrap = useCallback(
    (before, after, placeholderText = 'text') => {
      const { start, end, selected, el } = getSelection();
      if (!el) return;
      const inner = selected || placeholderText;
      const next = value.substring(0, start) + before + inner + after + value.substring(end);
      replaceSelection(next, start + before.length, start + before.length + inner.length);
    },
    [value, getSelection, replaceSelection]
  );

  const applyLinePrefix = useCallback(
    (prefix, numbered = false) => {
      const { start, end, selected, el } = getSelection();
      if (!el) return;
      const block = selected || value.split('\n').find((l) => l.trim()) || 'List item';
      const lines = block.split('\n');
      const prefixed = lines
        .map((line, i) => {
          const stripped = line.replace(/^(\s*[-*]|\s*\d+\.)\s*/, '');
          if (numbered) return `${i + 1}. ${stripped}`;
          return `${prefix}${stripped}`;
        })
        .join('\n');
      const next = value.substring(0, start) + prefixed + value.substring(end);
      replaceSelection(next, start, start + prefixed.length);
    },
    [value, getSelection, replaceSelection]
  );

  const applyIndent = useCallback(
    (delta) => {
      const { start, end, selected, el } = getSelection();
      if (!el) return;
      const block = selected || value.substring(start, end) || '';
      const lines = block.split('\n');
      const indented = lines
        .map((line) => {
          if (delta > 0) return `  ${line}`;
          return line.replace(/^  /, '');
        })
        .join('\n');
      const next = value.substring(0, start) + indented + value.substring(end);
      replaceSelection(next, start, start + indented.length);
    },
    [value, getSelection, replaceSelection]
  );

  const applyCase = useCallback(() => {
    const { start, end, selected, el } = getSelection();
    if (!el || !selected) return;
    const isUpper = selected === selected.toUpperCase();
    const transformed = isUpper
      ? selected.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
      : selected.toUpperCase();
    const next = value.substring(0, start) + transformed + value.substring(end);
    replaceSelection(next, start, start + transformed.length);
  }, [value, getSelection, replaceSelection]);

  const clearFormatting = useCallback(() => {
    const { start, end, selected, el } = getSelection();
    if (!el || !selected) return;
    const cleaned = selected
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\+\+([^+]+)\+\+/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1')
      .replace(/\^([^^]+)\^/g, '$1')
      .replace(/,,([^,]+),,/g, '$1')
      .replace(/==([^=]+)==/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\[align:(left|center|right|justify)\]|\[\/align\]/g, '');
    const next = value.substring(0, start) + cleaned + value.substring(end);
    replaceSelection(next, start, start + cleaned.length);
  }, [value, getSelection, replaceSelection]);

  const applyLink = () => {
    const { start, end, selected, el } = getSelection();
    if (!el) return;
    const label = selected || 'link text';
    const url = window.prompt('Link URL (https://...)', 'https://');
    if (url == null || !String(url).trim()) return;
    const u = String(url).trim();
    const next = value.substring(0, start) + `[${label}](${u})` + value.substring(end);
    replaceSelection(next, start, start + `[${label}](${u})`.length);
  };

  const applyHeading = () => {
    const { start, end, selected, el } = getSelection();
    if (!el) return;
    const inner = (selected || 'Section Heading').trim();
    const block = `\n\n**${inner}**\n\n`;
    const next = value.substring(0, start) + block + value.substring(end);
    replaceSelection(next, start + 2, start + 2 + inner.length + 4);
  };

  const applyAlign = (mode) => {
    setAlign(mode);
    applyWrap(`[align:${mode}]`, '[/align]', 'aligned text');
  };

  const applyColor = () => {
    const color = window.prompt('Font color (hex, e.g. #C00000 or red)', '#C00000');
    if (!color?.trim()) return;
    applyWrap(`{c:${color.trim()}}`, '{/c}', 'colored text');
  };

  const applyHighlight = () => {
    applyWrap('==', '==', 'highlighted');
  };

  const applyLineSpacing = () => {
    const { start, end, selected, el } = getSelection();
    if (!el) return;
    const block = selected || 'Paragraph one\n\nParagraph two';
    const spaced = block.replace(/\n(?!\n)/g, '\n\n');
    const next = value.substring(0, start) + spaced + value.substring(end);
    replaceSelection(next, start, start + spaced.length);
  };

  const applyShading = () => {
    applyWrap('==', '==', 'shaded text');
  };

  const textareaStyle = {
    fontFamily: `'${fontFamily}', sans-serif`,
    fontSize: `${fontSize}px`,
  };

  return (
    <div className={`rte ${compact ? 'rte-compact' : ''}`}>
      <div className="rte-toolbar" role="toolbar" aria-label="Text formatting">
        <div className="rte-row">
          <ToolbarSelect
            className="rte-font-family"
            ariaLabel="Font family"
            value={fontFamily}
            onChange={setFontFamily}
            options={FONT_FAMILIES.map((f) => ({ value: f, label: f }))}
          />
          <ToolbarSelect
            className="rte-font-size"
            ariaLabel="Font size"
            value={fontSize}
            onChange={setFontSize}
            options={FONT_SIZES.map((s) => ({ value: s, label: s }))}
          />
          <ToolbarBtn title="Increase font size" onClick={() => {
            const idx = FONT_SIZES.indexOf(fontSize);
            if (idx < FONT_SIZES.length - 1) setFontSize(FONT_SIZES[idx + 1]);
          }}><IconGrowFont /></ToolbarBtn>
          <ToolbarBtn title="Decrease font size" onClick={() => {
            const idx = FONT_SIZES.indexOf(fontSize);
            if (idx > 0) setFontSize(FONT_SIZES[idx - 1]);
          }}><IconShrinkFont /></ToolbarBtn>
          <ToolbarBtn title="Change case" onClick={applyCase}><IconChangeCase /></ToolbarBtn>
          <ToolbarBtn title="Clear all formatting" onClick={clearFormatting}><IconClearFormat /></ToolbarBtn>

          <ToolbarDivider />

          <ToolbarBtn title="Bulleted list" onClick={() => applyLinePrefix('- ')}><IconBulletList /></ToolbarBtn>
          <ToolbarBtn title="Numbered list" onClick={() => applyLinePrefix('', true)}><IconNumberList /></ToolbarBtn>
          <ToolbarBtn title="Multilevel list" onClick={() => applyLinePrefix('  - ')}><IconMultiList /></ToolbarBtn>
          <ToolbarBtn title="Decrease indent" onClick={() => applyIndent(-1)}><IconDecreaseIndent /></ToolbarBtn>
          <ToolbarBtn title="Increase indent" onClick={() => applyIndent(1)}><IconIncreaseIndent /></ToolbarBtn>
        </div>

        <div className="rte-row">
          <ToolbarBtn title="Bold (Ctrl+B)" onClick={() => applyWrap('**', '**', 'bold')}><IconBold /></ToolbarBtn>
          <ToolbarBtn title="Italic (Ctrl+I)" onClick={() => applyWrap('*', '*', 'italic')}><IconItalic /></ToolbarBtn>
          <ToolbarBtn title="Underline" onClick={() => applyWrap('++', '++', 'underline')}><IconUnderline /></ToolbarBtn>
          <ToolbarBtn title="Strikethrough" onClick={() => applyWrap('~~', '~~', 'strike')}><IconStrikethrough /></ToolbarBtn>
          <ToolbarBtn title="Subscript" onClick={() => applyWrap(',,', ',,', 'sub')}><IconSubscript /></ToolbarBtn>
          <ToolbarBtn title="Superscript" onClick={() => applyWrap('^', '^', 'sup')}><IconSuperscript /></ToolbarBtn>

          <ToolbarDivider />

          <ToolbarBtn title="Text effects" onClick={() => applyWrap('**', '**', 'effect')}><IconTextEffects /></ToolbarBtn>
          <ToolbarBtn title="Text highlight color" onClick={applyHighlight}><IconHighlight /></ToolbarBtn>
          <ToolbarBtn title="Font color" onClick={applyColor}><IconFontColor /></ToolbarBtn>

          <ToolbarDivider />

          <ToolbarBtn title="Align left" active={align === 'left'} onClick={() => applyAlign('left')}><IconAlignLeft active={align === 'left'} /></ToolbarBtn>
          <ToolbarBtn title="Align center" active={align === 'center'} onClick={() => applyAlign('center')}><IconAlignCenter active={align === 'center'} /></ToolbarBtn>
          <ToolbarBtn title="Align right" active={align === 'right'} onClick={() => applyAlign('right')}><IconAlignRight active={align === 'right'} /></ToolbarBtn>
          <ToolbarBtn title="Justify" active={align === 'justify'} onClick={() => applyAlign('justify')}><IconAlignJustify active={align === 'justify'} /></ToolbarBtn>
          <ToolbarBtn title="Line and paragraph spacing" onClick={applyLineSpacing}><IconLineSpacing /></ToolbarBtn>
          <ToolbarBtn title="Shading" onClick={applyShading}><IconShading /></ToolbarBtn>

          <ToolbarDivider />

          <ToolbarBtn title="Insert link" onClick={applyLink}><IconLink /></ToolbarBtn>
          <ToolbarBtn title="Heading" onClick={applyHeading}><IconHeading /></ToolbarBtn>
        </div>
      </div>
      <textarea
        ref={ref}
        className="rte-area ac-input"
        rows={rows}
        style={textareaStyle}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
