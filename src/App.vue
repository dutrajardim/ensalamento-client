<template>
  <div id="app">
    <div class="background"></div>
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
.background {
  height: 400px;
  width: 100%;
  border-bottom: 1px solid #999;
  z-index: -999;
  position: absolute;
  opacity: 0.6; 
  filter: alpha(opacity=60);
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#d10e11+0,ffafaf+100&1+0,1+26,0.7+36,0+100 */
  background-image: url("/static/banner_sitenovo_semunainforma-1918x1039.jpg");
  background-size: 750px;
  background-color: #e1dbdb;
  background-repeat: no-repeat;
}
h1 {
  font-size: 1.4em;
}
</style>
