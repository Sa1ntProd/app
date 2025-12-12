export async function checkCameraDevices() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(device => device.kind === 'videoinput')
    return videoDevices.length > 1
  } catch (error) {
    console.error('Error checking devices:', error)
    return false
  }
}

export function stopCameraStream(stream) {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}