export const API_BASE = '/api/proxy?url='
export const ALLOWED_HOSTS = [
  'linkvertise.com',
  'lootlink.org',
  'lootlinks.co',
  'lootdest.info',
  'lootdest.org',
  'lootdest.com',
  'links-loot.com',
  'loot-links.com',
  'best-links.org',
  'lootlinks.com',
  'loot-labs.com',
  'lootlabs.com',
  'loot-link.com',
  'work.ink',
  'auth.platorelay.com',
  'keyrblx.com',
  'pandadevelopment.net'
]
export const EXAMPLE_URLS = [
  'https://linkvertise.com/example',
  'https://lootlink.org/example',
  'https://lootlinks.co/example',
  'https://lootdest.info/example',
  'https://lootdest.org/example',
  'https://lootdest.com/example',
  'https://links-loot.com/example',
  'https://loot-links.com/example',
  'https://best-links.org/example',
  'https://lootlinks.com/example',
  'https://loot-labs.com/example',
  'https://lootlabs.com/example',
  'https://loot-link.com/example',
  'https://work.ink/example',
  'https://auth.platorelay.com/example',
  'https://keyrblx.com/example',
  'https://pandadevelopment.net/example'
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
