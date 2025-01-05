var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// node_modules/@opennextjs/aws/dist/utils/error.js
var IgnorableError = class extends Error {
  constructor(message) {
    super(message);
    __publicField(this, "__openNextInternal", true);
    __publicField(this, "canIgnore", true);
    __publicField(this, "logLevel", 0);
    this.name = "IgnorableError";
  }
};
var RecoverableError = class extends Error {
  constructor(message) {
    super(message);
    __publicField(this, "__openNextInternal", true);
    __publicField(this, "canIgnore", true);
    __publicField(this, "logLevel", 1);
    this.name = "RecoverableError";
  }
};

// node_modules/@opennextjs/cloudflare/dist/api/get-cloudflare-context.js
var cloudflareContextSymbol = Symbol.for("__cloudflare-context__");
async function getCloudflareContext() {
  const global = globalThis;
  const cloudflareContext = global[cloudflareContextSymbol];
  if (!cloudflareContext) {
    return getCloudflareContextInNextDev();
  }
  return cloudflareContext;
}
var cloudflareContextInNextDevSymbol = Symbol.for("__next-dev/cloudflare-context__");
async function getCloudflareContextInNextDev() {
  const global = globalThis;
  if (!global[cloudflareContextInNextDevSymbol]) {
    const { getPlatformProxy } = await import(
      /* webpackIgnore: true */
      `${"__wrangler".replaceAll("_", "")}`
    );
    const { env, cf, ctx } = await getPlatformProxy();
    global[cloudflareContextInNextDevSymbol] = {
      env,
      cf,
      ctx
    };
  }
  return global[cloudflareContextInNextDevSymbol];
}

// node_modules/@opennextjs/cloudflare/dist/api/kvCache.js
var CACHE_ASSET_DIR = "cnd-cgi/_next_cache";
var STATUS_DELETED = 1;
var Cache = class {
  constructor() {
    __publicField(this, "name", "cloudflare-kv");
    __publicField(this, "initialized", false);
    __publicField(this, "kv");
    __publicField(this, "assets");
  }
  async get(key, isFetch) {
    if (!this.initialized) {
      await this.init();
    }
    if (!(this.kv || this.assets)) {
      throw new IgnorableError(`No KVNamespace nor Fetcher`);
    }
    this.debug(`Get ${key}`);
    try {
      let entry = null;
      if (this.kv) {
        this.debug(`- From KV`);
        const kvKey = this.getKVKey(key, isFetch);
        entry = await this.kv.get(kvKey, "json");
        if (entry?.status === STATUS_DELETED) {
          return {};
        }
      }
      if (!entry && this.assets) {
        this.debug(`- From Assets`);
        const url = this.getAssetUrl(key, isFetch);
        const response = await this.assets.fetch(url);
        if (response.ok) {
          entry = {
            value: await response.json(),
            // __BUILD_TIMESTAMP_MS__ is injected by ESBuild.
            lastModified: globalThis.__BUILD_TIMESTAMP_MS__
          };
        }
      }
      this.debug(entry ? `-> hit` : `-> miss`);
      return { value: entry?.value, lastModified: entry?.lastModified };
    } catch {
      throw new RecoverableError(`Failed to get cache [${key}]`);
    }
  }
  async set(key, value, isFetch) {
    if (!this.initialized) {
      await this.init();
    }
    if (!this.kv) {
      throw new IgnorableError(`No KVNamespace`);
    }
    this.debug(`Set ${key}`);
    try {
      const kvKey = this.getKVKey(key, isFetch);
      await this.kv.put(kvKey, JSON.stringify({
        value,
        // Note: `Date.now()` returns the time of the last IO rather than the actual time.
        //       See https://developers.cloudflare.com/workers/reference/security-model/
        lastModified: Date.now()
      }));
    } catch {
      throw new RecoverableError(`Failed to set cache [${key}]`);
    }
  }
  async delete(key) {
    if (!this.initialized) {
      await this.init();
    }
    if (!this.kv) {
      throw new IgnorableError(`No KVNamespace`);
    }
    this.debug(`Delete ${key}`);
    try {
      const kvKey = this.getKVKey(
        key,
        /* isFetch= */
        false
      );
      await this.kv.put(kvKey, JSON.stringify({ status: STATUS_DELETED }));
    } catch {
      throw new RecoverableError(`Failed to delete cache [${key}]`);
    }
  }
  getKVKey(key, isFetch) {
    return `${this.getBuildId()}/${key}.${isFetch ? "fetch" : "cache"}`;
  }
  getAssetUrl(key, isFetch) {
    return isFetch ? `http://assets.local/${CACHE_ASSET_DIR}/__fetch/${this.getBuildId()}/${key}` : `http://assets.local/${CACHE_ASSET_DIR}/${this.getBuildId()}/${key}.cache`;
  }
  debug(...args) {
    if (process.env.NEXT_PRIVATE_DEBUG_CACHE) {
      console.log(`[Cache ${this.name}] `, ...args);
    }
  }
  getBuildId() {
    return process.env.NEXT_BUILD_ID ?? "no-build-id";
  }
  async init() {
    const env = (await getCloudflareContext()).env;
    this.kv = env.NEXT_CACHE_WORKERS_KV;
    this.assets = env.ASSETS;
    this.initialized = true;
  }
};
var kvCache_default = new Cache();

// open-next.config.ts
var config = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      incrementalCache: async () => kvCache_default,
      tagCache: "dummy",
      queue: "dummy"
    }
  },
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch"
    }
  },
  dangerous: {
    enableCacheInterception: false
  }
};
var open_next_config_default = config;
export {
  open_next_config_default as default
};
