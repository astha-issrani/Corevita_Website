import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme, FONT_OPTIONS, DEFAULT_FONTS, DEFAULT_FONT_SIZES } from '../context/ThemeContext';
import './AdminDashboard.css';
import AdminReviews from './AdminReviews';
import AdminContent from './AdminContent';
import AdminProduct from './AdminProduct';
import AdminBlog from './AdminBlog';
import AdminOverview from './AdminOverview';
import { AdminIcon, NAV_ICONS } from '../components/admin/AdminIcons';

const API = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';
function getToken() { return localStorage.getItem('corevita_token'); }
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

const SUBJECT_LABELS = {
  order: 'Order Status', return: 'Return / Refund',
  product: 'Product Question', subscription: 'Subscription', other: 'Other',
};

const ORDER_STATUS_LABELS = {
  processing: { label: 'Processing', color: '#f59e0b' },
  shipped: { label: 'Shipped', color: '#3b82f6' },
  out_for_delivery: { label: 'Out for Delivery', color: '#8b5cf6' },
  delivered: { label: 'Delivered', color: '#10b981' },
  cancelled: { label: 'Cancelled', color: '#ef4444' },
};

function FontSelect({ label, value, onChange, description }) {
  const categories = [...new Set(FONT_OPTIONS.map(f => f.category))];
  return (
    <div className="font-field">
      <div className="font-field-label">
        <span>{label}</span><small>{description}</small>
      </div>
      <div className="font-select-wrap">
        <select value={value} onChange={e => onChange(e.target.value)} style={{ fontFamily: `'${value}', sans-serif` }}>
          {categories.map(cat => (
            <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
              {FONT_OPTIONS.filter(f => f.category === cat).map(f => (
                <option key={f.value} value={f.value} style={{ fontFamily: `'${f.value}', sans-serif` }}>{f.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="font-preview" style={{ fontFamily: `'${value}', sans-serif` }}>The quick brown fox — CoreVita</div>
      </div>
    </div>
  );
}

function FontSizeField({ label, value, onChange, description, min = 12, max = 72 }) {
  return (
    <div className="font-field">
      <div className="font-field-label">
        <span>{label}</span><small>{description}</small>
      </div>
      <div className="font-size-wrap">
        <input
          type="number"
          className="font-size-input"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <span className="font-size-unit">px</span>
      </div>
    </div>
  );
}

function FontsTab() {
  const { fonts, fontSizes, updateFonts, updateFontSizes, saveFonts, saveFontSizes } = useTheme();
  const [local, setLocal] = useState(fonts);
  const [localSizes, setLocalSizes] = useState(fontSizes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { setLocal(fonts); }, [fonts]);
  useEffect(() => { setLocalSizes(fontSizes); }, [fontSizes]);
  const handleChange = (key, value) => { const u = { ...local, [key]: value }; setLocal(u); updateFonts(u); };
  const handleSizeChange = (key, value) => {
    const u = { ...localSizes, [key]: value };
    setLocalSizes(u);
    updateFontSizes(u);
  };
  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      await Promise.all([saveFonts(local), saveFontSizes(localSizes)]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    catch { setError('Failed to save. Make sure you are logged in as admin.'); }
    finally { setSaving(false); }
  };
  const handleReset = () => {
    setLocal(DEFAULT_FONTS);
    setLocalSizes(DEFAULT_FONT_SIZES);
    updateFonts(DEFAULT_FONTS);
    updateFontSizes(DEFAULT_FONT_SIZES);
  };
  const fontFields = [
    { key: 'heading', label: 'Heading Font', description: 'H1, H2, H3, H4 — product titles, section headers' },
    { key: 'body', label: 'Body / Content Font', description: 'Paragraphs, descriptions, general text' },
    { key: 'card', label: 'Card Font', description: 'Product cards, pack options, info boxes' },
    { key: 'price', label: 'Price Font', description: 'All price displays ($49.99, $44.99 etc.)' },
    { key: 'button', label: 'Button Font', description: 'Add to Cart, Checkout, all CTA buttons' },
    { key: 'nav', label: 'Navigation Font', description: 'Navbar links and logo' },
  ];
  const fontSizeFields = [
    { key: 'heading', label: 'Heading Size', description: 'Product titles and section headings', min: 18, max: 72 },
    { key: 'body', label: 'Content Size', description: 'Paragraphs, descriptions, and list text', min: 12, max: 24 },
  ];
  return (
    <>
      <div className="admin-header">
        <div><h1>Font Settings</h1><p>Changes preview instantly — click Save to apply for all visitors</p></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="refresh-btn" style={{ background: '#f3f4f6', color: '#333' }} onClick={handleReset}>
            <AdminIcon name="reset" size={14} /> Reset Defaults
          </button>
          <button className="refresh-btn" style={{ background: saved ? '#10b981' : '#F5C800', color: saved ? 'white' : '#000', minWidth: 100 }} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : saved ? <><AdminIcon name="check" size={14} /> Saved!</> : 'Save Fonts'}
          </button>
        </div>
      </div>
      {error && <div className="font-error">{error}</div>}
      <div className="fonts-panel">
        <div className="fonts-grid">
          {fontFields.map(({ key, label, description }) => (
            <FontSelect key={key} label={label} description={description} value={local[key] || DEFAULT_FONTS[key]} onChange={(val) => handleChange(key, val)} />
          ))}
          {fontSizeFields.map(({ key, label, description, min, max }) => (
            <FontSizeField
              key={`size-${key}`}
              label={label}
              description={description}
              min={min}
              max={max}
              value={localSizes[key] || DEFAULT_FONT_SIZES[key]}
              onChange={(val) => handleSizeChange(key, val)}
            />
          ))}
        </div>
        <div className="font-live-preview">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-heading)', marginBottom: 12 }}>Live Preview</h3>
          <div className="preview-card">
            <div className="preview-product-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-heading)' }}>CoreVita Bee Pearl Capsules</div>
            <div className="preview-price" style={{ fontFamily: 'var(--font-price)' }}><span className="preview-current">$49.99</span><span className="preview-original">$79.99</span></div>
            <p className="preview-body" style={{ fontFamily: 'var(--font-main)', fontSize: 'var(--font-size-body)' }}>CoreVita Bee Pearl is designed to <strong>restore natural vitality</strong> — naturally supporting your steady energy, recovery, and mental clarity.</p>
            <div className="preview-card-box" style={{ fontFamily: 'var(--font-card)' }}><strong>Buy 1 + Get 1 FREE</strong> — $44.99</div>
            <button className="preview-btn" style={{ fontFamily: 'var(--font-button)' }}>ADD TO CART</button>
            <div className="preview-nav" style={{ fontFamily: 'var(--font-nav)' }}>Shop CoreVita · Contact · Track Your Order</div>
          </div>
        </div>
      </div>
    </>
  );
}

function MessagesTab() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try { const { data } = await axios.get(`${API}/contact`, { headers: authHeaders() }); setMessages(data); }
    catch { navigate('/admin'); } finally { setLoading(false); }
  }, [navigate]);
  useEffect(() => { fetchMessages(); }, [fetchMessages]);
  const markRead = async (id) => {
    try {
      await axios.patch(`${API}/contact/${id}/read`, {}, { headers: authHeaders() });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
      if (selected?._id === id) setSelected(prev => ({ ...prev, read: true }));
    } catch {}
  };
  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try { await axios.delete(`${API}/contact/${id}`, { headers: authHeaders() }); setMessages(prev => prev.filter(m => m._id !== id)); if (selected?._id === id) setSelected(null); } catch {}
  };
  const handleSelect = (msg) => { setSelected(msg); if (!msg.read) markRead(msg._id); };
  const filtered = messages.filter(m => {
    const matchFilter = filter === 'all' || (filter === 'unread' && !m.read) || (filter === 'read' && m.read);
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()) || m.message.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });
  const unreadCount = messages.filter(m => !m.read).length;
  return (
    <>
      <div className="admin-header"><div><h1>Contact Messages</h1><p>{messages.length} total · {unreadCount} unread</p></div><button className="refresh-btn" onClick={fetchMessages}><AdminIcon name="refresh" size={14} /> Refresh</button></div>
      <div className="admin-toolbar">
        <div className="filter-tabs">{['all','unread','read'].map(f=>(<button key={f} className={`filter-tab ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}{f==='unread'&&unreadCount>0&&` (${unreadCount})`}</button>))}</div>
        <div className="admin-search-wrap"><AdminIcon name="search" size={15} className="admin-search-icon-svg" /><input className="admin-search" placeholder="Search messages..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      </div>
      <div className={`admin-content ${selected ? 'has-detail' : ''}`}>
        <div className="message-list">
          {loading?<div className="admin-loading">Loading messages...</div>:filtered.length===0?(<div className="admin-empty"><AdminIcon name="inbox" size={36} className="admin-empty-icon" /><p>No messages found</p></div>):filtered.map(msg=>(
            <div key={msg._id} className={`message-item ${!msg.read?'unread':''} ${selected?._id===msg._id?'active':''}`} onClick={()=>handleSelect(msg)}>
              <div className="message-item-top">
                <div className="message-sender"><div className="sender-avatar">{msg.name.charAt(0).toUpperCase()}</div><div><p className="sender-name">{msg.name}</p><p className="sender-email">{msg.email}</p></div></div>
                <div className="message-meta"><span className="message-date">{new Date(msg.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>{!msg.read&&<span className="unread-dot"/>}</div>
              </div>
              <p className="message-subject">{SUBJECT_LABELS[msg.subject]||msg.subject}</p>
              <p className="message-preview">{msg.message.slice(0,80)}{msg.message.length>80?'...':''}</p>
            </div>
          ))}
        </div>
        <div className="message-detail">
          {selected?(
            <div className="fade-in">
              <button type="button" className="admin-mobile-back" onClick={() => setSelected(null)}>← Back to list</button>
              <div className="detail-header">
                <div className="detail-sender-info"><div className="detail-avatar">{selected.name.charAt(0).toUpperCase()}</div><div><h3>{selected.name}</h3><a href={`mailto:${selected.email}`} className="detail-email">{selected.email}</a></div></div>
                <div className="detail-actions"><a href={`mailto:${selected.email}?subject=Re: ${SUBJECT_LABELS[selected.subject]||selected.subject}`} className="btn-primary reply-btn"><AdminIcon name="reply" size={14} /> Reply</a><button className="delete-btn" onClick={()=>deleteMessage(selected._id)}><AdminIcon name="trash" size={14} /> Delete</button></div>
              </div>
              <div className="detail-meta"><span className="detail-tag">{SUBJECT_LABELS[selected.subject]||selected.subject}</span><span className="detail-time">{new Date(selected.createdAt).toLocaleString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span><span className={`detail-status ${selected.read?'read':'unread'}`}>{selected.read?'Read':'Unread'}</span></div>
              <div className="detail-body"><p>{selected.message}</p></div>
            </div>
          ):(<div className="detail-empty"><AdminIcon name="mail" size={40} className="admin-empty-icon" /><p>Select a message to read it</p></div>)}
        </div>
      </div>
    </>
  );
}

function OrdersTab() {
  const [orders,setOrders]=useState([]);const [loading,setLoading]=useState(true);const [selected,setSelected]=useState(null);const [statusFilter,setStatusFilter]=useState('all');const [search,setSearch]=useState('');const [updatingId,setUpdatingId]=useState(null);const [trackingInput,setTrackingInput]=useState('');
  const fetchOrders=useCallback(async()=>{setLoading(true);try{const params=new URLSearchParams();if(statusFilter!=='all')params.append('status',statusFilter);if(search)params.append('search',search);const{data}=await axios.get(`${API}/orders/admin/all?${params}`,{headers:authHeaders()});setOrders(data.orders||[]);}catch(err){console.error('Failed to fetch orders',err);}finally{setLoading(false);}},[ statusFilter,search]);
  useEffect(()=>{fetchOrders();},[fetchOrders]);
  const updateStatus=async(orderId,newStatus)=>{setUpdatingId(orderId);try{const body={orderStatus:newStatus};if(newStatus==='shipped'&&trackingInput)body.trackingNumber=trackingInput;const{data}=await axios.patch(`${API}/orders/admin/${orderId}/status`,body,{headers:authHeaders()});setOrders(prev=>prev.map(o=>o._id===orderId?data:o));if(selected?._id===orderId)setSelected(data);setTrackingInput('');}catch{alert('Failed to update status');}finally{setUpdatingId(null);}};
  const statusKeys=['all',...Object.keys(ORDER_STATUS_LABELS)];
  return(
    <><div className="admin-header"><div><h1>Orders</h1><p>{orders.length} orders shown</p></div><button className="refresh-btn" onClick={fetchOrders}><AdminIcon name="refresh" size={14} /> Refresh</button></div>
    <div className="admin-toolbar"><div className="filter-tabs">{statusKeys.map(s=>(<button key={s} className={`filter-tab ${statusFilter===s?'active':''}`} onClick={()=>setStatusFilter(s)}>{s==='all'?'All':ORDER_STATUS_LABELS[s].label}</button>))}</div><div className="admin-search-wrap"><AdminIcon name="search" size={15} className="admin-search-icon-svg" /><input className="admin-search" placeholder="Search order #, name, email..." value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
    <div className={`admin-content ${selected ? 'has-detail' : ''}`}><div className="message-list">{loading?<div className="admin-loading">Loading orders...</div>:orders.length===0?<div className="admin-empty"><AdminIcon name="orders" size={36} className="admin-empty-icon" /><p>No orders found</p></div>:orders.map(order=>{const s=ORDER_STATUS_LABELS[order.orderStatus]||{label:order.orderStatus,color:'#888'};return(<div key={order._id} className={`message-item ${selected?._id===order._id?'active':''}`} onClick={()=>setSelected(order)}><div className="message-item-top"><div className="message-sender"><div className="sender-avatar" style={{background:'#F5C800',color:'#000'}}>{(order.shippingAddress?.firstName||'G').charAt(0).toUpperCase()}</div><div><p className="sender-name">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p><p className="sender-email">{order.guestEmail}</p></div></div><div className="message-meta"><span className="message-date">{new Date(order.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span></div></div><div style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}><p className="message-subject" style={{margin:0}}>#{order.orderNumber}</p><span className="order-status-badge" style={{background:s.color+'22',color:s.color,border:`1px solid ${s.color}44`}}>{s.label}</span></div><p className="message-preview">{order.items?.map(i=>i.name).join(', ')} · ${order.total?.toFixed(2)}</p></div>);})}</div>
    <div className="message-detail">{selected?(<div className="fade-in order-detail"><button type="button" className="admin-mobile-back" onClick={() => setSelected(null)}>← Back to orders</button><div className="detail-header"><div className="detail-sender-info"><div className="detail-avatar" style={{background:'#F5C800',color:'#000'}}>{(selected.shippingAddress?.firstName||'G').charAt(0).toUpperCase()}</div><div><h3>{selected.shippingAddress?.firstName} {selected.shippingAddress?.lastName}</h3><a href={`mailto:${selected.guestEmail}`} className="detail-email">{selected.guestEmail}</a></div></div><span className="order-status-badge large" style={{background:(ORDER_STATUS_LABELS[selected.orderStatus]?.color||'#888')+'22',color:ORDER_STATUS_LABELS[selected.orderStatus]?.color||'#888',border:`1px solid ${(ORDER_STATUS_LABELS[selected.orderStatus]?.color||'#888')}44`}}>{ORDER_STATUS_LABELS[selected.orderStatus]?.label||selected.orderStatus}</span></div><div className="order-info-grid"><div className="order-info-card"><h4>Order Info</h4><p><strong>Order #</strong> {selected.orderNumber}</p><p><strong>Date</strong> {new Date(selected.createdAt).toLocaleString()}</p><p><strong>Payment</strong> {selected.paymentStatus}</p>{selected.trackingNumber&&<p><strong>Tracking</strong> {selected.trackingNumber}</p>}</div><div className="order-info-card"><h4>Shipping Address</h4><p>{selected.shippingAddress?.firstName} {selected.shippingAddress?.lastName}</p><p>{selected.shippingAddress?.address}</p><p>{selected.shippingAddress?.city}, {selected.shippingAddress?.state} {selected.shippingAddress?.zipCode}</p><p>{selected.shippingAddress?.country}</p>{selected.shippingAddress?.phone&&<p>{selected.shippingAddress?.phone}</p>}</div></div><div className="order-items-section"><h4>Items Ordered</h4>{selected.items?.map((item,i)=>(<div key={i} className="order-item-row"><span className="order-item-name">{item.name}</span><span className="order-item-pack">{item.packLabel}</span><span className="order-item-qty">×{item.quantity}</span><span className="order-item-price">${(item.price*item.quantity).toFixed(2)}</span></div>))}</div><div className="order-totals-section"><div className="order-total-row"><span>Subtotal</span><span>${selected.subtotal?.toFixed(2)}</span></div>{selected.discount>0&&<div className="order-total-row savings"><span>Pack Discount</span><span>-${selected.discount?.toFixed(2)}</span></div>}<div className="order-total-row"><span>Shipping</span><span>{selected.shipping===0?'FREE':`$${selected.shipping?.toFixed(2)}`}</span></div><div className="order-total-row total"><span>Total</span><span>${selected.total?.toFixed(2)}</span></div></div><div className="order-status-update"><h4>Update Status</h4><div className="status-btn-group">{Object.entries(ORDER_STATUS_LABELS).map(([key,val])=>(<button key={key} className={`status-update-btn ${selected.orderStatus===key?'current':''}`} style={{borderColor:val.color,color:selected.orderStatus===key?'#fff':val.color,background:selected.orderStatus===key?val.color:'transparent'}} onClick={()=>updateStatus(selected._id,key)} disabled={updatingId===selected._id}>{val.label}</button>))}</div><div className="tracking-input-row"><input className="admin-search" style={{flex:1}} placeholder="Tracking number (optional)" value={trackingInput} onChange={e=>setTrackingInput(e.target.value)}/></div></div></div>):<div className="detail-empty"><AdminIcon name="orders" size={40} className="admin-empty-icon" /><p>Select an order to view details</p></div>}</div></div></>
  );
}

function CouponsTab() {
  const [coupons,setCoupons]=useState([]);const [loading,setLoading]=useState(true);const [showForm,setShowForm]=useState(false);const [form,setForm]=useState({code:'',discountType:'percentage',discountValue:'',minOrderAmount:'',maxUses:'',expiresAt:''});const [formError,setFormError]=useState('');const [saving,setSaving]=useState(false);
  useEffect(()=>{fetchCoupons();},[]);
  const fetchCoupons=async()=>{setLoading(true);try{const{data}=await axios.get(`${API}/coupons`,{headers:authHeaders()});setCoupons(data);}catch{}finally{setLoading(false);}};
  const handleCreate=async()=>{if(!form.code||!form.discountValue){setFormError('Code and discount value are required');return;}setSaving(true);setFormError('');try{const body={code:form.code.toUpperCase().trim(),discountType:form.discountType,discountValue:parseFloat(form.discountValue),minOrderAmount:form.minOrderAmount?parseFloat(form.minOrderAmount):0,maxUses:form.maxUses?parseInt(form.maxUses):null,expiresAt:form.expiresAt||null};const{data}=await axios.post(`${API}/coupons`,body,{headers:authHeaders()});setCoupons(prev=>[data,...prev]);setForm({code:'',discountType:'percentage',discountValue:'',minOrderAmount:'',maxUses:'',expiresAt:''});setShowForm(false);}catch(err){setFormError(err.response?.data?.message||'Failed to create coupon');}finally{setSaving(false);}};
  const toggleCoupon=async(id)=>{try{const{data}=await axios.patch(`${API}/coupons/${id}/toggle`,{},{headers:authHeaders()});setCoupons(prev=>prev.map(c=>c._id===id?data:c));}catch{}};
  const deleteCoupon=async(id)=>{if(!window.confirm('Delete this coupon?'))return;try{await axios.delete(`${API}/coupons/${id}`,{headers:authHeaders()});setCoupons(prev=>prev.filter(c=>c._id!==id));}catch{}};
  return(
    <><div className="admin-header"><div><h1>Coupon Codes</h1><p>{coupons.length} coupons · {coupons.filter(c=>c.isActive).length} active</p></div><button className="refresh-btn" style={{background:'#F5C800',color:'#000',fontWeight:700}} onClick={()=>setShowForm(s=>!s)}>{showForm?<><AdminIcon name="close" size={14} /> Cancel</>:<>+ New Coupon</>}</button></div>
    {showForm&&(<div className="coupon-form-card fade-in"><h3>Create New Coupon</h3><div className="coupon-form-grid"><div className="form-group"><label>Code *</label><input placeholder="e.g. SAVE20" value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})}/></div><div className="form-group"><label>Discount Type</label><select value={form.discountType} onChange={e=>setForm({...form,discountType:e.target.value})}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed Amount ($)</option></select></div><div className="form-group"><label>Discount Value *</label><input type="number" min="0" value={form.discountValue} onChange={e=>setForm({...form,discountValue:e.target.value})}/></div><div className="form-group"><label>Min Order Amount ($)</label><input type="number" min="0" placeholder="0 = no minimum" value={form.minOrderAmount} onChange={e=>setForm({...form,minOrderAmount:e.target.value})}/></div><div className="form-group"><label>Max Uses</label><input type="number" min="1" placeholder="Leave blank for unlimited" value={form.maxUses} onChange={e=>setForm({...form,maxUses:e.target.value})}/></div><div className="form-group"><label>Expiry Date</label><input type="date" value={form.expiresAt} onChange={e=>setForm({...form,expiresAt:e.target.value})}/></div></div>{formError&&<p className="coupon-error">{formError}</p>}<button className="btn-primary" onClick={handleCreate} disabled={saving}>{saving?'Creating...':'Create Coupon'}</button></div>)}
    {loading?<div className="admin-loading">Loading coupons...</div>:coupons.length===0?<div className="admin-empty"><AdminIcon name="coupons" size={36} className="admin-empty-icon" /><p>No coupons yet. Create one!</p></div>:(<div className="coupons-table-wrap"><table className="coupons-table"><thead><tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Uses</th><th>Expires</th><th>Status</th><th>Actions</th></tr></thead><tbody>{coupons.map(c=>(<tr key={c._id} className={!c.isActive?'coupon-inactive':''}><td><strong className="coupon-code-cell">{c.code}</strong></td><td>{c.discountType==='percentage'?`${c.discountValue}% off`:`$${c.discountValue.toFixed(2)} off`}</td><td>{c.minOrderAmount>0?`$${c.minOrderAmount.toFixed(2)}`:'—'}</td><td>{c.usedCount}{c.maxUses?` / ${c.maxUses}`:''}</td><td>{c.expiresAt?new Date(c.expiresAt).toLocaleDateString():'—'}</td><td><span className={`coupon-status-badge ${c.isActive?'active':'inactive'}`}>{c.isActive?'Active':'Inactive'}</span></td><td><div className="coupon-actions"><button className="coupon-toggle-btn" onClick={()=>toggleCoupon(c._id)}>{c.isActive?'Disable':'Enable'}</button><button className="coupon-delete-btn" onClick={()=>deleteCoupon(c._id)} aria-label="Delete"><AdminIcon name="trash" size={15} /></button></div></td></tr>))}</tbody></table></div>)}</>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const admin = JSON.parse(localStorage.getItem('corevita_admin') || '{}');

  useEffect(() => {
    if (!getToken() || !admin.isAdmin) navigate('/admin');
  }, [navigate, admin.isAdmin]); // eslint-disable-line

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileNavOpen]);

  const handleLogout = () => {
    localStorage.removeItem('corevita_token');
    localStorage.removeItem('corevita_admin');
    navigate('/admin');
  };

  const selectTab = (key) => {
    setActiveTab(key);
    setMobileNavOpen(false);
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'orders',   label: 'Orders' },
    { key: 'messages', label: 'Messages' },
    { key: 'coupons',  label: 'Coupons' },
    { key: 'fonts',    label: 'Fonts' },
    { key: 'reviews',  label: 'Reviews' },
    { key: 'content',  label: 'Page Content' },
    { key: 'product',  label: 'Product' },
    { key: 'blog',     label: 'Blog' },
  ];

  const activeLabel = navItems.find((n) => n.key === activeTab)?.label || 'Admin';
  const filteredNav = navItems.filter((n) =>
    !sidebarSearch || n.label.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  return (
    <div className={`admin-page ${mobileNavOpen ? 'admin-nav-open' : ''}`}>
      <header className="admin-mobile-topbar">
        <button
          type="button"
          className="admin-menu-btn"
          onClick={() => setMobileNavOpen((o) => !o)}
          aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileNavOpen ? <AdminIcon name="close" size={20} /> : <AdminIcon name="menu" size={20} />}
        </button>
        <span className="admin-mobile-title">{activeLabel}</span>
        <button type="button" className="admin-mobile-logout" onClick={handleLogout}>Sign out</button>
      </header>

      <div
        className="admin-sidebar-overlay"
        role="presentation"
        onClick={() => setMobileNavOpen(false)}
      />

      <aside className={`admin-sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-brand-icon">C</div>
          <span className="admin-sidebar-logo">CoreVita</span>
        </div>
        <div className="admin-sidebar-search">
          <AdminIcon name="search" size={15} className="admin-search-icon-svg" />
          <input
            type="text"
            placeholder="Search..."
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
          />
        </div>
        <nav className="admin-nav">
          <p className="admin-nav-section">Main Menu</p>
          {filteredNav.map(({ key, label }) => (
            <div key={key} className={`admin-nav-item ${activeTab === key ? 'active' : ''}`} onClick={() => selectTab(key)}>
              <span className="admin-nav-icon"><AdminIcon name={NAV_ICONS[key]} size={17} /></span> {label}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">A</div>
            <div><p>{admin.email}</p><small>Administrator</small></div>
          </div>
          <button className="logout-btn" onClick={handleLogout}><AdminIcon name="logout" size={14} /> Sign Out</button>
        </div>
      </aside>
      <main className="admin-main">
        {activeTab === 'dashboard' && <AdminOverview adminEmail={admin.email} />}
        {activeTab === 'orders'   && <OrdersTab />}
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'coupons'  && <CouponsTab />}
        {activeTab === 'fonts'    && <FontsTab />}
        {activeTab === 'reviews'  && <AdminReviews />}
        {activeTab === 'content'  && <AdminContent />}
        {activeTab === 'product'  && <AdminProduct />}
        {activeTab === 'blog'     && <AdminBlog />}
      </main>
    </div>
  );
}