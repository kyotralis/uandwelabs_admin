import { DEFAULT_CMS_DATA } from '../data/defaultCms'

const BROADCAST_CHANNEL = 'uandwe_cms_sync_channel'

const API_BASE = '/api/cms'
const DIRECT_API = 'https://uandwelabs-backend.vercel.app/api/cms'

const CMS_CACHE_KEY = 'uandwe_cms_cache'

export function getCachedCms() {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CMS_CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed && typeof parsed === 'object') {
          return deepMerge(DEFAULT_CMS_DATA, parsed)
        }
      }
    } catch {}
  }
  return null
}

export function cacheCmsLocally(data) {
  if (typeof window !== 'undefined' && data) {
    try {
      localStorage.setItem(CMS_CACHE_KEY, JSON.stringify(data))
    } catch {}
  }
}

export function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target
  const result = Array.isArray(target) ? [...target] : { ...target }
  for (const key of Object.keys(source)) {
    const srcVal = source[key]
    const tgtVal = target?.[key]
    if (srcVal === undefined || srcVal === null) continue
    if (Array.isArray(srcVal)) {
      result[key] = srcVal.length > 0 ? srcVal : (tgtVal && tgtVal.length > 0 ? tgtVal : srcVal)
    } else if (typeof srcVal === 'object' && typeof tgtVal === 'object' && !Array.isArray(tgtVal)) {
      result[key] = deepMerge(tgtVal, srcVal)
    } else {
      result[key] = srcVal
    }
  }
  if (target && typeof target === 'object' && !Array.isArray(target)) {
    for (const key of Object.keys(target)) {
      if (!(key in result) || result[key] === undefined) {
        result[key] = target[key]
      }
    }
  }

  // Permanently eliminate legacy 'Purpose Over Noise' and paragraph subtitle from beliefs
  if (
    result.home?.beliefs?.items?.some(it => it.title === 'Purpose Over Noise') ||
    result.home?.beliefs?.subtitle?.toLowerCase().includes('at uandwe labs, we believe')
  ) {
    result.home.beliefs = JSON.parse(JSON.stringify(DEFAULT_CMS_DATA.home.beliefs))
  }

  return result
}

export async function fetchCms() {
  const localCached = getCachedCms()
  const baseSeed = localCached ? localCached : DEFAULT_CMS_DATA

  const endpoints = [API_BASE, DIRECT_API]
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) continue
      const json = await res.json()
      if (json.success && json.data) {
        const serverData = deepMerge(DEFAULT_CMS_DATA, json.data)
        const merged = localCached ? deepMerge(serverData, localCached) : serverData
        cacheCmsLocally(merged)
        return { success: true, data: merged, source: json.source }
      }
    } catch { }
  }

  return { success: !!localCached, data: baseSeed }
}

export async function saveCms(data, passcode = 'uandwe2026') {
  // 1. Immediately cache locally so refresh NEVER loses changes
  cacheCmsLocally(data)

  // 2. Broadcast to open preview tabs for instant zero-latency UI update
  if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
    try {
      const ch = new BroadcastChannel(BROADCAST_CHANNEL)
      ch.postMessage({ type: 'CMS_SYNC', data })
      ch.close()
    } catch { }
  }

  // 3. Persist directly to backend database (try proxy and direct)
  const endpoints = [API_BASE, DIRECT_API]
  let lastError = null

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode || 'uandwe2026',
        },
        body: JSON.stringify({ data }),
      })
      if (!res.ok) continue
      const json = await res.json()
      if (json.success) {
        return { success: true, updatedAt: json.updatedAt }
      }
    } catch (err) {
      lastError = err
    }
  }

  return { success: false, offline: true, error: lastError?.message || 'Server offline' }
}

export async function uploadMedia(file, previousUrl = null, passcode = 'uandwe2026') {
  if (!file) throw new Error('No file provided')

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64Data = e.target.result
      try {
        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-passcode': passcode || 'uandwe2026',
          },
          body: JSON.stringify({
            filename: file.name,
            base64Data,
            previousUrl: previousUrl || null,
          }),
        })
        const json = await res.json()
        if (json.success) {
          resolve({ success: true, path: json.path, filename: json.filename })
          return
        }
      } catch (err) {
        console.warn('[Admin API] Backend upload offline, using embedded data URL fallback:', err.message)
      }
      // Offline fallback: Use Base64 Data URL directly so image works even without backend!
      resolve({ success: true, path: base64Data, filename: file.name, offline: true })
    }
    reader.onerror = () => resolve({ success: false, error: 'Failed reading file' })
    reader.readAsDataURL(file)
  })
}

export { DEFAULT_CMS_DATA }
