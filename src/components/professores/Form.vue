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
        <div class="container__col-12 centered">
          <form action="POST" v-on:submit.prevent="save($event)" class="form-s1">
            <input type="text" hidden v-model="id">
            <ul>
              <li>
                <label for="abreviacao">Nome</label>
                <input type="text" v-model="nome">
                <span>Ex. Chuck Norris</span>
              </li>
              <li>
                <input type="reset" value="Cancelar" class="button-s1" v-on:click="$router.push(`/professores`)">
                <input type="submit" value="Salvar" class="button-s1 inverse">
              </li>
            </ul>
          </form>
        </div>
        <simplert isUseRadius=true isUseIcon=true ref="simplert"></simplert>
      </div>
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
        { name: 'Professores', link: '#/professores' }
      ],
      nome: '',
      id: ''
    }
  },
  created () {
    const id = this.$route.params.id
    if (typeof id !== 'undefined') {
      axios.get(`${window.apiHostname}/api/v1/professores/${id}`)
        .then(response => {
          this.breadcrumbs.push({
            name: `Editar professor (${response.data.nome})`,
            link: `#/professores/${id}/editar`,
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
        name: 'Novo professor',
        link: `#/professores/cadastrar`,
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
          axios.put(`${window.apiHostname}/api/v1/professores/${this.id}`, data)
            .then(response => {
              this.$refs.simplert.openSimplert({
                title: 'Dados salvos',
                message: 'Dados alterados com sucesso',
                type: 'info'
              })
              this.$router.push('/professores')
            })
            .catch(e => {
              this.$refs.simplert.openSimplert({
                title: 'Erro',
                message: 'Ocorreu um erro ao tentar salvar os dados',
                type: 'alert'
              })
            })
        } else {
          axios.post(`${window.apiHostname}/api/v1/professores`, data)
            .then(response => {
              this.$refs.simplert.openSimplert({
                title: 'Dados salvos',
                message: 'Professor cadastrada com sucesso',
                type: 'info'
              })
              this.$router.push('/professores')
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

<style lang="sass" scoped>

</style>
