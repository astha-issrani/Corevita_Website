import React from 'react';
import {
  LayoutDashboard,
  Package,
  Mail,
  Tag,
  Type,
  Star,
  FileEdit,
  ShoppingBag,
  Newspaper,
  Search,
  Menu,
  X,
  RefreshCw,
  RotateCcw,
  Check,
  Trash2,
  Reply,
  Inbox,
  MailOpen,
  Plus,
  Home,
  FileText,
  Image,
  ClipboardList,
  Pill,
  Lightbulb,
  Lock,
  ChevronDown,
  ChevronRight,
  Bell,
  LogOut,
} from 'lucide-react';

const ICON_SIZE = 18;
const ICON_STROKE = 1.75;

export function AdminIcon({ name, size = ICON_SIZE, strokeWidth = ICON_STROKE, className = '' }) {
  const props = { size, strokeWidth, className: `admin-icon ${className}`.trim(), 'aria-hidden': true };
  const map = {
    dashboard: LayoutDashboard,
    orders: Package,
    messages: Mail,
    coupons: Tag,
    fonts: Type,
    reviews: Star,
    content: FileEdit,
    product: ShoppingBag,
    blog: Newspaper,
    search: Search,
    menu: Menu,
    close: X,
    refresh: RefreshCw,
    reset: RotateCcw,
    check: Check,
    trash: Trash2,
    reply: Reply,
    inbox: Inbox,
    mail: MailOpen,
    plus: Plus,
    home: Home,
    file: FileText,
    image: Image,
    clipboard: ClipboardList,
    pill: Pill,
    tip: Lightbulb,
    lock: Lock,
    chevronDown: ChevronDown,
    chevronRight: ChevronRight,
    bell: Bell,
    logout: LogOut,
  };
  const Icon = map[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}

export const NAV_ICONS = {
  dashboard: 'dashboard',
  orders: 'orders',
  messages: 'messages',
  coupons: 'coupons',
  fonts: 'fonts',
  reviews: 'reviews',
  content: 'content',
  product: 'product',
  blog: 'blog',
};
