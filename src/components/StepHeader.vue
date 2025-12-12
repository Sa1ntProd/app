<template>
  <div class="header">
    <h2>{{ title }}</h2>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressWidth }"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    step: {
      type: Number,
      required: true
    },
    totalSteps: {
      type: Number,
      default: 3
    }
  },
  computed: {
    progressWidth() {
      return `${(this.step / this.totalSteps) * 100}%`
    }
  }
}
</script>