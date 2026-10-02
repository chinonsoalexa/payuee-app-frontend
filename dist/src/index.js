export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    /*
     * ============================================================
     * 1. VENDOR ROUTES
     * ============================================================
     *
     * These were previously handled by Cloudflare Transform Rules.
     * We moved them into the Worker to free one Transform Rule slot
     * for the Backblaze B2 image rewrite.
     */

    // /vendor/v/:nameAndId
    // -> /e-shop/v/shop_vendor
    if (path.startsWith("/vendor/v/")) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/e-shop/v/shop_vendor", request.url),
          request
        )
      );
    }

    // /vendor/:nameAndId
    // -> /e-shop/product_vendor
    if (path.startsWith("/vendor/")) {
      return env.ASSETS.fetch(
        new Request(
          new URL("/e-shop/product_vendor", request.url),
          request
        )
      );
    }


    /*
     * ============================================================
     * 2. API ROUTES
     * ============================================================
     *
     * These routes must remain in the Worker because they proxy
     * requests to api.payuee.com.
     */

    // /outfits/v/:path*
    // -> https://api.payuee.com/open/single_product/:path*
    if (path.startsWith("/outfitss/v/")) {
      const productPath = path.substring("/outfitss/v/".length);

      return fetch(
        `https://api.payuee.com/open/single_product/${productPath}${url.search}`
      );
    }


    // /products/v
    // -> https://api.payuee.com/open/product_listing/1
    if (path === "/products/v") {
      return fetch(
        `https://api.payuee.com/open/product_listing/1${url.search}`
      );
    }


    // /products/v/:path*
    // -> https://api.payuee.com/open/product_listing/:path*
    if (path.startsWith("/products/v/")) {
      const productPath = path.substring("/products/v/".length);

      return fetch(
        `https://api.payuee.com/open/product_listing/${productPath}${url.search}`
      );
    }


    // /e-shop/v/store_location
    // -> https://api.payuee.com/open/stores_listing/1
    if (path === "/e-shop/v/store_location") {
      return fetch(
        `https://api.payuee.com/open/stores_listing/1${url.search}`
      );
    }


    // /e-shop/v/store_location/:path*
    // -> https://api.payuee.com/open/stores_listing/:path*
    if (path.startsWith("/e-shop/v/store_location/")) {
      const storePath = path.substring(
        "/e-shop/v/store_location/".length
      );

      return fetch(
        `https://api.payuee.com/open/stores_listing/${storePath}${url.search}`
      );
    }


    // /sitemap.xml
    // -> https://api.payuee.com/open/product_sitemap
    if (path === "/sitemap.xml") {
      return fetch(
        `https://api.payuee.com/open/product_sitemap${url.search}`
      );
    }


    // /store/v/:path*
    // -> https://api.payuee.com/open/store/v/:path*
    if (path.startsWith("/store/v/")) {
      const storePath = path.substring("/store/v/".length);

      return fetch(
        `https://api.payuee.com/open/store/v/${storePath}${url.search}`
      );
    }


    /*
     * ============================================================
     * 3. STATIC ASSETS / FRONTEND
     * ============================================================
     *
     * Everything else is handled by Cloudflare Workers Assets.
     *
     * Your Transform Rules handle:
     *
     * /outfits/*
     * /outfitss/v/*
     * /tools/*
     * /tools/v/*
     * /cars/*
     * /cars/v/*
     * /jewelry/*
     * /jewelry/v/*
     * /kids/*
     * /kids/v/*
     * /store/*
     *
     * before the request reaches the Worker.
     *
     * Therefore those routes arrive here already rewritten to:
     *
     * /e-shop/product_cate
     * /e-shop/v/product_cate
     * /e-shop/product_car
     * /e-shop/v/product_car
     * /e-shop/product_ca
     * /e-shop/v/product_ca
     * /e-shop/product_c
     * /e-shop/v/product_c
     * /e-shop/shop_vendor
     */

    return env.ASSETS.fetch(request);
  }
};