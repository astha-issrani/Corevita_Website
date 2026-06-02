import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  Cell, PieChart, Pie,
} from 'recharts';
import { AdminIcon } from '../components/admin/AdminIcons';
import './AdminOverview.css';

const API = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('corevita_token')}` });

const CHART_COLORS = ['#111111', '#444444', '#666666', '#888888', '#aaaaaa', '#cccccc'];

function ChangeBadge({ value }) {
  if (value === 0 || value == null) return <span className="dash-change neutral">—</span>;
  const positive = value > 0;
  return (
    <span className={`dash-change ${positive ? 'up' : 'down'}`}>
      {positive ? '↑' : '↓'} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function MetricCard({ title, value, change, chart, chartType = 'area', color = '#444444' }) {
  const renderChart = () => {
    if (!chart || chart.length === 0) return null;
    const dataKey = chart[0].revenue != null ? 'revenue' : chart[0].value != null ? 'value' : 'count';
    const common = { data: chart, margin: { top: 4, right: 0, left: 0, bottom: 0 } };

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={64}>
          <BarChart {...common}>
            <Bar dataKey={dataKey} radius={[3, 3, 0, 0]}>
              {chart.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }
    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={64}>
          <LineChart {...common}>
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
    return (
      <ResponsiveContainer width="100%" height={64}>
        <AreaChart {...common}>
          <defs>
            <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#grad-${title})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="dash-metric-card">
      <div className="dash-metric-top">
        <span className="dash-metric-title">{title}</span>
        <ChangeBadge value={change} />
      </div>
      <div className="dash-metric-value">{value}</div>
      <div className="dash-metric-chart">{renderChart()}</div>
    </div>
  );
}

function WideChartCard({ title, subtitle, children }) {
  return (
    <div className="dash-wide-card">
      <div className="dash-wide-header">
        <h4>{title}</h4>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="dash-wide-body">{children}</div>
    </div>
  );
}

export default function AdminOverview({ adminEmail, adminName }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('year');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/admin/stats`, { headers: authHeaders() });
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const displayName = adminName || (adminEmail ? adminEmail.split('@')[0] : 'Admin');
  const initials = displayName.charAt(0).toUpperCase();

  const formatCurrency = (n) => '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formatCurrencyDec = (n) => '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (loading) {
    return <div className="dash-loading">Loading dashboard...</div>;
  }

  const s = stats || {};

  const orderStatusData = (s.orderStatus || []).map((item, i) => ({
    ...item,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const messageData = (s.messageBreakdown || []).slice(0, 4);

  const leadCategories = (s.orderStatus || []).slice(0, 3);
  const leadTotal = leadCategories.reduce((sum, l) => sum + l.count, 0);

  return (
    <div className="dash-overview">
      {/* Top bar */}
      <header className="dash-topbar">
        <div className="dash-greeting">
          <h1>Welcome back, {displayName}</h1>
        </div>
        <div className="dash-topbar-actions">
          <button type="button" className="dash-icon-btn" aria-label="Search"><AdminIcon name="search" size={16} /></button>
          <button type="button" className="dash-icon-btn dash-notif" aria-label="Notifications">
            <AdminIcon name="bell" size={16} />
            {(s.messagesUnread || 0) > 0 && <span className="dash-notif-dot" />}
          </button>
          <div className="dash-user-chip">
            <div className="dash-user-avatar">{initials}</div>
            <div className="dash-user-meta">
              <span className="dash-user-name">{displayName}</span>
              <span className="dash-user-email">{adminEmail}</span>
            </div>
            <span className="dash-user-chevron">▾</span>
          </div>
        </div>
      </header>

      <div className="dash-scroll">
        {/* Section 1 */}
        <section className="dash-section">
          <div className="dash-section-header">
            <div>
              <h2>Sales &amp; Business Overview</h2>
              <p>Track revenue, orders, and store performance at a glance.</p>
            </div>
            <div className="dash-section-actions">
              <select className="dash-range-select" value={range} onChange={(e) => setRange(e.target.value)}>
                <option value="year">This Year</option>
                <option value="month">This Month</option>
                <option value="week">This Week</option>
              </select>
              <button type="button" className="dash-add-btn" onClick={fetchStats}><AdminIcon name="refresh" size={14} /> Refresh</button>
            </div>
          </div>

          <div className="dash-metrics-grid">
            <MetricCard
              title="Total Sales Revenue"
              value={formatCurrency(s.totalRevenue)}
              change={s.revenueChange}
              chart={s.revenueChart}
              chartType="area"
              color="#111111"
            />
            <MetricCard
              title="Total Orders"
              value={(s.totalOrders || 0).toLocaleString()}
              change={s.ordersChange}
              chart={s.revenueChart?.map((d) => ({ count: d.orders }))}
              chartType="bar"
            />
            <MetricCard
              title="Avg Order Value"
              value={formatCurrencyDec(s.avgOrderValue)}
              change={null}
              chart={s.dailyRevenue?.slice(-14)}
              chartType="line"
              color="#444444"
            />
            <MetricCard
              title="Active Coupons"
              value={(s.activeCoupons || 0).toLocaleString()}
              change={null}
              chart={s.dailyRevenue?.slice(-10)?.map((d, i) => ({ value: (s.activeCoupons || 0) + (i % 3) }))}
              chartType="line"
              color="#666666"
            />
          </div>

          <div className="dash-wide-grid">
            <WideChartCard title="Revenue Growth Pattern" subtitle="Monthly revenue trend">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={s.revenueChart || []} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#111111" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#111111" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
                  <Tooltip formatter={(v) => [formatCurrency(v), 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #eee', fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#111111" fill="url(#revenueGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </WideChartCard>

            <WideChartCard title="Order Distribution" subtitle="Orders by fulfillment status">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={orderStatusData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="status" tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #eee', fontSize: 12 }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {orderStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </WideChartCard>

            <WideChartCard title="Daily Revenue" subtitle="Last 30 days">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={s.dailyRevenue || []} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [formatCurrencyDec(v), 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #eee', fontSize: 12 }} />
                  <Line type="monotone" dataKey="value" stroke="#444444" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </WideChartCard>

            <WideChartCard title="Monthly Orders" subtitle="Order volume by month">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={s.revenueChart || []} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #eee', fontSize: 12 }} />
                  <Bar dataKey="orders" fill="#666666" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </WideChartCard>
          </div>
        </section>

        {/* Section 2 */}
        <section className="dash-section">
          <div className="dash-section-header">
            <div>
              <h2>Store Performance &amp; Operations</h2>
              <p>Monitor messages, reviews, and order pipeline health.</p>
            </div>
          </div>

          <div className="dash-metrics-grid">
            <div className="dash-metric-card dash-progress-card">
              <div className="dash-metric-top">
                <span className="dash-metric-title">Delivered Order Rate</span>
              </div>
              <div className="dash-metric-value">
                {s.totalOrders > 0
                  ? Math.round(((s.orderStatus?.find((o) => o.status === 'Delivered')?.count || 0) / s.totalOrders) * 100)
                  : 0}%
              </div>
              <div className="dash-progress-bar">
                <div
                  className="dash-progress-fill blue"
                  style={{
                    width: `${s.totalOrders > 0 ? ((s.orderStatus?.find((o) => o.status === 'Delivered')?.count || 0) / s.totalOrders) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="dash-metric-card">
              <div className="dash-metric-top">
                <span className="dash-metric-title">Customer Messages</span>
              </div>
              <div className="dash-metric-value">{(s.messagesTotal || 0).toLocaleString()}</div>
              <div className="dash-block-grid">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={`dash-block ${i < (s.messagesUnread || 0) % 12 ? 'active' : ''}`} />
                ))}
              </div>
              <p className="dash-sub-stat">{s.messagesUnread || 0} unread</p>
            </div>

            <div className="dash-metric-card dash-leads-card">
              <div className="dash-metric-top">
                <span className="dash-metric-title">Order Pipeline</span>
              </div>
              <div className="dash-metric-value">{leadTotal.toLocaleString()}</div>
              <div className="dash-leads-list">
                {leadCategories.map((lead, i) => (
                  <div key={i} className="dash-lead-row">
                    <span className="dash-lead-label">{lead.status}</span>
                    <div className="dash-lead-bar-wrap">
                      <div
                        className="dash-lead-bar"
                        style={{ width: `${leadTotal > 0 ? (lead.count / leadTotal) * 100 : 0}%`, background: CHART_COLORS[i] }}
                      />
                    </div>
                    <span className="dash-lead-count">{lead.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dash-metric-card">
              <div className="dash-metric-top">
                <span className="dash-metric-title">Review Status</span>
              </div>
              <div className="dash-metric-value">{(s.reviewsTotal || 0).toLocaleString()}</div>
              <ResponsiveContainer width="100%" height={80}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Approved', value: (s.reviewsTotal || 0) - (s.reviewsPending || 0) },
                      { name: 'Pending', value: s.reviewsPending || 0 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={22}
                    outerRadius={36}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#888888" />
                    <Cell fill="#444444" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <p className="dash-sub-stat">{s.reviewsPending || 0} pending approval</p>
            </div>
          </div>

          <div className="dash-wide-grid">
            <WideChartCard title="Message Categories" subtitle="Contact form breakdown">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={messageData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #eee', fontSize: 12 }} />
                  <Bar dataKey="count" fill="#111111" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </WideChartCard>

            <WideChartCard title="Revenue vs Orders" subtitle="Monthly comparison">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={s.revenueChart || []} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #eee', fontSize: 12 }} />
                  <Bar yAxisId="left" dataKey="revenue" fill="#111111" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar yAxisId="right" dataKey="orders" fill="#444444" radius={[4, 4, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </WideChartCard>

            <WideChartCard title="This Month Revenue" subtitle={formatCurrency(s.monthRevenue)}>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={s.dailyRevenue?.slice(-14) || []} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="monthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#888888" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#888888" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [formatCurrencyDec(v), 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #eee', fontSize: 12 }} />
                  <Area type="monotone" dataKey="value" stroke="#888888" fill="url(#monthGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </WideChartCard>

            <WideChartCard title="Paid Orders" subtitle={`${s.paidOrders || 0} of ${s.totalOrders || 0} total`}>
              <div className="dash-paid-summary">
                <div className="dash-paid-ring">
                  <svg viewBox="0 0 36 36" className="dash-ring-svg">
                    <path
                      className="dash-ring-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="dash-ring-fill"
                      strokeDasharray={`${s.totalOrders > 0 ? (s.paidOrders / s.totalOrders) * 100 : 0}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="dash-ring-label">
                    {s.totalOrders > 0 ? Math.round((s.paidOrders / s.totalOrders) * 100) : 0}%
                  </span>
                </div>
                <div className="dash-paid-legend">
                  <div><span className="dot green" /> Paid: {s.paidOrders || 0}</div>
                  <div><span className="dot gray" /> Other: {(s.totalOrders || 0) - (s.paidOrders || 0)}</div>
                </div>
              </div>
            </WideChartCard>
          </div>
        </section>
      </div>
    </div>
  );
}
