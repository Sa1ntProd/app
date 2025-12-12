<template>
  <div class="capture-area">
    <div v-if="!capturedImage">
      <!-- Камера всегда видна -->
      <div class="camera-container">
        <div class="video-wrapper">
          <video ref="video" autoplay playsinline muted></video>
          <canvas ref="overlayCanvas" class="overlay-canvas"></canvas>
          
          <!-- Кнопка включения камеры поверх видео -->
          <div v-if="!isCameraActive" class="camera-prompt">
            <div class="camera-prompt-content">
              <div class="camera-icon">📹</div>
              <p v-if="!cameraPermissionDenied">Для продолжения необходим доступ к камере</p>
              <p v-else class="error-text">Доступ к камере запрещен</p>
              <button v-if="!cameraPermissionDenied" @click="requestCamera" class="btn btn-primary">
                Разрешить доступ к камере
              </button>
              <p v-else class="helper-text">
                Разрешите доступ к камере в настройках браузера
              </p>
            </div>
          </div>
        </div>
        
        <div v-if="isCameraActive" class="camera-controls">
          <button @click="capturePhoto" class="btn btn-primary btn-large">
            <span class="btn-icon capture-icon">●</span>
            <span>Сделать фото</span>
          </button>
          <button @click="switchCamera" class="btn-switch-camera" v-if="hasMultipleCameras" title="Переключить камеру">
            <span class="switch-icon">↻</span>
          </button>
        </div>
      </div>

      <div v-if="statusMessage" :class="'status-message status-' + statusType">
        {{ statusMessage }}
      </div>

      <div v-if="isProcessing" class="spinner"></div>
    </div>

    <div v-else class="preview-container">
      <h3>Предпросмотр</h3>
      <img :src="capturedImage" class="preview-image" alt="Captured">
      <div class="actions">
        <button @click="retake" class="btn btn-secondary">
          <span class="btn-icon">↻</span>
          <span>Переснять</span>
        </button>
        <button @click="confirmPhoto" class="btn btn-primary">
          <span class="btn-icon">✓</span>
          <span>Далее</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getResponsiveConfig, OVERLAY_CONFIG } from '@/config/overlay-config'
import { saveToStorage, loadFromStorage, removeFromStorage } from '@/utils/storage'

export default {
  name: 'CaptureComponent',
  props: {
    captureType: {
      type: String,
      required: true,
      validator: (value) => ['face', 'document'].includes(value)
    },
    stepNumber: {
      type: Number,
      required: true
    },
    sharedCameraStream: {
      type: MediaStream,
      default: null
    },
    currentStepNumber: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      capturedImage: null,
      animationFrameId: null,
      currentFacingMode: 'user',
      hasMultipleCameras: false,
      cameraPermissionDenied: false,
      statusMessage: '',
      statusType: 'info',
      isProcessing: false,
      debugInfo: {},
      config: null
    }
  },
  computed: {
    isCameraActive() {
      return this.sharedCameraStream && this.sharedCameraStream.active
    }
  },
  mounted() {
    console.log('Component mounted, stepNumber:', this.stepNumber)
    this.loadConfig()
    this.checkCameraDevices()
    this.loadFromStorage()
    
    window.addEventListener('resize', this.handleResize)
    
    if (this.isCameraActive) {
      this.$nextTick(() => {
        this.setupVideo()
      })
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    this.cleanup()
  },
  watch: {
    sharedCameraStream(newStream) {
      if (newStream && newStream.active) {
        this.$nextTick(() => {
          this.setupVideo()
        })
      }
    }
  },
  methods: {
    loadConfig() {
      this.config = getResponsiveConfig(this.captureType)
      console.log('Loaded config for', this.captureType, this.config)
    },
    handleResize() {
      this.loadConfig()
      
      if (this.isCameraActive && !this.capturedImage) {
        const canvas = this.$refs.overlayCanvas
        const video = this.$refs.video
        if (canvas && video && video.videoWidth) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }
      }
    },
    async checkCameraDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        this.hasMultipleCameras = videoDevices.length > 1
        console.log('Video devices found:', videoDevices.length)
      } catch (error) {
        console.error('Error checking camera devices:', error)
      }
    },
    requestCamera() {
      console.log('Requesting camera access...')
      this.$emit('request-camera', this.captureType === 'face' ? 'user' : 'environment')
    },
    async setupVideo() {
      console.log('Setting up video...')
      const video = this.$refs.video
      if (!video || !this.sharedCameraStream) {
        console.error('Video element or stream not available')
        return
      }

      try {
        video.srcObject = this.sharedCameraStream
        console.log('Video srcObject set')
        
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Video load timeout'))
          }, 10000)

          if (video.readyState >= 2) {
            clearTimeout(timeout)
            video.play().then(resolve).catch(reject)
            return
          }

          video.onloadedmetadata = async () => {
            console.log('Video metadata loaded, dimensions:', video.videoWidth, 'x', video.videoHeight)
            clearTimeout(timeout)
            try {
              await video.play()
              console.log('Video playing')
              resolve()
            } catch (playError) {
              console.error('Play error:', playError)
              reject(playError)
            }
          }

          video.onerror = (e) => {
            console.error('Video error:', e)
            clearTimeout(timeout)
            reject(new Error('Video load error'))
          }
        })

        console.log('Video setup complete')
        await this.$nextTick()
        this.initOverlay()
      } catch (error) {
        console.error('Setup video error:', error)
        this.statusMessage = 'Ошибка инициализации видео: ' + error.message
        this.statusType = 'error'
      }
    },
    initOverlay() {
      const video = this.$refs.video
      const canvas = this.$refs.overlayCanvas
      
      if (!video || !canvas) {
        console.error('Video or canvas not found for overlay')
        return
      }

      const setCanvasSize = () => {
        if (video.videoWidth && video.videoHeight) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          console.log('Canvas size set:', canvas.width, 'x', canvas.height)
        } else {
          canvas.width = OVERLAY_CONFIG.camera.defaultWidth
          canvas.height = OVERLAY_CONFIG.camera.defaultHeight
          console.log('Canvas size set to default')
        }
      }

      setCanvasSize()

      if (this.captureType === 'face') {
        this.drawFaceOverlay()
      } else {
        this.drawDocumentOverlay()
      }
    },
    drawFaceOverlay() {
      const canvas = this.$refs.overlayCanvas
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      const config = this.config
      
      const drawFrame = () => {
        if (!this.isCameraActive) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const centerX = canvas.width / 2 + (canvas.width * config.centerOffsetX)
        const centerY = canvas.height / 2 + (canvas.height * config.centerOffsetY)
        
        const radiusX = canvas.width * config.radiusX
        const radiusY = canvas.height * config.radiusY

        ctx.strokeStyle = config.strokeColor
        ctx.lineWidth = config.strokeWidth
        ctx.setLineDash(config.dashPattern)
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.setLineDash([])

        if (config.innerOval && config.innerOval.enabled) {
          ctx.strokeStyle = config.innerOval.strokeColor
          ctx.lineWidth = config.innerOval.strokeWidth
          ctx.beginPath()
          ctx.ellipse(centerX, centerY, radiusX * config.innerOval.scale, radiusY * config.innerOval.scale, 0, 0, 2 * Math.PI)
          ctx.stroke()
        }

        const textConfig = config.text
        ctx.fillStyle = textConfig.color
        ctx.textAlign = 'center'
        ctx.shadowColor = textConfig.shadowColor
        ctx.shadowBlur = textConfig.shadowBlur
        ctx.shadowOffsetX = textConfig.shadowOffset
        ctx.shadowOffsetY = textConfig.shadowOffset
        
        ctx.font = `bold ${textConfig.mainFontSize}px Arial`
        ctx.fillText(textConfig.main, centerX, canvas.height + textConfig.mainOffsetY)
        
        ctx.font = `bold ${textConfig.secondaryFontSize}px Arial`
        ctx.fillText(textConfig.secondary, centerX, canvas.height + textConfig.secondaryOffsetY)
        
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        this.animationFrameId = requestAnimationFrame(drawFrame)
      }

      drawFrame()
    },
    drawDocumentOverlay() {
      const canvas = this.$refs.overlayCanvas
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      const config = this.config
      
      const drawFrame = () => {
        if (!this.isCameraActive) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const centerX = canvas.width / 2 + (canvas.width * config.centerOffsetX)
        const centerY = canvas.height / 2 + (canvas.height * config.centerOffsetY)
        const rectWidth = canvas.width * config.width
        const rectHeight = canvas.height * config.height
        const x = centerX - rectWidth / 2
        const y = centerY - rectHeight / 2

        ctx.fillStyle = config.overlayColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.clearRect(x, y, rectWidth, rectHeight)

        ctx.strokeStyle = config.borderColor
        ctx.lineWidth = config.borderWidth
        ctx.strokeRect(x, y, rectWidth, rectHeight)

        const cornerLength = config.corners.length
        ctx.strokeStyle = config.corners.color
        ctx.lineWidth = config.corners.width

        ctx.beginPath()
        ctx.moveTo(x, y + cornerLength)
        ctx.lineTo(x, y)
        ctx.lineTo(x + cornerLength, y)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x + rectWidth - cornerLength, y)
        ctx.lineTo(x + rectWidth, y)
        ctx.lineTo(x + rectWidth, y + cornerLength)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x, y + rectHeight - cornerLength)
        ctx.lineTo(x, y + rectHeight)
        ctx.lineTo(x + cornerLength, y + rectHeight)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x + rectWidth - cornerLength, y + rectHeight)
        ctx.lineTo(x + rectWidth, y + rectHeight)
        ctx.lineTo(x + rectWidth, y + rectHeight - cornerLength)
        ctx.stroke()

        const textConfig = config.text
        ctx.fillStyle = textConfig.color
        ctx.textAlign = 'center'
        ctx.shadowColor = textConfig.shadowColor
        ctx.shadowBlur = textConfig.shadowBlur
        ctx.shadowOffsetX = textConfig.shadowOffset
        ctx.shadowOffsetY = textConfig.shadowOffset
        
        ctx.font = `bold ${textConfig.mainFontSize}px Arial`
        ctx.fillText(textConfig.main, centerX, y - textConfig.topMargin)
        
        ctx.font = `bold ${textConfig.secondaryFontSize}px Arial`
        ctx.fillText(textConfig.secondary, centerX, y + rectHeight + textConfig.bottomMargin)
        
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        this.animationFrameId = requestAnimationFrame(drawFrame)
      }

      drawFrame()
    },
    async capturePhoto() {
      const video = this.$refs.video
      
      if (!video) {
        console.error('Video element not found')
        this.statusMessage = 'Видео элемент не найден. Попробуйте снова.'
        this.statusType = 'error'
        return
      }

      if (!this.isCameraActive) {
        console.error('Camera is not active')
        this.statusMessage = 'Камера не активна. Включите камеру.'
        this.statusType = 'error'
        return
      }

      if (!video.videoWidth || !video.videoHeight) {
        console.error('Video dimensions not ready:', video.videoWidth, video.videoHeight)
        this.statusMessage = 'Камера еще не готова. Попробуйте снова.'
        this.statusType = 'error'
        return
      }

      try {
        const tracks = this.sharedCameraStream ? this.sharedCameraStream.getVideoTracks() : []
        const settings = tracks.length > 0 ? tracks[0].getSettings() : {}
        
        let imageBlob = null
        
        if (typeof ImageCapture !== 'undefined' && tracks.length > 0) {
          try {
            const imageCapture = new ImageCapture(tracks[0])
            const photoBlob = await imageCapture.takePhoto()
            imageBlob = photoBlob
            console.log('Used ImageCapture API for photo capture')
          } catch (imageCaptureError) {
            console.log('ImageCapture API not available, using canvas method:', imageCaptureError)
          }
        }
        
        let canvas = null
        if (!imageBlob) {
          canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          
          ctx.save()
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          ctx.restore()
          
          imageBlob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/jpeg', OVERLAY_CONFIG.camera.jpegQuality)
          })
        }
        
        const reader = new FileReader()
        this.capturedImage = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(imageBlob)
        })
        
        let resolution = 'unknown'
        if (canvas) {
          resolution = `${canvas.width}x${canvas.height}`
        } else if (imageBlob) {
          const img = new Image()
          const imgUrl = URL.createObjectURL(imageBlob)
          await new Promise((resolve, reject) => {
            img.onload = () => {
              resolution = `${img.width}x${img.height}`
              URL.revokeObjectURL(imgUrl)
              resolve()
            }
            img.onerror = reject
            img.src = imgUrl
          })
        } else {
          resolution = `${video.videoWidth}x${video.videoHeight}`
        }
        
        this.debugInfo = {
          timestamp: new Date().toISOString(),
          captureMethod: imageBlob && !canvas ? 'ImageCapture API' : 'canvas',
          resolution: resolution,
          fileSize: this.formatFileSize(this.capturedImage.length * 0.75),
          captureType: this.captureType,
          facingMode: settings.facingMode || this.currentFacingMode,
          deviceLabel: tracks.length > 0 ? tracks[0].label : 'Unknown',
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          userAgent: navigator.userAgent,
          platform: navigator.platform
        }

        console.log('Photo captured:', this.debugInfo)
        
        this.statusMessage = ''
        this.statusType = 'info'
      } catch (error) {
        console.error('Capture error:', error)
        this.statusMessage = 'Ошибка при захвате фото: ' + error.message
        this.statusType = 'error'
      }
    },
    switchCamera() {
      console.log('Switching camera...')
      this.$emit('switch-camera')
    },
    retake() {
      console.log('Retaking photo...')
      this.capturedImage = null
      this.debugInfo = {}
      this.statusMessage = ''
      this.statusType = 'info'
      this.removeFromStorage()
      
      this.$nextTick(() => {
        if (this.isCameraActive) {
          const video = this.$refs.video
          if (video && video.readyState >= 2) {
            console.log('Reinitializing overlay after retake')
            this.initOverlay()
          } else {
            console.log('Waiting for video to be ready...')
            this.setupVideo()
          }
        } else {
          console.log('Camera not active, requesting camera...')
          this.requestCamera()
        }
      })
    },
    confirmPhoto() {
      this.saveToStorage()
      this.$emit('photo-captured', {
        image: this.capturedImage,
        debug: this.debugInfo
      })
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    },
    saveToStorage() {
      saveToStorage(`step_${this.stepNumber}`, {
        image: this.capturedImage,
        debug: this.debugInfo
      })
    },
    loadFromStorage() {
      const data = loadFromStorage(`step_${this.stepNumber}`)
      if (data) {
        this.capturedImage = data.image
        this.debugInfo = data.debug
        console.log('Loaded from storage: step_' + this.stepNumber)
      }
    },
    removeFromStorage() {
      removeFromStorage(`step_${this.stepNumber}`)
    },
    cleanup() {
      console.log('Cleanup component...')
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId)
        this.animationFrameId = null
      }
    }
  }
}
</script>