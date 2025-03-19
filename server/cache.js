class SattaCache {
  constructor() {
    this.store = new Map();
    this.ttl = 300000;
    this.startCleanup();
  }

  set(key, value) {
    this.store.set(key, { data: value, expires: Date.now() + this.ttl });
  }

  get(key) {
    const entry = this.store.get(key);
    if (entry && Date.now() < entry.expires) return entry.data;
    this.store.delete(key);
    return null;
  }

  has(key) {
    return this.store.has(key) && Date.now() < this.store.get(key).expires;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  startCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.store.entries()) {
        if (value.expires < now) {
          this.store.delete(key);
        }
      }
    }, 60000); // Run every 60 seconds
  }
}

module.exports = new SattaCache();