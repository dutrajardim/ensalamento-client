<template>
  <div class="container">
    <Breadcrumb :list="breadcrumbs"></Breadcrumb>
    <div class="card">
      <div class="container__row">
        <div class="container__col-12 right-aligned">
          <a href="#/professores/cadastrar" class="button-s1">Adicionar professor</a>
        </div>
      </div>
      <div class="container__row">
        <div class="container__col-12 auto-scrolled">
          <table class="table-s1">
            <thead>
              <tr>
                <th>Nome</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="professor in professores" v-bind:key="professor.id">
                <td>{{professor.nome}}</td>
                <td>
                  <div class="btn-group">
                    <button v-on:click="edit(professor)" v-tooltip.bottom="{ content: 'Editar', class: 'red'}">
                      <icon name="edit"></icon>
                    </button>
                    <button v-on:click="remove(professor)" v-tooltip.bottom="{ content: 'Remover', class: 'red'}">
                      <icon name="trash"></icon>
                    </button>
                    <button v-on:click="formacoes(professor)" v-tooltip.bottom="{ content: 'Visualizar formações', class: 'red'}">
                      <icon name="certificate"></icon>
                    </button>
                    <button v-on:click="disciplinas(professor)" v-tooltip.bottom="{ content: 'Visualizar disciplinas', class: 'red'}">
                      <icon name="graduation-cap"></icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
      <simplert isUseRadius=true isUseIcon=true ref="simplert"></simplert>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/includes/Breadcrumb'
import axios from 'axios'
import Simplert from 'vue2-simplert'
import 'vue-awesome/icons/trash'
import 'vue-awesome/icons/edit'
import 'vue-awesome/icons/calendar'
import 'vue-awesome/icons/graduation-cap'
import 'vue-awesome/icons/certificate'

export default {
  components: {
    Simplert,
    Breadcrumb
  },
  data () {
    return {
      professores: [],
      breadcrumbs: [
        { name: 'Professores', link: '#/professores', class: 'current' }
      ]
    }
  },
  created () {
    this.updateList()
  },
  methods: {
    updateList () {
      axios.get(`${window.apiHostname}/api/v1/professores`)
        .then(response => {
          this.professores = response.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    remove (professor) {
      axios.delete(`${window.apiHostname}/api/v1/professores/${professor.id}`)
        .then(response => {
          this.$refs.simplert.openSimplert({
            title: 'Ok',
            message: 'Professor removida com sucesso',
            type: 'info'
          })
          this.updateList()
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Erro ao tentar excluir professor',
            type: 'alert'
          })
        })
    },
    edit (professor) {
      this.$router.push(`/professores/${professor.id}/editar`)
    },
    formacoes (professor) {
      this.$router.push(`/professores/${professor.id}/formacoes`)
    },
    disciplinas (professor) {
      this.$router.push(`/professores/${professor.id}/disciplinas`)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
