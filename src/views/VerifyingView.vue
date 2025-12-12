<template>
  <div class="step-container fade-in">
    <div class="verifying-header">
      <h1>Верификация личности</h1>
    </div>
    <div class="verifying-container">
      <div class="verifying-spinner">
        <div class="spinner-segment" v-for="n in 16" :key="n" :style="{ '--segment-index': n - 1 }"></div>
      </div>
      <h2 class="verifying-text">Данные проходят проверку, пожалуйста ожидайте</h2>
      
      <div class="verifying-list">
        <div class="verifying-item">
          <div class="verifying-dot"></div>
          <span>Фото-селфи</span>
        </div>
        <div class="verifying-item">
          <div class="verifying-dot"></div>
          <span>Главная страница паспорта</span>
        </div>
        <div class="verifying-item">
          <div class="verifying-dot"></div>
          <span>Страница с пропиской</span>
        </div>
      </div>
      
      <p class="verifying-security">Данные верификации хранятся в безопасности с использованием технологий шифрования и защиты на защищенных серверах</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerifyingView',
  mounted() {
    // Переход на результаты через 5 секунд
    setTimeout(() => {
      if (this.$route.name === 'verifying') {
        this.$router.push('/results')
      }
    }, 5000)
  }
}
</script>