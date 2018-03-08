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
              <label for="nome">Titulo</label>
              <input type="text" v-model="titulo">
              <span>Entre com um titulo para o ensalamento</span>
            </li>
            <li v-if="id === ''">
              <label for="ano">Ano</label>
              <input type="number" v-model="ano">
              <span>Ano de referência</span>
            </li>
            <li v-if="id === ''">
              <label for="semestre">Semestre</label>
              <select v-model="semestre">
                <option value="1">1º semestre</option>
                <option value="2">2º semestre</option>
              </select>
              <span>Semestre de referência</span>
            </li>
            <li>
              <input type="reset" value="Cancelar" class="button-s1" v-on:click="$router.push(`/ensalamentos`)">
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
        { name: 'Ensalamentos', link: '#/ensalamentos' }
      ],
      titulo: '',
      ano: '',
      semestre: '',
      id: ''
    }
  },
  created () {
    const id = this.$route.params.id
    if (typeof id !== 'undefined') {
      axios.get(`${window.apiHostname}/api/v1/ensalamentos/${id}`)
        .then(response => {
          this.breadcrumbs.push({
            name: `Editar ensalamento (${response.data.titulo})`,
            link: `#/ensalamentos/${id}/editar`,
            class: 'current'
          })
          const data = response.data
          this.id = data.id
          this.titulo = data.titulo
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
        name: 'Novo ensalamento',
        link: `#/ensalamentos/cadastrar`,
        class: 'current'
      })
    }
  },
  methods: {
    save (e) {
      const data = {
        titulo: this.titulo,
        ano: this.ano,
        semestre: this.semestre
      }

      if (data.titulo && this.id !== '') {
        delete data.ano
        delete data.semestre
        return axios.put(`${window.apiHostname}/api/v1/ensalamentos/${this.id}`, data)
          .then(response => {
            this.$refs.simplert.openSimplert({
              title: 'Dados salvos',
              message: 'Dados alterados com sucesso',
              type: 'info'
            })
            this.$router.push('/ensalamentos')
          })
          .catch(e => {
            this.$refs.simplert.openSimplert({
              title: 'Erro',
              message: 'Ocorreu um erro ao tentar salvar os dados',
              type: 'alert'
            })
          })
      }

      if (this.id === '' && data.titulo && data.ano && data.semestre) {
        return axios.post(`${window.apiHostname}/api/v1/ensalamentos`, data)
          .then(response => {
            this.$refs.simplert.openSimplert({
              title: 'Dados salvos',
              message: 'Sala cadastrada com sucesso',
              type: 'info'
            })
            this.$router.push('/ensalamentos')
          })
          .catch(e => {
            this.$refs.simplert.openSimplert({
              title: 'Erro',
              message: 'Ocorreu um erro ao tentar salvar os dados',
              type: 'alert'
            })
          })
      }

      this.$refs.simplert.openSimplert({
        title: 'Dados incompletos',
        message: 'É necessário preencher os campos',
        type: 'alert'
      })
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
