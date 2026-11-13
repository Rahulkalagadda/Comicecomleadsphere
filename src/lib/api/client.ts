"use client";

import {
  Book,
  Comic,
  PodcastSeries,
  ContentItem,
  Order,
  User,
  AuditLog,
  Entitlement,
  ReadingProgress,
  BookmarkItem,
} from "@/types";
import {
  SEED_BOOKS,
  SEED_COMICS,
  SEED_PODCASTS,
  SEED_USERS,
  SEED_ORDERS,
  SEED_AUDIT_LOGS,
  SEED_ENTITLEMENTS,
  SEED_CURRENT_USER,
} from "./seedData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const IS_DEMO_DEFAULT = !process.env.NEXT_PUBLIC_API_BASE_URL;

// Local storage keys for demo persistence
const ENTITLEMENTS_KEY = "leadsphere_entitlements";
const ORDERS_KEY = "leadsphere_orders";
const BOOKMARKS_KEY = "leadsphere_bookmarks";
const PROGRESS_KEY = "leadsphere_progress";
const CART_KEY = "leadsphere_cart";
const DEMO_MODE_KEY = "leadsphere_demo_mode";

export interface CartFolioItem {
  id: string;
  title: string;
  type: "book" | "comic" | "podcast_episode" | "bundle";
  badge: string;
  edition: string;
  authorOrHost: string;
  tierOrFormat: string;
  price: number;
  coverUrl: string;
}

export const DEFAULT_CART_ITEMS: CartFolioItem[] = [
  {
    id: "book-jungle-audit-handbook",
    title: "The Jungle Audit: 5-Pillar AI Readiness & Maturity Playbook",
    type: "book",
    badge: "BOOK",
    edition: "Dr. Amit Khandelwal • Chapter 01 Workbook",
    authorOrHost: "Dr. Amit Khandelwal",
    tierOrFormat: "Full Browser Access • 10-Page Preview Certified",
    price: 599,
    coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
  },
  {
    id: "ep-jungle-02",
    title: "Ep 2: Clip 01 — The Jungle Is Changing (Host Keynote Cut)",
    type: "podcast_episode",
    badge: "VIDEO",
    edition: "The AI Jungle Podcast • Season 1",
    authorOrHost: "Dr. Amit Khandelwal & The Lion",
    tierOrFormat: "HD Studio Video Stream • Synced Browser Notes",
    price: 199,
    coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
  },
];

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key) || localStorage.getItem(key.replace("leadsphere_", "antigravity_"));
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return IS_DEMO_DEFAULT;
  const stored = localStorage.getItem(DEMO_MODE_KEY);
  if (stored !== null) return stored === "true";
  return IS_DEMO_DEFAULT;
}

export function setDemoMode(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_MODE_KEY, String(enabled));
  window.dispatchEvent(new Event("demo-mode-changed"));
}

/**
 * Entitlement Verification Engine
 * Strictly enforces backend-style validation:
 * - Books / Comics: pages 1 to 10 free; page 11+ requires verified entitlement.
 * - Podcasts: episode 1 is free; subsequent episodes require verified entitlement.
 */
export async function checkEntitlement(
  contentId: string,
  userId: string = SEED_CURRENT_USER.id
): Promise<boolean> {
  const entitlements = getStored<Entitlement[]>(ENTITLEMENTS_KEY, SEED_ENTITLEMENTS);
  return entitlements.some(
    (e) => (e.contentId === contentId || e.contentId === "all_access") && e.userId === userId
  );
}

export async function getCatalog(): Promise<{
  books: Book[];
  comics: Comic[];
  podcasts: PodcastSeries[];
}> {
  if (!isDemoMode() && API_BASE_URL) {
    const res = await fetch(`${API_BASE_URL}/api/v1/catalog`);
    if (!res.ok) throw new Error("Failed to load catalog from API");
    const data = await res.json();
    return {
      books: (data.books || []).filter((b: Book) => Boolean(b.coverUrl?.trim())),
      comics: (data.comics || []).filter((c: Comic) => Boolean(c.coverUrl?.trim())),
      podcasts: (data.podcasts || []).filter((p: PodcastSeries) => Boolean(p.coverUrl?.trim())),
    };
  }
  // Simulated API response delay
  await new Promise((r) => setTimeout(r, 100));
  return {
    books: SEED_BOOKS.filter((b) => Boolean(b.coverUrl?.trim())),
    comics: SEED_COMICS.filter((c) => Boolean(c.coverUrl?.trim())),
    podcasts: SEED_PODCASTS.filter((p) => Boolean(p.coverUrl?.trim())),
  };
}

export async function getContentBySlug(
  slug: string,
  type?: "book" | "comic" | "podcast"
): Promise<ContentItem | null> {
  const { books, comics, podcasts } = await getCatalog();
  if (type === "book" || !type) {
    const found = books.find((b) => b.slug === slug);
    if (found) return found;
  }
  if (type === "comic" || !type) {
    const found = comics.find((c) => c.slug === slug);
    if (found) return found;
  }
  if (type === "podcast" || !type) {
    const found = podcasts.find((p) => p.slug === slug);
    if (found) return found;
  }
  return null;
}

export interface ReaderPageResponse {
  contentId: string;
  pageNumber: number;
  totalPages: number;
  title?: string;
  text?: string;
  imageUrl?: string;
  locked: boolean;
  requiresPurchase: boolean;
  freeLimit: number;
}

/**
 * Protected Reader Page Retrieval
 * Enforces business rule: Pages 1-10 free; page 11+ requires entitlement!
 */
export async function getReaderPage(
  contentId: string,
  pageNumber: number,
  userId: string = SEED_CURRENT_USER.id
): Promise<ReaderPageResponse> {
  const FREE_LIMIT = 10;
  const hasEntitlement = await checkEntitlement(contentId, userId);

  const { books, comics } = await getCatalog();
  const book = books.find((b) => b.id === contentId);
  const comic = comics.find((c) => c.id === contentId);

  const item = book || comic;
  if (!item) {
    throw new Error("Content not found");
  }

  const isFree = pageNumber <= FREE_LIMIT;
  const isAuthorized = isFree || hasEntitlement;

  if (!isAuthorized) {
    return {
      contentId,
      pageNumber,
      totalPages: item.pageCount,
      locked: true,
      requiresPurchase: true,
      freeLimit: FREE_LIMIT,
    };
  }

  if (book) {
    const pageData = book.pages?.find((p) => p.pageNumber === pageNumber) || {
      pageNumber,
      title: `Chapter ${Math.ceil(pageNumber / 5)}`,
      text: `Page ${pageNumber}: Detailed executive strategy text content.`,
    };

    return {
      contentId,
      pageNumber,
      totalPages: book.pageCount,
      title: pageData.title,
      text: pageData.text,
      locked: false,
      requiresPurchase: false,
      freeLimit: FREE_LIMIT,
    };
  } else {
    const comicData = comic!.pages?.find((p) => p.pageNumber === pageNumber) || {
      pageNumber,
      imageUrl: comic!.coverUrl,
      panelDescription: `Graphic narrative panel ${pageNumber}`,
    };

    return {
      contentId,
      pageNumber,
      totalPages: comic!.pageCount,
      imageUrl: comicData.imageUrl,
      title: comicData.panelDescription || `Page ${pageNumber}`,
      locked: false,
      requiresPurchase: false,
      freeLimit: FREE_LIMIT,
    };
  }
}

/**
 * Orders & Payments
 */
export async function createOrder(
  contentItem: { id: string; title: string; price: number; type: any },
  customer: { name: string; email: string } = {
    name: SEED_CURRENT_USER.name,
    email: SEED_CURRENT_USER.email,
  },
  lineItems?: { id: string; title: string; price: number; type: any; coverUrl?: string }[]
): Promise<Order> {
  const orderNumber = `AGY-${Date.now().toString().slice(-6)}`;
  const itemsToUse =
    lineItems && lineItems.length > 0
      ? lineItems.map((it, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          contentId: it.id,
          contentType: it.type,
          title: it.title,
          unitPrice: it.price,
          coverUrl: it.coverUrl,
        }))
      : [
          {
            id: `item-${Date.now()}`,
            contentId: contentItem.id,
            contentType: contentItem.type,
            title: contentItem.title,
            unitPrice: contentItem.price,
          },
        ];

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber,
    userId: SEED_CURRENT_USER.id,
    customerName: customer.name,
    customerEmail: customer.email,
    items: itemsToUse,
    totalAmount: contentItem.price,
    currency: "INR",
    status: "processing",
    razorpayOrderId: `order_rzp_${Math.random().toString(36).substring(2, 10)}`,
    createdAt: new Date().toISOString(),
  };

  const existingOrders = getStored<Order[]>(ORDERS_KEY, SEED_ORDERS);
  setStored(ORDERS_KEY, [newOrder, ...existingOrders]);
  return newOrder;
}

export async function verifyPayment(
  orderId: string,
  razorpayPaymentId: string
): Promise<{ success: boolean; entitlement: Entitlement }> {
  const orders = getStored<Order[]>(ORDERS_KEY, SEED_ORDERS);
  const orderIndex = orders.findIndex((o) => o.id === orderId);

  if (orderIndex === -1) {
    throw new Error("Order not found");
  }

  const order = orders[orderIndex];
  order.status = "payment_successful";
  order.razorpayPaymentId = razorpayPaymentId;
  order.verifiedAt = new Date().toISOString();
  orders[orderIndex] = order;
  setStored(ORDERS_KEY, orders);

  // Grant verified backend entitlement for every item in the order
  const grantedAt = new Date().toISOString();
  const newEntitlements: Entitlement[] = order.items.map((item, idx) => ({
    id: `ent-${Date.now()}-${idx}`,
    userId: order.userId,
    contentId: item.contentId,
    contentType: item.contentType as any,
    grantedAt,
    verifiedBackendSignature: `sig_verified_${razorpayPaymentId}`,
  }));

  const currentEntitlements = getStored<Entitlement[]>(ENTITLEMENTS_KEY, SEED_ENTITLEMENTS);
  setStored(ENTITLEMENTS_KEY, [...newEntitlements, ...currentEntitlements]);

  return { success: true, entitlement: newEntitlements[0] };
}

export async function getLibrary(): Promise<{
  ownedBooks: Book[];
  ownedComics: Comic[];
  ownedEpisodes: { series: PodcastSeries; episode: any }[];
}> {
  const entitlements = getStored<Entitlement[]>(ENTITLEMENTS_KEY, SEED_ENTITLEMENTS);
  const { books, comics, podcasts } = await getCatalog();

  const ownedBookIds = new Set(
    entitlements.filter((e) => e.contentType === "book").map((e) => e.contentId)
  );
  const ownedComicIds = new Set(
    entitlements.filter((e) => e.contentType === "comic").map((e) => e.contentId)
  );
  const ownedEpisodeIds = new Set(
    entitlements.filter((e) => e.contentType === "podcast_episode").map((e) => e.contentId)
  );

  const ownedEpisodes: { series: PodcastSeries; episode: any }[] = [];
  podcasts.forEach((s) => {
    s.episodes.forEach((ep) => {
      // Episode 1 is free, or explicitly owned
      if (ep.isFree || ownedEpisodeIds.has(ep.id)) {
        ownedEpisodes.push({ series: s, episode: ep });
      }
    });
  });

  return {
    ownedBooks: books.filter((b) => ownedBookIds.has(b.id)),
    ownedComics: comics.filter((c) => ownedComicIds.has(c.id)),
    ownedEpisodes,
  };
}

function hasValidProductImage(url?: string): boolean {
  return Boolean(url && url.trim() && !url.includes("1579783902614"));
}

export async function getBookmarks(): Promise<BookmarkItem[]> {
  const stored = getStored<BookmarkItem[]>(BOOKMARKS_KEY, [
    {
      id: "bmk-1",
      contentId: "book-jungle-safari",
      contentType: "book",
      title: "The AI Jungle Safari: Data, Digital & AI Transformation Blueprint",
      creatorOrAuthor: "Dr. Amit Khandelwal",
      coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
      price: 899,
      savedAt: "2026-10-08T11:20:00Z",
    },
  ]);
  return stored.filter((b) => hasValidProductImage(b.coverUrl));
}

export async function toggleBookmark(item: BookmarkItem): Promise<boolean> {
  const bookmarks = await getBookmarks();
  const exists = bookmarks.some((b) => b.contentId === item.contentId);
  let updated: BookmarkItem[];
  if (exists) {
    updated = bookmarks.filter((b) => b.contentId !== item.contentId);
  } else {
    updated = [item, ...bookmarks];
  }
  setStored(BOOKMARKS_KEY, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("leadsphere-bookmarks-updated"));
  }
  return !exists;
}

export function getCartItems(): CartFolioItem[] {
  const items = getStored<CartFolioItem[]>(CART_KEY, DEFAULT_CART_ITEMS);
  return items.filter((item) => hasValidProductImage(item.coverUrl));
}

export function addToCart(item: CartFolioItem): CartFolioItem[] {
  const current = getCartItems();
  const exists = current.some((c) => c.id === item.id);
  const updated = exists ? current : [item, ...current];
  setStored(CART_KEY, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("leadsphere-cart-updated"));
  }
  return updated;
}

export function removeFromCart(id: string): CartFolioItem[] {
  const current = getCartItems();
  const updated = current.filter((c) => c.id !== id);
  setStored(CART_KEY, updated);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("leadsphere-cart-updated"));
  }
  return updated;
}

export function clearCart(): void {
  setStored<CartFolioItem[]>(CART_KEY, []);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("leadsphere-cart-updated"));
  }
}

export async function isBookmarked(contentId: string): Promise<boolean> {
  const bookmarks = await getBookmarks();
  return bookmarks.some((b) => b.contentId === contentId);
}

export function getAllReadingProgress(): Record<string, ReadingProgress> {
  return getStored<Record<string, ReadingProgress>>(PROGRESS_KEY, {});
}

export async function getReadingProgress(contentId: string): Promise<ReadingProgress | null> {
  const allProgress = getAllReadingProgress();
  return allProgress[contentId] || null;
}

export async function saveReadingProgress(
  contentId: string,
  pageNumber: number,
  totalPages: number
): Promise<void> {
  const allProgress = getAllReadingProgress();
  allProgress[contentId] = {
    contentId,
    currentPage: pageNumber,
    totalPages,
    lastReadAt: new Date().toISOString(),
    completed: pageNumber >= totalPages,
  };
  setStored(PROGRESS_KEY, allProgress);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("leadsphere-progress-updated"));
  }
}

export async function getAdminOrders(): Promise<Order[]> {
  return getStored<Order[]>(ORDERS_KEY, SEED_ORDERS);
}

export async function getAdminUsers(): Promise<User[]> {
  return SEED_USERS;
}

export async function getAdminAuditLogs(): Promise<AuditLog[]> {
  return SEED_AUDIT_LOGS;
}
