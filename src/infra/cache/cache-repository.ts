export interface CacheRepository {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
  addCacheKeyToSet(key: string, value: string): Promise<void>;
  getCacheKeysFromSet(key: string): Promise<string[]>;
  deleteCacheByPattern(pattern: string): Promise<void>;
}
