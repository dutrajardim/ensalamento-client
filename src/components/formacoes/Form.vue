<template>
  <div class="container">
    <Breadcrumb :list="breadcrumbs"></Breadcrumb>
    <div class="card">
      <div class="container__row">
        <div class="container__col-12">
          <div class="btn-group">
            <button v-on:click="$router.go(-1)">
              <icon name="arrow-left"></icon>
            </button>
          </div>
        </div>
      </div>
      <div class="container__col-12 centered">
        <form action="POST" v-on:submit.prevent="save($event)" class="form-s1">
          <input type="text" hidden v-model="id">
          <ul>
            <li>
              <label for="nome">Nome</label>
              <input type="text" v-model="nome">
              <span>Entre com o nome da formação</span>
            </li>
            <li>
              <input type="reset" value="Cancelar" class="button-s1" v-on:click="$router.push(`/formacoes`)">
              <input type="submit" value="Salvar" class="button-s1 inverse">
            </li>
          </ul>
        </form>
      </div>
      <simplert isUseRadius=true isUseIcon=true ref="simplert"></simplert>
    </div>
  </div>
</template>


<script>
import Breadcrumb from '@/components/includes/Breadcrumb'
import Simplert from 'vue2-simplert'
import axios from 'axios'

export default {
  components: {
    Simplert,
    Breadcrumb
  },
  data () {
    return {
      breadcrumbs: [
        { name: 'Formações', link: '#/formacoes' }
      ],
      id: '',
      nome: ''
    }
  },
  created () {
    const id = this.$route.params.id
    if (typeof id !== 'undefined') {
      axios.get(`${window.apiHostname}/api/v1/formacoes/${id}`)
        .then(response => {
          this.breadcrumbs.push({
            name: `Editar formação (${response.data.nome})`,
            link: `#/formacoes/${id}/editar`,
            class: 'current'
          })
          const data = response.data
          this.id = data.id
          this.nome = data.nome
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Não foi possível recuperar registro para edição',
            type: 'alert'
          })
        })
    } else {
      this.breadcrumbs.push({
        name: 'Nova formação',
        link: `#/formacoes/cadastrar`,
        class: 'current'
      })
    }
  },
  methods: {
    save (e) {
      const data = {
        nome: this.nome
      }

      if (data.nome) {
        if (this.id !== '') {
          axios.put(`${window.apiHostname}/api/v1/formacoes/${this.id}`, data)
            .then(response => {
              this.$refs.simplert.openSimplert({
                title: 'Dados salvos',
                message: 'Dados alterados com sucesso',
                type: 'info'
              })
              this.$router.push('/formacoes')
            })
            .catch(e => {
              this.$refs.simplert.openSimplert({
                title: 'Erro',
                message: 'Ocorreu um erro ao tentar salvar os dados',
                type: 'alert'
              })
            })
        } else {
          axios.post(`${window.apiHostname}/api/v1/formacoes`, data)
            .then(response => {
              this.$refs.simplert.openSimplert({
                title: 'Dados salvos',
                message: 'Formação cadastrada com sucesso',
                type: 'info'
              })
              this.$router.push('/formacoes')
            })
            .catch(e => {
              this.$refs.simplert.openSimplert({
                title: 'Erro',
                message: 'Ocorreu um erro ao tentar salvar os dados',
                type: 'alert'
              })
            })
        }
      } else {
        this.$refs.simplert.openSimplert({
          title: 'Dados incompletos',
          message: 'É necessário preencher os campos',
          type: 'alert'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
