import { describe, it, expect, beforeEach } from "vitest";
import {
  getReaderPage,
  checkEntitlement,
  createOrder,
  verifyPayment,
  getLibrary,
  saveReadingProgress,
  getAllReadingProgress,
  getCartItems,
  addToCart,
  removeFromCart,
  clearCart,
} from "@/lib/api/client";
import {
  SEED_BOOKS,
  SEED_COMICS,
  SEED_PODCASTS,
  SEED_ORDERS,
  SEED_CURRENT_USER,
} from "@/lib/api/seedData";

describe("LeadSphere Platform Business Rules & Security Boundaries", () => {
  beforeEach(() => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  describe("1. 10-Page Free Preview Rules (Books & Comics)", () => {
    it("allows unrestricted access to pages 1 through 10 for unpurchased books", async () => {
      const bookId = "book-jungle-audit-handbook"; // unpurchased book
      const page1 = await getReaderPage(bookId, 1, "test-user-anonymous");
      expect(page1.locked).toBe(false);
      expect(page1.requiresPurchase).toBe(false);
      expect(page1.pageNumber).toBe(1);

      const page10 = await getReaderPage(bookId, 10, "test-user-anonymous");
      expect(page10.locked).toBe(false);
      expect(page10.requiresPurchase).toBe(false);
      expect(page10.pageNumber).toBe(10);
    });

    it("locks page 11 onward when no verified backend entitlement exists", async () => {
      const bookId = "book-jungle-audit-handbook"; // unpurchased
      const page11 = await getReaderPage(bookId, 11, "test-user-anonymous");
      expect(page11.locked).toBe(true);
      expect(page11.requiresPurchase).toBe(true);
      expect(page11.pageNumber).toBe(11);
      expect(page11.freeLimit).toBe(10);
      expect(page11.text).toBeUndefined(); // Does not leak protected page content
    });

    it("grants access to page 11 onward when user has verified backend entitlement", async () => {
      // book-jungle-safari has entitlement in SEED_ENTITLEMENTS for SEED_CURRENT_USER.id
      const page11 = await getReaderPage("book-jungle-safari", 11, SEED_CURRENT_USER.id);
      expect(page11.locked).toBe(false);
      expect(page11.requiresPurchase).toBe(false);
      expect(page11.text).toBeDefined();
    });
  });

  describe("2. Podcast Episode Pricing Rules", () => {
    it("guarantees Episode 1 of podcast series is free", async () => {
      const series = SEED_PODCASTS[0];
      const ep1 = series.episodes[0];
      expect(ep1.episodeNumber).toBe(1);
      expect(ep1.isFree).toBe(true);
      expect(ep1.price).toBe(0);
    });

    it("enforces that Episode 2 onward is not free and has individual price", async () => {
      const series = SEED_PODCASTS[0];
      const ep2 = series.episodes[1];
      expect(ep2.episodeNumber).toBe(2);
      expect(ep2.isFree).toBe(false);
      expect(ep2.price).toBeGreaterThan(0);

      const ep3 = series.episodes[2];
      expect(ep3.episodeNumber).toBe(3);
      expect(ep3.isFree).toBe(false);
      expect(ep3.price).toBeGreaterThan(0);
    });
  });

  describe("3. Order Creation & Cryptographic Payment Verification", () => {
    it("creates an order and issues verified backend entitlement upon signature verification", async () => {
      const book = SEED_BOOKS[1]; // The Jungle Audit: 5-Pillar AI Readiness Playbook
      const order = await createOrder({
        id: book.id,
        title: book.title,
        price: book.price,
        type: "book",
      });

      expect(order.id).toBeDefined();
      expect(order.status).toBe("processing");
      expect(order.totalAmount).toBe(book.price);

      // Verify payment
      const paymentResult = await verifyPayment(order.id, "pay_rzp_mock_sig_991823");
      expect(paymentResult.success).toBe(true);
      expect(paymentResult.entitlement.contentId).toBe(book.id);
      expect(paymentResult.entitlement.verifiedBackendSignature).toContain("pay_rzp_mock_sig_991823");

      // Verify entitlement check succeeds now
      const isEntitled = await checkEntitlement(book.id, SEED_CURRENT_USER.id);
      expect(isEntitled).toBe(true);

      // Verify page 11 is now unlocked
      const unlockedPage11 = await getReaderPage(book.id, 11, SEED_CURRENT_USER.id);
      expect(unlockedPage11.locked).toBe(false);
    });
  });

  describe("4. Library Telemetry & Protection", () => {
    it("returns owned books and always includes free podcast episode 1", async () => {
      const library = await getLibrary();
      expect(library.ownedBooks.length).toBeGreaterThan(0);
      expect(library.ownedEpisodes.some((e) => e.episode.episodeNumber === 1)).toBe(true);
    });

    it("enforces INR domestic tier ranges across books, comics, and paid podcast episodes", () => {
      SEED_BOOKS.forEach((book) => {
        expect(book.price).toBeGreaterThanOrEqual(499);
        expect(book.price).toBeLessThanOrEqual(899);
      });

      SEED_COMICS.forEach((comic) => {
        expect(comic.price).toBeGreaterThanOrEqual(299);
        expect(comic.price).toBeLessThanOrEqual(499);
      });

      SEED_PODCASTS.forEach((series) => {
        const ep1 = series.episodes.find((ep) => ep.episodeNumber === 1);
        expect(ep1?.isFree).toBe(true);
        expect(ep1?.price).toBe(0);

        series.episodes
          .filter((ep) => ep.episodeNumber >= 2)
          .forEach((ep) => {
            expect(ep.isFree).toBe(false);
            expect(ep.price).toBeGreaterThanOrEqual(199);
            expect(ep.price).toBeLessThanOrEqual(499);
          });
      });

      SEED_ORDERS.forEach((order) => {
        expect(order.currency).toBe("INR");
      });
    });

    it("persists reading progress across books and comics via getAllReadingProgress", async () => {
      await saveReadingProgress("book-jungle-safari", 12, 280);
      await saveReadingProgress("comic-jungle-audit", 8, 16);

      const progressMap = getAllReadingProgress();
      expect(progressMap["book-jungle-safari"].currentPage).toBe(12);
      expect(progressMap["book-jungle-safari"].completed).toBe(false);
      expect(progressMap["comic-jungle-audit"].currentPage).toBe(8);
    });

    it("issues verified entitlements for every item in a multi-item or bundle order", async () => {
      const order = await createOrder(
        {
          id: "bundle-test",
          title: "Season 1 AI Jungle Safari Collector Bundle",
          price: 1247,
          type: "bundle",
        },
        {
          name: SEED_CURRENT_USER.name,
          email: SEED_CURRENT_USER.email,
        },
        [
          {
            id: SEED_BOOKS[1].id,
            title: SEED_BOOKS[1].title,
            price: SEED_BOOKS[1].price,
            type: "book",
          },
          {
            id: SEED_COMICS[1].id,
            title: SEED_COMICS[1].title,
            price: SEED_COMICS[1].price,
            type: "comic",
          },
          {
            id: "ep-jungle-03",
            title: SEED_PODCASTS[0].episodes[2].title,
            price: SEED_PODCASTS[0].episodes[2].price,
            type: "podcast_episode",
          },
        ]
      );

      const res = await verifyPayment(order.id, "pay_rzp_bundle_test");
      expect(res.success).toBe(true);

      expect(await checkEntitlement(SEED_BOOKS[1].id, SEED_CURRENT_USER.id)).toBe(true);
      expect(await checkEntitlement(SEED_COMICS[1].id, SEED_CURRENT_USER.id)).toBe(true);
      expect(await checkEntitlement("ep-jungle-03", SEED_CURRENT_USER.id)).toBe(true);

      const library = await getLibrary();
      expect(library.ownedBooks.some((b) => b.id === SEED_BOOKS[1].id)).toBe(true);
      expect(library.ownedComics.some((c) => c.id === SEED_COMICS[1].id)).toBe(true);
      expect(library.ownedEpisodes.some((e) => e.episode.id === "ep-jungle-03")).toBe(true);
    });

    it("manages shopping folio cart persistence cleanly", () => {
      const initial = getCartItems();
      expect(initial.length).toBeGreaterThan(0);

      const comic = SEED_COMICS[1];
      const afterAdd = addToCart({
        id: comic.id,
        title: comic.title,
        type: "comic",
        badge: "COMIC",
        edition: comic.genre,
        authorOrHost: comic.creator,
        tierOrFormat: "High-Res Web Reader",
        price: comic.price,
        coverUrl: comic.coverUrl,
      });
      expect(afterAdd.some((c) => c.id === comic.id)).toBe(true);

      const afterRemove = removeFromCart(comic.id);
      expect(afterRemove.some((c) => c.id === comic.id)).toBe(false);

      clearCart();
      expect(getCartItems().length).toBe(0);
    });

    it("ensures every active product in catalog has a non-empty valid image URL", () => {
      SEED_BOOKS.forEach((book) => {
        expect(book.coverUrl.trim().length).toBeGreaterThan(0);
        expect(book.coverUrl).not.toContain("1579783902614");
      });

      SEED_COMICS.forEach((comic) => {
        expect(comic.coverUrl.trim().length).toBeGreaterThan(0);
        expect(comic.coverUrl).not.toContain("1579783902614");
        comic.pages?.forEach((page) => {
          expect(page.imageUrl.trim().length).toBeGreaterThan(0);
          expect(page.imageUrl).not.toContain("1579783902614");
        });
      });

      SEED_PODCASTS.forEach((series) => {
        expect(series.coverUrl.trim().length).toBeGreaterThan(0);
        series.episodes.forEach((ep) => {
          expect(ep.thumbnailUrl.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });
});
