<template>
  <div class="step-container fade-in">
    <div class="header">
      <h2>Шаг 2 из 3: Главная страница паспорта</h2>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 66%"></div>
      </div>
    </div>
    
    <CaptureComponent
      :capture-type="'document'"
      :step-number="2"
      :shared-camera-stream="cameraStream"
      :current-step-number="currentStepNumber"
      @photo-captured="handleCapture"
      @request-camera="handleRequestCamera"
      @switch-camera="handleSwitchCamera"
      @back="$router.push('/selfie')"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import CaptureComponent from '@/components/CaptureComponent.vue'

export default {
  name: 'PassportMainView',
  components: {
    CaptureComponent
  },
  computed: {
    ...mapState(['cameraStream']),
    currentStepNumber() {
      return 2
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
      this.saveResult({ step: 'passportMain', data })
      this.$router.push('/passport-registration')
    }
  },
  beforeUnmount() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop())
    }
  }
}
</script>