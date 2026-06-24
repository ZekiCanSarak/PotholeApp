const POTHOLES_KEY = 'potholepal_potholes'
const USER_KEY = 'potholepal_user'

export function loadPotholes() {
  try {
    const data = localStorage.getItem(POTHOLES_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function savePotholes(potholes) {
  try {
    localStorage.setItem(POTHOLES_KEY, JSON.stringify(potholes))
  } catch {
    // localStorage full — skip silently
  }
}

export function loadUser() {
  try {
    const data = localStorage.getItem(USER_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveUser(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {}
}
