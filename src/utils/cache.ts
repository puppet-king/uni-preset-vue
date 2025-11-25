import config from '@/configs/app'

interface CacheTag {
  key: string
  expire: number // 0 = 永不过期
}

class Cache {
  private cacheSetSync = uni.setStorageSync
  private cacheGetSync = uni.getStorageSync
  private cacheRemoveSync = uni.removeStorageSync

  private cacheSetAsync = uni.setStorage
  private cacheGetAsync = uni.getStorage
  private cacheRemoveAsync = uni.removeStorage

  private readonly cacheExpireKey = 'UNI-APP-Client:KEY'

  constructor() {
    this.clearOverdueSync()
  }

  /** 获取当前时间戳（秒） */
  private time(): number {
    return Math.floor(Date.now() / 1000)
  }

  /** 获取缓存标签列表（同步） */
  private getTagListSync(): CacheTag[] {
    const raw = this.cacheGetSync(this.cacheExpireKey)
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw)
      } catch {
        return []
      }
    }
    return Array.isArray(raw) ? raw : []
  }

  /** 获取缓存标签列表（异步） */
  private async getTagListAsync(): Promise<CacheTag[]> {
    try {
      const res = await this.cacheGetAsync({ key: this.cacheExpireKey })
      const raw = res?.data
      if (typeof raw === 'string') {
        return JSON.parse(raw)
      }
      return Array.isArray(raw) ? raw : []
    } catch {
      return []
    }
  }

  /** 设置缓存过期标签（同步） */
  private setExpireTagSync(key: string, expire?: number): void {
    expire = expire ?? config.EXPIRE
    if (typeof expire !== 'number') return

    const tag = this.getTagListSync()
    const newExpire = expire === 0 ? 0 : this.time() + expire
    const index = tag.findIndex(t => t.key === key)

    if (index > -1) {
      tag[index].expire = newExpire
    } else {
      tag.push({ key, expire: newExpire })
    }

    this.cacheSetSync(this.cacheExpireKey, tag)
  }

  /** 设置缓存过期标签（异步） */
  private async setExpireTagAsync(key: string, expire?: number): Promise<void> {
    expire = expire ?? config.EXPIRE
    if (typeof expire !== 'number') return

    const tag = await this.getTagListAsync()
    const newExpire = expire === 0 ? 0 : this.time() + expire
    const index = tag.findIndex(t => t.key === key)

    if (index > -1) {
      tag[index].expire = newExpire
    } else {
      tag.push({ key, expire: newExpire })
    }

    await this.cacheSetAsync({ key: this.cacheExpireKey, data: JSON.stringify(tag) })
  }

  /** 判断是否过期 (同步) */
  private isExpireSync(key: string, autoDel = true): boolean {
    const tag = this.getTagListSync()
    const found = tag.find(t => t.key === key)

    if (!found) return !!this.cacheGetSync(key)

    const now = this.time()
    if (found.expire !== 0 && found.expire < now) {
      if (autoDel) this.clearSync(key)
      return false
    }
    return true
  }

  /** 同步设置缓存 */
  public setSync<T>(key: string, data: T, expire?: number): boolean {
    if (data === undefined) return false
    try {
      this.setExpireTagSync(key, expire)
      const str = typeof data === 'object' ? JSON.stringify(data) : data
      this.cacheSetSync(key, str)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  /** 异步设置缓存 */
  public async setAsync<T>(key: string, data: T, expire?: number): Promise<boolean> {
    if (data === undefined) return false
    try {
      await this.setExpireTagAsync(key, expire)
      const str = typeof data === 'object' ? JSON.stringify(data) : data
      await this.cacheSetAsync({ key, data: str })
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  /** 同步获取缓存 */
  public getSync<T>(key: string, isJson = true): T | string | null {
    this.clearOverdueSync()
    if (!this.isExpireSync(key, true)) return null
    try {
      const data = this.cacheGetSync(key)
      if (!data) return null
      return isJson ? JSON.parse(data) : data
    } catch {
      return null
    }
  }

  /** 异步获取缓存 */
  public async getAsync<T>(key: string, isJson = true): Promise<T | string | null> {
    await this.clearOverdueAsync()
    const tag = await this.getTagListAsync()
    const found = tag.find(t => t.key === key)
    const now = this.time()

    if (found && found.expire !== 0 && found.expire < now) {
      await this.clearAsync(key)
      return null
    }

    try {
      const res = await this.cacheGetAsync({ key })
      const data = res?.data
      if (!data) return null
      return isJson ? JSON.parse(data) : data
    } catch {
      return null
    }
  }

  /** 同步删除缓存 */
  public clearSync(key: string): boolean {
    try {
      const tag = this.getTagListSync()
      const newTag = tag.filter(t => t.key !== key)
      this.cacheSetSync(this.cacheExpireKey, newTag)
      this.cacheRemoveSync(key)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  /** 异步删除缓存 */
  public async clearAsync(key: string): Promise<boolean> {
    try {
      const tag = await this.getTagListAsync()
      const newTag = tag.filter(t => t.key !== key)
      await this.cacheSetAsync({ key: this.cacheExpireKey, data: JSON.stringify(newTag) })
      await this.cacheRemoveAsync({ key })
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  /** 同步清除过期缓存 */
  public clearOverdueSync(): void {
    const tag = this.getTagListSync()
    const now = this.time()
    const validTags = tag.filter(t => t.expire === 0 || t.expire > now)
    const expiredKeys = tag.filter(t => t.expire && t.expire < now).map(t => t.key)

    if (validTags.length !== tag.length) {
      this.cacheSetSync(this.cacheExpireKey, validTags)
    }
    expiredKeys.forEach(k => this.cacheRemoveSync(k))
  }

  /** 异步清除过期缓存 */
  public async clearOverdueAsync(): Promise<void> {
    const tag = await this.getTagListAsync()
    const now = this.time()
    const validTags = tag.filter(t => t.expire === 0 || t.expire > now)
    const expiredKeys = tag.filter(t => t.expire && t.expire < now).map(t => t.key)

    if (validTags.length !== tag.length) {
      await this.cacheSetAsync({ key: this.cacheExpireKey, data: JSON.stringify(validTags) })
    }

    for (const k of expiredKeys) {
      await this.cacheRemoveAsync({ key: k })
    }
  }
}

export default new Cache()
