<template>
  <div class="step-container fade-in">
    <div class="results-container">
      <h1>Результаты верификации</h1>
      
      <div class="result-section">
        <h3>1.Селфи</h3>
        <img :src="results.selfie.image" alt="Selfie" class="result-image">
        <div class="debug-info">
          <h4>Отладочная информация:</h4>
          <pre>{{ formatDebugInfo(results.selfie.debug) }}</pre>
        </div>
      </div>

      <div class="result-section">
        <h3>2.Главная страница паспорта</h3>
        <img :src="results.passportMain.image" alt="Passport Main" class="result-image">
        <div class="debug-info">
          <h4>Отладочная информация:</h4>
          <pre>{{ formatDebugInfo(results.passportMain.debug) }}</pre>
        </div>
      </div>

      <div class="result-section">
        <h3>3.Страница с пропиской</h3>
        <img :src="results.passportRegistration.image" alt="Passport Registration" class="result-image">
        <div class="debug-info">
          <h4>Отладочная информация:</h4>
          <pre>{{ formatDebugInfo(results.passportRegistration.debug) }}</pre>
        </div>
      </div>

      <div class="result-actions">
        <button @click="downloadResults" class="btn btn-secondary">
          <span class="btn-icon">⬇</span>
          <span>Скачать результаты</span>
        </button>
        <button @click="resetApp" class="btn btn-primary">
          <span class="btn-icon">↻</span>
          <span>Начать заново</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ResultsView',
  computed: {
    ...mapState(['results'])
  },
  mounted() {
    this.checkForSavedResults()
  },
  methods: {
    ...mapMutations(['CLEAR_STORAGE']),
    
    formatDebugInfo(debug) {
      return JSON.stringify(debug, null, 2)
    },
    
    checkForSavedResults() {
      const data = localStorage.getItem('verification_results')
      if (!data) {
        alert('Результаты не найдены. Пожалуйста, пройдите верификацию сначала.')
        this.$router.push('/')
      }
    },
    
    downloadResults() {
      console.log('Downloading results...')
      const data = {
        timestamp: new Date().toISOString(),
        user: 'Sa1nt',
        results: {
          selfie: this.results.selfie.debug,
          passportMain: this.results.passportMain.debug,
          passportRegistration: this.results.passportRegistration.debug
        },
        images: {
          selfie: this.results.selfie.image,
          passportMain: this.results.passportMain.image,
          passportRegistration: this.results.passportRegistration.image
        }
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `verification_results_${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    
    resetApp() {
      if (confirm('Вы уверены, что хотите начать заново? Все данные будут удалены.')) {
        console.log('Resetting app...')
        this.CLEAR_STORAGE()
        localStorage.clear()
        this.$router.push('/')
      }
    }
  }
}
</script>