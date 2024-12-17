<template>
  <button @click="increment">Count: {{ count }}</button>
</template>

<script lang="ts">
export default {
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    increment() {
      this.count++;
    },
  },
}
</script>

<style>
.hello {
  background-color: red;
}
</style>
