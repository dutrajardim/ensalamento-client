<template>
  <div class="container">
    <Breadcrumb :list="breadcrumbs"></Breadcrumb>
    <div class="card">
      <div class="container__row">
        <div class="container__col-12 right-aligned">
          <a href="#/formacoes/cadastrar" class="button-s1">Adicionar formação</a>
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
              <tr v-for="formacao in formacoes" v-bind:key="formacao.id">
                <td>{{formacao.nome}}</td>
                <td>
                  <div class="btn-group">
                    <button v-on:click="edit(formacao)" v-tooltip.bottom='{ content: "Editar", class: "red"}'>
                      <icon name="edit"></icon>
                    </button>
                    <button v-on:click="remove(formacao)" v-tooltip.bottom='{ content: "Remover", class: "red"}'>
                      <icon name="trash"></icon>
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

export default {
  components: {
    Simplert,
    Breadcrumb
  },
  data () {
    return {
      formacoes: [],
      breadcrumbs: [
        { name: 'Formações', link: '#/formacoes', class: 'current' }
      ]
    }
  },
  created () {
    this.updateList()
  },
  methods: {
    updateList () {
      axios.get(`${window.apiHostname}/api/v1/formacoes`)
        .then(response => {
          this.formacoes = response.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    remove (formacao) {
      axios.delete(`${window.apiHostname}/api/v1/formacoes/${formacao.id}`)
        .then(response => {
          this.$refs.simplert.openSimplert({
            title: 'Ok',
            message: 'Formação removida com sucesso',
            type: 'info'
          })
          this.updateList()
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Erro ao tentar excluir formação',
            type: 'alert'
          })
        })
    },
    edit (formacao) {
      this.$router.push(`/formacoes/editar/${formacao.id}`)
    }
  }
}
</script>

<style lang="scss">

</style>
