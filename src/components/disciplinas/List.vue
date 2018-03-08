<template>
  <div class="container">
    <Breadcrumb :list="breadcrumbs"></Breadcrumb>
    <div class="card">
      <div class="container__row">
        <div class="container__col-12 right-aligned">
          <a href="#/disciplinas/cadastrar" class="button-s1">Adicionar disciplina</a>
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
              <tr v-for="disciplina in disciplinas" v-bind:key="disciplina.id">
                <td>{{disciplina.nome}}</td>
                <td>
                  <div class="btn-group">
                    <button v-on:click="edit(disciplina)" v-tooltip.bottom='{ content: "Editar", class: "red"}'>
                      <icon name="edit"></icon>
                    </button>
                    <button v-on:click="remove(disciplina)" v-tooltip.bottom='{ content: "Remover", class: "red"}'>
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
      disciplinas: [],
      breadcrumbs: [
        { name: 'Disciplinas', link: '#/disciplinas', class: 'current' }
      ]
    }
  },
  created () {
    this.updateList()
  },
  methods: {
    updateList () {
      axios.get(`${window.apiHostname}/api/v1/disciplinas`)
        .then(response => {
          this.disciplinas = response.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    remove (disciplina) {
      axios.delete(`${window.apiHostname}/api/v1/disciplinas/${disciplina.id}`)
        .then(response => {
          this.$refs.simplert.openSimplert({
            title: 'Ok',
            message: 'Disciplina removida com sucesso',
            type: 'info'
          })
          this.updateList()
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Erro ao tentar excluir disciplina',
            type: 'alert'
          })
        })
    },
    edit (disciplina) {
      this.$router.push(`/disciplinas/editar/${disciplina.id}`)
    }
  }
}
</script>

<style lang="scss">

</style>
