<template>
  <div class="container">
    <Breadcrumb :list="breadcrumbs"></Breadcrumb>
    <div class="card">
      <div class="container__row">
        <div class="container__col-12 right-aligned">
          <a href="#/ensalamentos/cadastrar" class="button-s1">Adicionar ensalamento</a>
        </div>
      </div>
      <div class="container__row">
        <div class="container__col-12 auto-scrolled">
          <table class="table-s1">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ensalamento in ensalamentos" v-bind:key="ensalamento.id">
                <td>{{ensalamento.titulo}}</td>
                <td>{{status[ensalamento.status]}}</td>
                <td>
                  <div class="btn-group">
                    <button v-on:click="remove(ensalamento)" v-tooltip.bottom="{ content: 'Remover'}">
                      <icon name="trash"></icon>
                    </button>
                    <button v-if="(ensalamento.status === 'P')" v-on:click="edit(ensalamento)" v-tooltip.bottom="{ content: 'Editar'}">
                      <icon name="edit"></icon>
                    </button>
                    <button v-if="(ensalamento.status === 'P')" v-on:click="$router.push(`/ensalamentos/${ensalamento.id}`)" v-tooltip.bottom="{ content: 'Visualizar ensalamento'}">
                      <icon name="calendar"></icon>
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
import 'vue-awesome/icons/thumbs-up'
import 'vue-awesome/icons/thumbs-down'

export default {
  components: {
    Breadcrumb,
    Simplert
  },
  data () {
    return {
      ensalamentos: [],
      breadcrumbs: [
        { name: 'Ensalamentos', link: '#/ensalamentos', class: 'current' }
      ],
      status: {
        A: 'Aguardando',
        T: 'Em trabalho',
        E: 'Erro',
        P: 'Pronto'
      },
      timer: ''
    }
  },
  created () {
    this.updateList()
    this.timer = setInterval(this.updateList, 8000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    updateList () {
      axios.get(`${window.apiHostname}/api/v1/ensalamentos`)
        .then(response => {
          this.ensalamentos = response.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    remove (ensalamento) {
      axios.delete(`${window.apiHostname}/api/v1/ensalamentos/${ensalamento.id}`)
        .then(response => {
          this.$refs.simplert.openSimplert({
            title: 'Ok',
            message: 'Ensalamento removida com sucesso',
            type: 'info'
          })
          this.updateList()
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Erro ao tentar excluir ensalamento',
            type: 'alert'
          })
        })
    },
    edit (ensalamento) {
      this.$router.push(`/ensalamentos/editar/${ensalamento.id}`)
    }
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
