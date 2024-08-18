<template>
  <img :src="currentSrc" @error="loadFallback" :alt="alt">
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    fallback: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentSrc: this.src
    };
  },
  methods: {
    loadFallback() {
      this.currentSrc = this.fallback;
    }
  }
};
</script>

<style scoped>
img {
  max-width: 100%;
}
</style>
