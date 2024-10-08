export interface CacheRepository {
  set(key: string, value: string, minutes?: number): Promise<void>;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
  deleteCacheByPattern(pattern: string): Promise<void>;
}
