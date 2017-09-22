<template>
  <div class="card">
    <div class="card-block">
      <span class="actions">
        <a href="#/horarios/cadastrar" class="button-s1">Adicionar horario</a>
      </span>
      <table class="table-s1">
        <thead>
          <tr>
            <th>Ano</th>
            <th>Semestre</th>
            <th>Descrição</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horario in horarios" v-bind:key="horario.id">
            <td>{{horario.ano}}</td>
            <td>{{getSemestre(horario.semestre)}}</td>
            <td>{{horario.descricao}}</td>
            <td>
              <div class="btn-group">
                <button v-on:click="edit(horario)">E</button>
                <button v-on:click="remove(horario)">X</button>
                <button v-on:click="ensalamento(horario)">D</button>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
    <simplert isUseRadius=true isUseIcon=true ref="simplert"></simplert>
  </div>
</template>

<script>
import axios from 'axios'
import Simplert from 'vue2-simplert'
export default {
  data () {
    return {
      horarios: []
    }
  },
  created () {
    this.updateList()
  },
  methods: {
    getSemestre (semestre) {
      switch (semestre) {
        case '1':
          return '1º semestre'
        case '2':
          return '2º semestre'
        default:
          return ''
      }
    },
    updateList () {
      axios.get(`${window.apiHostname}/api/v1/horarios`)
        .then(response => {
          this.horarios = response.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    remove (horario) {
      axios.delete(`${window.apiHostname}/api/v1/horarios/${horario.id}`)
        .then(response => {
          this.$refs.simplert.openSimplert({
            title: 'Ok',
            message: 'Horario removida com sucesso',
            type: 'info'
          })
          this.updateList()
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Erro ao tentar excluir horario',
            type: 'alert'
          })
        })
    },
    edit (horario) {
      this.$router.push(`/horarios/${horario.id}/editar`)
    },
    ensalamento (horario) {
      this.$router.push(`/horarios/${horario.id}/ensalamentos`)
    }
  },
  components: {
    Simplert
  }
}
</script>

<style lang="scss">

</style>
