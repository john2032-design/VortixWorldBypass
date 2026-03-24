export const API_BASE = '/api/proxy?url='
export const ALLOWED_HOSTS = [
  'linkvertise.com',
  'work.ink',
  'cuty.io',
  'cety.io',
  'cutynow.com',
  'cuttty.com',
  'cuttlinks.com',
  'mboost.me',
  'ouo.io',
  'rekonise.com',
  'lockr.so'
]
export const EXAMPLE_URLS = [
  'https://linkvertise.com/example',
  'https://work.ink/example',
  'https://mboost.me/example',
  'https://cuty.io/example',
  'https://cutynow.com/example',
  'https://cuttty.com/example',
  'https://cuttlinks.com/example',
  'https://rekonise.com/example',
  'https://ouo.io/example',
  'https://lockr.so/example'
  
]
export function isValidUrl(str) {
  try {
    const u = new URL(str)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}
export function isAllowedUrlString(str) {
  if (!isValidUrl(str)) return false
  try {
    const u = new URL(str)
    let host = u.hostname.toLowerCase()
    if (host.startsWith('www.')) host = host.slice(4)
    return ALLOWED_HOSTS.includes(host)
  } catch {
    return false
  }
}
export async function copyText(text) {
  if (!text) return false
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {}
  try {
    const ta = document.createElement('textarea')
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    return true
  } catch {
    return false
  }
}
