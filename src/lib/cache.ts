export class Cache<K, T> {
  map = new Map<
    K,
    {
      createdAt: Date;
      expiresAt?: Date;
      cached: T;
    }
  >();

  constructor(public ttl?: number) {}

  get(key: K) {
    return this.map.get(key)?.cached;
  }

  set(key: K, value: T, expiresAt?: Date) {
    const now = new Date();
    this.map.set(key, {
      createdAt: new Date(),
      expiresAt:
        expiresAt ??
        (this.ttl ? new Date(now.getTime() + this.ttl) : undefined),
      cached: value,
    });
  }

  delete(key: K) {
    return this.map.delete(key);
  }

  hasExpired(key: K) {
    const c = this.map.get(key);

    if (c?.expiresAt) {
      return Date.now() > c.expiresAt.getTime();
    }

    return false;
  }

  clearExpired() {
    this.map.forEach(({ expiresAt }, key) => {
      if (!expiresAt) return;
      if (Date.now() > expiresAt.getTime()) {
        console.log("clear");
        this.map.delete(key);
      }
    });
  }
}
