export type ThemeMode = "executive" | "jungle";

export type ContentType = "book" | "comic" | "podcast";

export interface Book {
  id: string;
  slug: string;
  type: "book";
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  rating?: number;
  pageCount: number;
  previewPageLimit: number; // strictly 10
  publishedAt: string;
  featured?: boolean;
  isNew?: boolean;
  tableOfContents?: { title: string; page: number }[];
  pages?: { pageNumber: number; title?: string; text?: string; imageUrl?: string }[];
}

export interface Comic {
  id: string;
  slug: string;
  type: "comic";
  title: string;
  creator: string;
  illustrator?: string;
  coverUrl: string;
  description: string;
  category: string;
  genre: string;
  price: number;
  pageCount: number;
  previewPageLimit: number; // strictly 10
  publishedAt: string;
  featured?: boolean;
  isNew?: boolean;
  aspectRatio?: string;
  pages?: { pageNumber: number; imageUrl: string; panelDescription?: string }[];
}

export interface PodcastEpisode {
  id: string;
  seriesId: string;
  episodeNumber: number;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoStreamUrl?: string;
  isFree: boolean; // Episode 1 is true, subsequent episodes false
  price: number;
  releaseDate: string;
}

export interface PodcastSeries {
  id: string;
  slug: string;
  type: "podcast";
  title: string;
  host: string;
  coverUrl: string;
  description: string;
  category: string;
  episodeCount: number;
  episodes: PodcastEpisode[];
  publishedAt: string;
  featured?: boolean;
  isNew?: boolean;
}

export type ContentItem = Book | Comic | PodcastSeries;

export type UserRole =
  | "super_admin"
  | "content_manager"
  | "support_agent"
  | "finance_manager"
  | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  themePreference: ThemeMode;
  createdAt: string;
  status: "active" | "suspended";
}

export interface Entitlement {
  id: string;
  userId: string;
  contentId: string;
  contentType: "book" | "comic" | "podcast_episode" | "podcast_series";
  grantedAt: string;
  verifiedBackendSignature: string;
}

export type OrderStatus =
  | "ready_to_pay"
  | "processing"
  | "payment_successful"
  | "payment_failed"
  | "payment_pending"
  | "verification_in_progress"
  | "refund_requested"
  | "refunded";

export interface OrderItem {
  id: string;
  contentId: string;
  contentType: ContentType | "podcast_episode";
  title: string;
  unitPrice: number;
  coverUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  verifiedAt?: string;
  refundReason?: string;
}

export interface ReadingProgress {
  contentId: string;
  currentPage: number;
  totalPages: number;
  lastReadAt: string;
  completed: boolean;
}

export interface WatchProgress {
  episodeId: string;
  seriesId: string;
  currentTimeSeconds: number;
  durationSeconds: number;
  lastWatchedAt: string;
  completed: boolean;
}

export interface BookmarkItem {
  id: string;
  contentId: string;
  contentType: ContentType;
  title: string;
  creatorOrAuthor: string;
  coverUrl: string;
  price: number;
  savedAt: string;
}

export interface AuditLog {
  id: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  targetRecord: string;
  timestamp: string;
  result: "SUCCESS" | "FAILED" | "PENDING";
  metadata?: Record<string, unknown>;
}

export interface RevenueMetric {
  date: string;
  grossSales: number;
  netSales: number;
  refunds: number;
  orderCount: number;
}
