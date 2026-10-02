export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    /*
    ============================================================
    1. BACKBLAZE IMAGES
    ============================================================
    /image/anything
    →
    https://f005.backblazeb2.com/file/payuee/anything
    */

    if (path.startsWith("/image/")) {
      const imagePath = path.substring("/image/".length);

      return fetch(
        `https://f005.backblazeb2.com/file/payuee/${imagePath}${url.search}`
      );
    }


    /*
    ============================================================
    2. OUTFITS
    ============================================================
    /outfits/:nameAndId
    →
    /e-shop/product_cate

    IMPORTANT:
    /outfits/v/... must come FIRST so it doesn't get caught
    by /outfits/...
    */

    if (path.startsWith("/outfits/v/")) {
      const productPath = path.substring("/outfits/v/".length);

      return fetch(
        `https://api.payuee.com/open/single_product/${productPath}${url.search}`
      );
    }

    if (path.startsWith("/outfits/")) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/e-shop/product_cate", request.url),
          request
        )
      );
    }


    /*
    ============================================================
    3. OUTFIT VENDOR PAGE
    ============================================================
    /outfitss/v/:nameAndId
    →
    /e-shop/v/product_cate
    */

    if (path.startsWith("/outfitss/v/")) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/e-shop/v/product_cate", request.url),
          request
        )
      );
    }


    /*
    ============================================================
    4. PRODUCT LISTING API
    ============================================================
    /products/v
    →
    /open/product_listing/1

    /products/v/:path*
    →
    /open/product_listing/:path*
    */

    if (path === "/products/v") {
      return fetch(
        `https://api.payuee.com/open/product_listing/1${url.search}`
      );
    }

    if (path.startsWith("/products/v/")) {
      const productPath = path.substring("/products/v/".length);

      return fetch(
        `https://api.payuee.com/open/product_listing/${productPath}${url.search}`
      );
    }


    /*
    ============================================================
    5. STORE LOCATIONS API
    ============================================================
    /e-shop/v/store_location
    →
    /open/stores_listing/1

    /e-shop/v/store_location/:path*
    →
    /open/stores_listing/:path*
    */

    if (path === "/e-shop/v/store_location") {
      return fetch(
        `https://api.payuee.com/open/stores_listing/1${url.search}`
      );
    }

    if (path.startsWith("/e-shop/v/store_location/")) {
      const storePath = path.substring(
        "/e-shop/v/store_location/".length
      );

      return fetch(
        `https://api.payuee.com/open/stores_listing/${storePath}${url.search}`
      );
    }


    /*
    ============================================================
    6. SITEMAP
    ============================================================
    /sitemap.xml
    →
    https://api.payuee.com/open/product_sitemap
    */

    if (path === "/sitemap.xml") {
      return fetch(
        `https://api.payuee.com/open/product_sitemap${url.search}`
      );
    }


    /*
    ============================================================
    7. TOOLS / CARS / GADGETS
    ============================================================
    All three use the same product page.
    */

    if (
      path.startsWith("/tools/v/") ||
      path.startsWith("/cars/v/") ||
      path.startsWith("/gadgets/v/")
    ) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/e-shop/v/product_car", request.url),
          request
        )
      );
    }

    if (
      path.startsWith("/tools/") ||
      path.startsWith("/cars/") ||
      path.startsWith("/gadgets/")
    ) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/e-shop/product_car", request.url),
          request
        )
      );
    }


    /*
    ============================================================
    8. VENDOR
    ============================================================
    /vendor/:nameAndId
    →
    /e-shop/product_vendor

    /vendor/v/:nameAndId
    →
    /e-shop/v/shop_vendor
    */

    if (path.startsWith("/vendor/v/")) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/e-shop/v/shop_vendor", request.url),
          request
        )
      );
    }

    if (path.startsWith("/vendor/")) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/e-shop/product_vendor", request.url),
          request
        )
      );
    }


    /*
    ============================================================
    9. JEWELRY
    ============================================================
    */

    if (path.startsWith("/jewelry/v/")) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/e-shop/v/product_ca", request.url),
          request
        )
      );
    }

    if (path.startsWith("/jewelry/")) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/e-shop/product_ca", request.url),
          request
        )
      );
    }


    /*
    ============================================================
    10. KIDS
    ============================================================
    */

    if (path.startsWith("/kids/v/")) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/e-shop/v/product_c", request.url),
          request
        )
      );
    }

    if (path.startsWith("/kids/")) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/e-shop/product_c", request.url),
          request
        )
      );
    }


    /*
    ============================================================
    11. STORE
    ============================================================
    /store/:nameAndId
    →
    /e-shop/shop_vendor

    /store/v/:path*
    →
    https://api.payuee.com/open/store/v/:path*
    */

    if (path.startsWith("/store/v/")) {
      const storePath = path.substring("/store/v/".length);

      return fetch(
        `https://api.payuee.com/open/store/v/${storePath}${url.search}`
      );
    }

    if (path.startsWith("/store/")) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/e-shop/shop_vendor", request.url),
          request
        )
      );
    }


    /*
    ============================================================
    12. EVERYTHING ELSE
    ============================================================
    Let Cloudflare serve the normal static website.
    */

    return env.ASSETS.fetch(request);
  }
};