<template>
  <div class="card">
    <span class="actions">
      <a href="#/salas/cadastrar" class="button-s1">Adicionar sala</a>
    </span>
    <div class="card-block">
      <table class="table-s1">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Capacidade</th>
            <th style="text-align: center">Ar Condicionado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sala in salas" v-bind:key="sala.id">
            <td>{{sala.nome}}</td>
            <td>{{sala.capacidade}}</td>
            <td style="text-align: center">
              <template v-if="sala.arCondicionado">
                <icon name="thumbs-up" class="thumbs-up"></icon>
              </template>
              <template v-else>
                <icon name="thumbs-down" class="thumbs-down"></icon>
              </template>
            </td>
            <td>
              <div class="btn-group">
                <button v-on:click="edit(sala)" v-tooltip.bottom="{ content: 'Editar', class:'red' }">
                  <icon name="edit"></icon>
                </button>
                <button v-on:click="remove(sala)" v-tooltip.bottom="{ content: 'Remover', class: 'red' }">
                  <icon name="trash"></icon>
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
import 'vue-awesome/icons/thumbs-up'
import 'vue-awesome/icons/thumbs-down'

export default {
  data () {
    return {
      salas: []
    }
  },
  created () {
    this.updateList()
  },
  methods: {
    updateList () {
      axios.get(`${window.apiHostname}/api/v1/salas`)
        .then(response => {
          this.salas = response.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    remove (sala) {
      axios.delete(`${window.apiHostname}/api/v1/salas/${sala.id}`)
        .then(response => {
          this.$refs.simplert.openSimplert({
            title: 'Ok',
            message: 'Sala removida com sucesso',
            type: 'info'
          })
          this.updateList()
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Erro ao tentar excluir sala',
            type: 'alert'
          })
        })
    },
    edit (sala) {
      this.$router.push(`/salas/editar/${sala.id}`)
    }
  },
  components: {
    Simplert
  }
}
</script>

<style lang="scss" scoped>
.thumbs-up {
  color: teal;
}
.thumbs-down {
  color: darkred;
}
</style>
