<template>
  <div class="card">
    <form action="POST" v-on:submit.prevent="save($event)" class="form-s1">
      <input type="text" hidden v-model="id">
      <ul>
        <li>
          <label for="nome">Nome</label>
          <input type="text" v-model="nome">
          <span>Entre com o nome da disciplina</span>
        </li>
        <li>
          <input type="submit" value="Salvar" class="button-s1 inverse">
        </li>
      </ul>
    </form>
    <simplert isUseRadius=true isUseIcon=true ref="simplert"></simplert>
  </div>
</template>


<script>
import Simplert from 'vue2-simplert'
import axios from 'axios'

export default {
  data () {
    return {
      id: '',
      nome: ''
    }
  },
  created () {
    const id = this.$route.params.id
    if (typeof id !== 'undefined') {
      axios.get(`${window.apiHostname}/api/v1/disciplinas/${id}`)
        .then(response => {
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
    }
  },
  methods: {
    save (e) {
      const data = {
        nome: this.nome
      }

      if (data.nome) {
        if (this.id !== '') {
          axios.put(`${window.apiHostname}/api/v1/disciplinas/${this.id}`, data)
            .then(response => {
              this.$refs.simplert.openSimplert({
                title: 'Dados salvos',
                message: 'Dados alterados com sucesso',
                type: 'info'
              })
              this.$router.push('/disciplinas')
            })
            .catch(e => {
              this.$refs.simplert.openSimplert({
                title: 'Erro',
                message: 'Ocorreu um erro ao tentar salvar os dados',
                type: 'alert'
              })
            })
        } else {
          axios.post(`${window.apiHostname}/api/v1/disciplinas`, data)
            .then(response => {
              this.$refs.simplert.openSimplert({
                title: 'Dados salvos',
                message: 'Disciplina cadastrada com sucesso',
                type: 'info'
              })
              this.$router.push('/disciplinas')
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
  },
  components: {
    Simplert
  }
}
</script>

<style lang="scss" scoped>

</style>
