import React from 'react';

const S = ({ children, w = 16, h = 16, viewBox = '0 0 16 16' }) => (
  <svg width={w} height={h} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {children}
  </svg>
);

export function IconFontFamily() {
  return (
    <S viewBox="0 0 18 16">
      <text x="1" y="12" fontSize="11" fontFamily="Georgia, serif" fill="#333">A</text>
      <path d="M14 5l2 2-2 2" stroke="#666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </S>
  );
}

export function IconFontSize() {
  return (
    <S viewBox="0 0 18 16">
      <text x="2" y="12" fontSize="10" fontFamily="Arial, sans-serif" fill="#333">12</text>
      <path d="M14 5l2 2-2 2" stroke="#666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </S>
  );
}

export function IconGrowFont() {
  return (
    <S>
      <text x="1" y="12" fontSize="11" fontWeight="600" fill="#333">A</text>
      <path d="M11 10V4M11 4l-1.5 1.5M11 4l1.5 1.5" stroke="#217346" strokeWidth="1.3" strokeLinecap="round" />
    </S>
  );
}

export function IconShrinkFont() {
  return (
    <S>
      <text x="1" y="11" fontSize="8" fontWeight="600" fill="#333">A</text>
      <path d="M11 4v6M11 10l-1.5-1.5M11 10l1.5-1.5" stroke="#217346" strokeWidth="1.3" strokeLinecap="round" />
    </S>
  );
}

export function IconChangeCase() {
  return (
    <S viewBox="0 0 20 16">
      <text x="1" y="8" fontSize="7" fill="#333">Aa</text>
      <text x="1" y="14" fontSize="5" fill="#666">abc</text>
      <path d="M15 6l2 2-2 2" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
    </S>
  );
}

export function IconClearFormat() {
  return (
    <S viewBox="0 0 20 16">
      <text x="1" y="12" fontSize="11" fontWeight="700" fill="#333">A</text>
      <rect x="10" y="8" width="7" height="3" rx="0.5" fill="#E8A4B8" transform="rotate(-35 13.5 9.5)" />
      <path d="M9 11l6-3" stroke="#C55A7B" strokeWidth="1.2" strokeLinecap="round" />
    </S>
  );
}

export function IconBulletList() {
  return (
    <S viewBox="0 0 18 16">
      {[4, 8, 12].map((y) => (
        <g key={y}>
          <circle cx="3" cy={y} r="1.5" fill="#2B579A" />
          <rect x="6" y={y - 0.8} width="10" height="1.6" rx="0.5" fill="#555" />
        </g>
      ))}
      <path d="M16 3l1.5 1.5L16 6" stroke="#666" strokeWidth="1" strokeLinecap="round" />
    </S>
  );
}

export function IconNumberList() {
  return (
    <S viewBox="0 0 18 16">
      <text x="1" y="5.5" fontSize="5" fill="#2B579A" fontWeight="600">1</text>
      <text x="1" y="9.5" fontSize="5" fill="#2B579A" fontWeight="600">2</text>
      <text x="1" y="13.5" fontSize="5" fill="#2B579A" fontWeight="600">3</text>
      {[4, 8, 12].map((y) => (
        <rect key={y} x="6" y={y - 0.8} width="10" height="1.6" rx="0.5" fill="#555" />
      ))}
      <path d="M16 3l1.5 1.5L16 6" stroke="#666" strokeWidth="1" strokeLinecap="round" />
    </S>
  );
}

export function IconMultiList() {
  return (
    <S viewBox="0 0 18 16">
      <text x="0" y="5" fontSize="4.5" fill="#2B579A">1</text>
      <text x="2" y="8.5" fontSize="4" fill="#2B579A">a</text>
      <text x="3.5" y="12" fontSize="3.5" fill="#2B579A">i</text>
      <rect x="7" y="3.2" width="8" height="1.4" rx="0.5" fill="#555" />
      <rect x="7" y="7.2" width="6" height="1.4" rx="0.5" fill="#555" />
      <rect x="7" y="11.2" width="5" height="1.4" rx="0.5" fill="#555" />
    </S>
  );
}

export function IconDecreaseIndent() {
  return (
    <S viewBox="0 0 18 16">
      <path d="M1 8h5M1 4h12M1 12h12" stroke="#555" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M14 6l-2 2 2 2" stroke="#555" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </S>
  );
}

export function IconIncreaseIndent() {
  return (
    <S viewBox="0 0 18 16">
      <path d="M5 8h12M5 4h12M5 12h12" stroke="#555" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M2 6l2 2-2 2" stroke="#555" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </S>
  );
}

export function IconBold() {
  return (
    <S viewBox="0 0 14 16">
      <text x="1" y="13" fontSize="13" fontWeight="700" fontFamily="Georgia, serif" fill="#333">B</text>
    </S>
  );
}

export function IconItalic() {
  return (
    <S viewBox="0 0 14 16">
      <text x="3" y="13" fontSize="13" fontStyle="italic" fontFamily="Georgia, serif" fill="#333">I</text>
    </S>
  );
}

export function IconUnderline() {
  return (
    <S viewBox="0 0 16 16">
      <text x="2" y="11" fontSize="12" fontFamily="Georgia, serif" fill="#333">U</text>
      <path d="M2 13.5h10" stroke="#333" strokeWidth="1.4" />
      <path d="M13 4l1.5 1.5L13 7" stroke="#666" strokeWidth="1" strokeLinecap="round" />
    </S>
  );
}

export function IconStrikethrough() {
  return (
    <S viewBox="0 0 18 16">
      <text x="1" y="11" fontSize="10" fontFamily="Arial, sans-serif" fill="#333">ab</text>
      <path d="M1 8.5h12" stroke="#333" strokeWidth="1.3" />
    </S>
  );
}

export function IconSubscript() {
  return (
    <S viewBox="0 0 18 16">
      <text x="1" y="10" fontSize="10" fontFamily="Arial, sans-serif" fill="#333">x</text>
      <text x="9" y="13" fontSize="7" fill="#2B579A">2</text>
    </S>
  );
}

export function IconSuperscript() {
  return (
    <S viewBox="0 0 18 16">
      <text x="1" y="12" fontSize="10" fontFamily="Arial, sans-serif" fill="#333">x</text>
      <text x="9" y="7" fontSize="7" fill="#2B579A">2</text>
    </S>
  );
}

export function IconTextEffects() {
  return (
    <S viewBox="0 0 18 16">
      <text x="2" y="12" fontSize="12" fontWeight="600" fill="none" stroke="#2B579A" strokeWidth="0.8">A</text>
      <path d="M13 4l1.5 1.5L13 7" stroke="#666" strokeWidth="1" strokeLinecap="round" />
    </S>
  );
}

export function IconHighlight() {
  return (
    <S viewBox="0 0 20 16">
      <path d="M4 3l8 8-2 2-8-8 2-2z" fill="#F4B942" stroke="#333" strokeWidth="0.8" />
      <path d="M10 11l2 2" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="2" y="13" width="14" height="2" rx="0.5" fill="#FFFF00" opacity="0.85" />
      <path d="M17 4l1 1-1 1" stroke="#666" strokeWidth="1" strokeLinecap="round" />
    </S>
  );
}

export function IconFontColor() {
  return (
    <S viewBox="0 0 18 16">
      <text x="2" y="11" fontSize="12" fontWeight="600" fontFamily="Georgia, serif" fill="#333">A</text>
      <rect x="2" y="12.5" width="10" height="2.5" rx="0.5" fill="#C00000" />
      <path d="M15 4l1.5 1.5L15 7" stroke="#666" strokeWidth="1" strokeLinecap="round" />
    </S>
  );
}

export function IconAlignLeft({ active }) {
  return (
    <S>
      {[4, 7, 10, 13].map((y, i) => (
        <rect key={y} x="2" y={y} width={8 + i * 2} height="1.5" rx="0.5" fill={active ? '#2B579A' : '#555'} />
      ))}
    </S>
  );
}

export function IconAlignCenter({ active }) {
  return (
    <S>
      {[4, 7, 10, 13].map((y, i) => (
        <rect key={y} x={3 - i * 0.5} y={y} width={10 + i} height="1.5" rx="0.5" fill={active ? '#2B579A' : '#555'} />
      ))}
    </S>
  );
}

export function IconAlignRight({ active }) {
  return (
    <S>
      {[4, 7, 10, 13].map((y, i) => (
        <rect key={y} x={14 - 8 - i * 2} y={y} width={8 + i * 2} height="1.5" rx="0.5" fill={active ? '#2B579A' : '#555'} />
      ))}
    </S>
  );
}

export function IconAlignJustify({ active }) {
  return (
    <S>
      {[4, 7, 10, 13].map((y) => (
        <rect key={y} x="2" y={y} width="12" height="1.5" rx="0.5" fill={active ? '#2B579A' : '#555'} />
      ))}
    </S>
  );
}

export function IconLineSpacing() {
  return (
    <S viewBox="0 0 20 16">
      <path d="M3 3v10M3 3l-1.5 1.5M3 3l1.5 1.5M3 13l-1.5-1.5M3 13l1.5-1.5" stroke="#2B579A" strokeWidth="1.2" strokeLinecap="round" />
      {[4, 8, 12].map((y) => (
        <rect key={y} x="7" y={y - 0.8} width="10" height="1.6" rx="0.5" fill="#555" />
      ))}
      <path d="M18 4l1 1-1 1" stroke="#666" strokeWidth="1" strokeLinecap="round" />
    </S>
  );
}

export function IconShading() {
  return (
    <S viewBox="0 0 20 16">
      <path d="M3 12h12v2H3z" fill="#D9D9D9" stroke="#999" strokeWidth="0.5" />
      <path d="M8 4l4 4-4 4-4-4 4-4z" fill="#2B579A" opacity="0.7" />
      <path d="M16 4l1 1-1 1" stroke="#666" strokeWidth="1" strokeLinecap="round" />
    </S>
  );
}

export function IconLink() {
  return (
    <S viewBox="0 0 18 16">
      <path d="M7 9a3 3 0 004.2 0l2-2a3 3 0 00-4.2-4.2l-1 1" stroke="#2B579A" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M11 7a3 3 0 00-4.2 0l-2 2a3 3 0 004.2 4.2l1-1" stroke="#2B579A" strokeWidth="1.3" strokeLinecap="round" />
    </S>
  );
}

export function IconHeading() {
  return (
    <S viewBox="0 0 18 16">
      <text x="1" y="13" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif" fill="#333">H</text>
      <text x="10" y="13" fontSize="8" fontWeight="700" fill="#666">2</text>
    </S>
  );
}

export function IconDropdown() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <path d="M1 2.5L4 5.5L7 2.5" stroke="#666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
