<template>
  <div class="step-container fade-in">
    <div class="header">
      <h2>Шаг 1 из 3: Селфи</h2>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 33%"></div>
      </div>
    </div>
    
    <CaptureComponent
      :capture-type="'face'"
      :step-number="1"
      :shared-camera-stream="cameraStream"
      :current-step-number="currentStepNumber"
      @photo-captured="handleCapture"
      @request-camera="handleRequestCamera"
      @switch-camera="handleSwitchCamera"
      @back="$router.push('/')"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CaptureComponent from '@/components/CaptureComponent.vue'

export default {
  name: 'SelfieView',
  components: {
    CaptureComponent
  },
  computed: {
    ...mapState(['cameraStream']),
    currentStepNumber() {
      return 1
    }
  },
  methods: {
    ...mapActions(['requestCamera', 'saveResult']),
    
    handleRequestCamera(facingMode) {
      this.requestCamera(facingMode)
    },
    
    async handleSwitchCamera() {
      try {
        const newFacingMode = this.$store.state.currentFacingMode === 'user' ? 'environment' : 'user'
        await this.requestCamera(newFacingMode)
      } catch (error) {
        alert('Не удалось переключить камеру: ' + error.message)
      }
    },
    
    handleCapture(data) {
      this.saveResult({ step: 'selfie', data })
      this.$router.push('/passport-main')
    }
  },
  beforeUnmount() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop())
    }
  }
}
</script>