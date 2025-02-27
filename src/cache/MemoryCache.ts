import ICache from "./ICache"
import {isNumber} from '../utils'

interface MemoryCacheItem<T = any> {
  data: T,
  timeout: number,
  cacheTime: number
}

/**
 * 基于内存的缓存
 */
export default class MemoryCache<V> implements ICache<V> {
  private cacheMap: {[key: string]: MemoryCacheItem<V>} = {}

  // 数据是否超时
  has(key: string): boolean {
    return this.get(key) !== undefined
  }

  delete(key: string) {
    return delete this.cacheMap[key]
  }

  get(key: string): V | undefined {
    const value = this.cacheMap[key]

    if (!value || (Date.now() - value.cacheTime) > value.timeout) {
      delete this.cacheMap[key]
      return undefined
    } else {
      return value.data
    }
  }

  set(key: string, value: V, timeout: number): V {
    if (!isNumber(timeout) || timeout <= 0) return value

    this.cacheMap[key] = {
      data: value,
      timeout,
      cacheTime: Date.now()
    }
    return value
  }

  clear(): void {
    this.cacheMap = {}
  }
}
