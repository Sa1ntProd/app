export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error('Storage save error:', e)
  }
}

export function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('Storage load error:', e)
    return null
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.error('Storage remove error:', e)
  }
}

export function loadResultsFromStorage() {
  return loadFromStorage('verification_results')
}

export function saveResultsToStorage(results) {
  saveToStorage('verification_results', results)
}