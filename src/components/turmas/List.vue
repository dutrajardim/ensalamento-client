<template>
  <div class="card">
    <div class="card-block">
      <span class="actions">
        <a href="#/turmas/cadastrar" class="button-s1">Adicionar turma</a>
      </span>
      <table class="table-s1">
        <thead>
          <tr>
            <th>Abreviação</th>
            <th>Descrição</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="turma in turmas" v-bind:key="turma.id">
            <td>{{turma.abreviacao}}</td>
            <td>{{turma.descricao}}</td>
            <td>
              <div class="btn-group">
                <button v-on:click="edit(turma)" v-tooltip.bottom="{ content: 'Editar', class: 'red'}">
                  <icon name="edit"></icon>
                </button>
                <button v-on:click="remove(turma)" v-tooltip.bottom="{ content: 'Remover', class: 'red'}">
                  <icon name="trash"></icon>
                </button>
                <button v-on:click="disciplinas(turma)" v-tooltip.bottom="{ content: 'Visualizar disciplinas', class: 'red'}">
                  <icon name="graduation-cap"></icon>
                </button>
                <button v-on:click="horarios(turma)" v-tooltip.bottom="{ content: 'Visualizar horarios das turmas', class: 'red'}">
                  <icon name="calendar"></icon>
                </button>
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
import 'vue-awesome/icons/trash'
import 'vue-awesome/icons/edit'
import 'vue-awesome/icons/calendar'
import 'vue-awesome/icons/graduation-cap'

export default {
  data () {
    return {
      turmas: []
    }
  },
  created () {
    this.updateList()
  },
  methods: {
    updateList () {
      axios.get(`${window.apiHostname}/api/v1/turmas`)
        .then(response => {
          this.turmas = response.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    remove (turma) {
      axios.delete(`${window.apiHostname}/api/v1/turmas/${turma.id}`)
        .then(response => {
          this.$refs.simplert.openSimplert({
            title: 'Ok',
            message: 'Turma removida com sucesso',
            type: 'info'
          })
          this.updateList()
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Erro ao tentar excluir turma',
            type: 'alert'
          })
        })
    },
    edit (turma) {
      this.$router.push(`/turmas/${turma.id}/editar`)
    },
    disciplinas (turma) {
      this.$router.push(`/turmas/${turma.id}/disciplinas`)
    },
    horarios (turma) {
      this.$router.push(`/turmas/${turma.id}/horarios`)
    }
  },
  components: {
    Simplert
  }
}
</script>

<style lang="scss" scoped>

</style>
