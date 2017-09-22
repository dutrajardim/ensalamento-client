<template>
  <div id="app">
    <Navbar></Navbar>
    <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Navbar from '@/components/includes/Navbar'

export default {
  name: 'app',
  components: {
    Navbar
  }
}
</script>

<style lang="scss">
body {
  background-color: #eee;
}
h1 {
  font-size: 1.4em;
}
</style>
