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
                <button v-on:click="edit(turma)">E</button>
                <button v-on:click="remove(turma)">X</button>
                <button v-on:click="disciplinas(turma)">D</button>
                <button v-on:click="horarios(turma)">H</button>
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
