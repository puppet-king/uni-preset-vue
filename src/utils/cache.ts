import { EXPIRE } from '@/configs/constant'

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

  private readonly cacheExpireKey = 'POMODORO-APP-Client:KEY'
  /** 正在进行的请求 Promise（避免并发重复请求） */
  private tagListPendingPromise: Promise<CacheTag[]> | null = null
  private readonly TAG_LIST_CACHE_DURATION = 800 // 预防并发 缓存有效时长（毫秒）
  private tagListCacheExpire: number = 0 // 缓存
  private cachedTagList: CacheTag[] | null = null

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
  private async getTagListAsync(isForce: boolean = false): Promise<CacheTag[]> {
    const now = Date.now()
    // 检查缓存是否有效（未过期且有缓存数据）
    if (!isForce && this.cachedTagList && now < this.tagListCacheExpire) {
      return this.cachedTagList
    }

    // 检查是否有正在进行的请求，有则复用（避免并发重复请求）
    if (this.tagListPendingPromise) {
      return this.tagListPendingPromise
    }

    try {
      // 强制模式下：先清空pendingPromise（避免复用旧请求）
      if (isForce) {
        this.tagListPendingPromise = null
      }

      // 3. 发起新请求，先把Promise存起来（处理并发）
      this.tagListPendingPromise = (async () => {
        const res = await this.cacheGetAsync({ key: this.cacheExpireKey })
        const raw = res?.data
        let result: CacheTag[] = []

        if (typeof raw === 'string') {
          result = JSON.parse(raw)
        } else if (Array.isArray(raw)) {
          result = raw
        }

        // 更新缓存和过期时间
        this.cachedTagList = result
        this.tagListCacheExpire = now + this.TAG_LIST_CACHE_DURATION

        return result
      })()

      // 返回请求结果
      return await this.tagListPendingPromise
    } catch (error) {
      if (error?.errMsg && error.errMsg !== 'getStorage:fail data not found') {
        console.error(error)
      }

      // 请求失败时，清空缓存（下次调用重新请求）
      this.cachedTagList = null
      this.tagListCacheExpire = 0
      return []
    } finally {
      // 请求完成（成功/失败）后，清空pendingPromise
      this.tagListPendingPromise = null
    }
  }

  /** 设置缓存过期标签（同步） */
  private setExpireTagSync(key: string, expire?: number): void {
    expire = expire ?? EXPIRE
    if (typeof expire !== 'number') return

    const tag = this.handleTag(this.getTagListSync(), key, expire)
    this.cacheSetSync(this.cacheExpireKey, tag)
  }

  private handleTag(tag: CacheTag[], key: string, expire: number): CacheTag[] {
    const newExpire = expire === 0 ? 0 : this.time() + expire
    const index = tag.findIndex((t) => t.key === key)

    if (index > -1) {
      tag[index].expire = newExpire
    } else {
      tag.push({ key, expire: newExpire })
    }

    return tag
  }

  /** 设置缓存过期标签（异步） */
  private async setExpireTagAsync(key: string, expire?: number): Promise<void> {
    expire = expire ?? EXPIRE
    if (typeof expire !== 'number') return

    let tag = await this.getTagListAsync(true)
    tag = this.handleTag(tag, key, expire)

    await this.cacheSetAsync({
      key: this.cacheExpireKey,
      data: JSON.stringify(tag),
    })
  }

  /** 判断是否过期 (同步) */
  private isExpireSync(key: string, autoDel = true): boolean {
    const tag = this.getTagListSync()
    const found = tag.find((t) => t.key === key)

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

  public async getAsync<T>(key: string, isJson?: true, isForce?: boolean): Promise<T | null>

  public async getAsync(key: string, isJson: false, isForce?: boolean): Promise<string | null>

  /** 异步获取缓存 */
  public async getAsync(key: string, isJson: boolean = true, isForce: boolean = false): Promise<any> {
    await this.clearOverdueAsync()
    const tag = await this.getTagListAsync(isForce)
    const found = tag.find((t) => t.key === key)
    const now = this.time()

    if (found && found.expire !== 0 && found.expire < now) {
      await this.clearAsync(key)
      return null
    }

    try {
      const res = await this.cacheGetAsync({ key })
      const data = res?.data
      if (data === undefined || data === null) return null

      // 如果是数字字符串且需要解析，JSON.parse 也会处理 number/boolean
      return isJson ? JSON.parse(data) : data
    } catch {
      return null
    }
  }

  /** 同步删除缓存 */
  public clearSync(key: string): boolean {
    try {
      const tag = this.getTagListSync()
      const newTag = tag.filter((t) => t.key !== key)
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
      const tag = await this.getTagListAsync(true)
      const newTag = tag.filter((t) => t.key !== key)
      await this.cacheSetAsync({
        key: this.cacheExpireKey,
        data: JSON.stringify(newTag),
      })
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
    const validTags = tag.filter((t) => t.expire === 0 || t.expire > now)
    const expiredKeys = tag.filter((t) => t.expire && t.expire < now).map((t) => t.key)

    if (validTags.length !== tag.length) {
      this.cacheSetSync(this.cacheExpireKey, validTags)
    }
    expiredKeys.forEach((k) => this.cacheRemoveSync(k))
  }

  /** 异步清除过期缓存 */
  public async clearOverdueAsync(): Promise<void> {
    const tag = await this.getTagListAsync(true)
    const now = this.time()
    const validTags = tag.filter((t) => t.expire === 0 || t.expire > now)
    const expiredKeys = tag.filter((t) => t.expire && t.expire < now).map((t) => t.key)

    if (validTags.length !== tag.length) {
      await this.cacheSetAsync({
        key: this.cacheExpireKey,
        data: JSON.stringify(validTags),
      })
    }

    for (const k of expiredKeys) {
      await this.cacheRemoveAsync({ key: k })
    }
  }
}

export default new Cache()
