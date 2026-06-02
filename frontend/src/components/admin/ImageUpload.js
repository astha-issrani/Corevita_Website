import React, { useRef, useState } from 'react';
import { AdminIcon } from './AdminIcons';
import { resolveUploadUrl, getUploadEndpoint } from '../../utils/uploadUrl';
import './ImageUpload.css';

export default function ImageUpload({
  value,
  onChange,
  accept = 'image/*',
  label = 'Upload file',
  hint = '',
  multiple = false,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const isVideo = accept.includes('video');

  const uploadFile = async (file) => {
    setUploading(true);
    setError('');
    try {
      const token = localStorage.getItem('corevita_token');
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(getUploadEndpoint(isVideo ? 'video' : 'image'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      return data.url;
    } finally {
      setUploading(false);
    }
  };

  const handleFiles = async (files) => {
    if (!files?.length) return;
    try {
      if (multiple) {
        const urls = [];
        for (const file of files) {
          urls.push(await uploadFile(file));
        }
        const existing = value ? value.split('\n').filter(Boolean) : [];
        onChange([...existing, ...urls].join('\n'));
      } else {
        const url = await uploadFile(files[0]);
        onChange(url);
      }
    } catch (e) {
      setError(e.message || 'Upload failed');
    }
  };

  const previewUrl = !multiple && value ? resolveUploadUrl(value.split('\n')[0]) : '';
  const gallery = multiple && value
    ? value.split('\n').filter(Boolean).map((u) => resolveUploadUrl(u))
    : [];

  return (
    <div className="img-upload">
      <div
        className={`img-upload-drop ${uploading ? 'uploading' : ''}`}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
        onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('drag-over');
          handleFiles(Array.from(e.dataTransfer.files));
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          onChange={(e) => handleFiles(Array.from(e.target.files || []))}
        />
        <div className="img-upload-inner">
          <AdminIcon name="image" size={28} className="img-upload-icon" />
          <p className="img-upload-title">{uploading ? 'Uploading…' : label}</p>
          <p className="img-upload-sub">Drag & drop or click to browse</p>
          {hint && <p className="img-upload-hint">{hint}</p>}
        </div>
      </div>

      {error && <p className="img-upload-error">{error}</p>}

      {!multiple && previewUrl && (
        <div className="img-upload-preview">
          {isVideo ? (
            <video src={previewUrl} controls className="img-upload-media" />
          ) : (
            <img src={previewUrl} alt="Preview" className="img-upload-media" />
          )}
          <button type="button" className="img-upload-remove" onClick={() => onChange('')}>
            <AdminIcon name="trash" size={14} /> Remove
          </button>
        </div>
      )}

      {multiple && gallery.length > 0 && (
        <div className="img-upload-gallery">
          {gallery.map((src, i) => (
            <div key={src + i} className="img-upload-thumb">
              <img src={src} alt="" />
              <button
                type="button"
                className="img-upload-thumb-remove"
                aria-label="Remove"
                onClick={() => {
                  const lines = value.split('\n').filter(Boolean);
                  lines.splice(i, 1);
                  onChange(lines.join('\n'));
                }}
              >
                <AdminIcon name="close" size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="img-upload-url-fallback">
        <label className="img-upload-url-label">Or paste URL</label>
        <input
          type="text"
          className="ac-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or /uploads/..."
        />
      </div>
    </div>
  );
}
