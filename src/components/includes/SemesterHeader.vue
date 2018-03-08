<template>
  <div class="btn-group  semesters-header">
    <button v-on:click="callPreviousSemester">
      <icon name="angle-left"></icon>
    </button>
    <div class="semesters-header__text">Ano <b>{{panelAno}}</b> / <b>{{panelSemestre}}</b>º Semestre</div>
    <button v-on:click="callNextSemester">
      <icon name="angle-right"></icon>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    panelAno: {
      type: Number
    },
    panelSemestre: {
      type: Number
    }
  },
  data () {
    return {
      ano: '',
      semestre: ''
    }
  },
  created () {
    this.ano = this.$route.query.ano ? parseInt(this.$route.query.ano) : this.panelAno
    this.semestre = this.$route.query.semestre ? parseInt(this.$route.query.semestre) : this.panelSemestre
  },
  methods: {
    callNextSemester () {
      if ((this.semestre + 1) === 3) {
        this.semestre = 1
        this.ano++
        return true
      }

      this.semestre++
    },
    callPreviousSemester () {
      if ((this.semestre - 1) === 0) {
        this.semestre = 2
        this.ano--
        return true
      }

      this.semestre--
    }
  },
  watch: {
    ano () {
      let ano = this.ano
      let semestre = this.semestre
      this.$emit('data-updated', { ano, semestre })
    },
    semestre () {
      let ano = this.ano
      let semestre = this.semestre
      this.$emit('data-updated', { ano, semestre })
    }
  }
}
</script>

<style lang="scss">
</style>
