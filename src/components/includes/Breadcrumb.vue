<template>
  <div class="breadcrumb">
    <ul>
      <li v-for="(anchor, k) in list" v-bind:key="k" v-bind:class="anchor.class">
        <a v-bind:href="anchor.link">{{anchor.name}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array
    }
  }
}
</script>
