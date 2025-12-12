<template>
  <div class="step-container fade-in">
    <div class="content-wrapper">
      <h1>Верификация личности</h1>
      <div class="demo-text">
        <p>Добро пожаловать в систему верификации!</p>
        <p>Для прохождения верификации вам необходимо:</p>
        <ul>
          <li>Сделать селфи</li>
          <li>Сфотографировать главную страницу паспорта</li>
          <li>Сфотографировать страницу с пропиской</li>
        </ul>
        <p class="note">Убедитесь, что у вас хорошее освещение и камера готова к работе.</p>
      </div>
      <button @click="startVerification" class="btn btn-primary">
        Начать верификацию
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StartView',
  methods: {
    startVerification() {
      this.$router.push('/selfie')
    }
  }
}
</script>