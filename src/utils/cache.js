import config from '@/config/app'

class Cache {
  constructor() {
    this.cacheSetHandler = uni.setStorageSync
    this.cacheGetHandler = uni.getStorageSync
    this.cacheClearHandler = uni.removeStorageSync
    this.cacheExpire = 'UNI-APP-Client:KEY'
    this.clearOverdue()
  }

  /**
	 * 获取当前时间戳
	 */
  time() {
    return Math.round(new Date() / 1000)
  }
  /**
	 * 设置过期时间缓存
	 * @param {Object} key
	 * @param {Object} expire
	 */
  setExpireCacheKey(key, expire) {
    expire = expire !== undefined ? expire : config.EXPIRE
    if (typeof expire === 'number') {
      const tag = this.cacheGetHandler(this.cacheExpire)
      let newTag = []
      const newKeys = []
      if (typeof tag === 'object' && tag.length) {
        newTag = tag.map(item => {
          newKeys.push(item.key)
          if (item.key === key) {
            item.expire = expire === 0 ? 0 : this.time() + expire
          }
          return item
        })
      }
      if (!newKeys.length || newKeys.indexOf(key) === -1) {
        newTag.push({
          key: key,
          expire: expire === 0 ? 0 : this.time() + expire
        })
      }
      this.cacheSetHandler(this.cacheExpire, newTag)
    }
  }

  /**
	 * 缓存是否过期,过期自动删除
	 * @param {string} key
	 * @param bool bool true = 删除,false = 不删除
	 */
  getExpireCacheKey(key, bool) {
    try {
      const tag = this.cacheGetHandler(this.cacheExpire)
      let time = 0
      let index = false
      if (typeof tag === 'object' && tag.length) {
        tag.map((item, i) => {
          if (item.key === key) {
            time = item.expire
            index = i
          }
        })
        if (time) {
          const newTime = parseInt(time)
          if (time && time < this.time() && !Number.isNaN(newTime)) {
            if (bool === true) {
              this.cacheClearHandler(key)
              if (index !== false) {
                tag.splice(index, 1)
                this.cacheSetHandler(this.cacheExpire, tag)
              }
            }
            return false
          } else { return true }
        } else {
          return !!this.cacheGetHandler(key)
        }
      }
      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }

  /**
   * 设置缓存
   * @param {Object} key
   * @param {Object} data
   * @param expire
   */
  set(key, data, expire) {
    if (data === undefined) {
      return true
    }
    if (typeof data === 'object') { data = JSON.stringify(data) }
    try {
      this.setExpireCacheKey(key, expire)
      return this.cacheSetHandler(key, data)
    } catch (e) {
      console.error(e)
      return false
    }
  }

  /**
   * 检测缓存是否存在
   * @param {string} key
   * @param isDel
   */
  has(key) {
    this.clearOverdue()
    return this.getExpireCacheKey(key, true)
  }

  /**
   * 获取缓存
   * @param  {string} key
   * @param $isJson
   */
  get(key, $isJson = false) {
    this.clearOverdue()
    try {
      const isBe = this.getExpireCacheKey(key, true)
      const data = this.cacheGetHandler(key)
      if (data && isBe) {
        if ($isJson || $isJson === undefined) { return JSON.parse(data) } else { return data }
      }
    } catch (e) {
      console.error(e)
    }

    return null
  }

  /**
	 * 删除缓存
	 * @param {Object} key
	 */
  clear(key) {
    try {
      const cacheValue = this.cacheGetHandler(this.cacheExpire)
      let index = false
      if (cacheValue && typeof cacheValue === 'object' && cacheValue.length) {
        cacheValue.map((item, i) => {
          if (item.key === key) {
            index = i
          }
        })

        if (index !== false) {
          cacheValue.splice(index, 1)
        }
        this.cacheSetHandler(this.cacheExpire, cacheValue)
      }
      return this.cacheClearHandler(key)
    } catch (e) {
      console.error(e)
      return false
    }
  }

  /**
	 * 清除过期缓存
	 */
  clearOverdue() {
    const cacheValue = this.cacheGetHandler(this.cacheExpire)
    const time = this.time()
    const newBeOverdueValue = []
    const newTagValue = []
    // console.debug("clearOverdue", cacheValue)

    if (cacheValue && typeof cacheValue === 'object' && cacheValue.length) {
      cacheValue.map(item => {
        if (item) {
          if ((item.expire !== undefined && item.expire > time) || item.expire === 0) {
            newTagValue.push(item)
          } else {
            newBeOverdueValue.push(item.key)
          }
        }
      })
    }
    // 保存没有过期的缓存标签
    if (newTagValue.length !== cacheValue.length) {
      this.cacheSetHandler(this.cacheExpire, newTagValue)
    }
    // 删除过期缓存
    newBeOverdueValue.forEach(k => {
      this.cacheClearHandler(k)
    })
  }
}

export default new Cache()
