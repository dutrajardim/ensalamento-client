<template>
  <div class="card">
    <form action="POST" v-on:submit.prevent="save($event)" class="form-s1">
      <input type="text" hidden v-model="id">
      <ul>
        <li>
          <label for="abreviacao">Abreviação</label>
          <input type="text" v-model="abreviacao">
          <span>Ex. de abreviação é ADS1AN-BRA</span>
        </li>
        <li>
          <label for="descricao">Descrição</label>
          <textarea v-model="descricao" col="3"></textarea>
          <span>Descrição da turma</span>
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
      abreviacao: '',
      descricao: '',
      id: ''
    }
  },
  created () {
    const id = this.$route.params.id
    if (typeof id !== 'undefined') {
      axios.get(`${window.apiHostname}/api/v1/turmas/${id}`)
        .then(response => {
          const data = response.data
          this.id = data.id
          this.abreviacao = data.abreviacao
          this.descricao = data.descricao
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
        abreviacao: this.abreviacao,
        descricao: this.descricao
      }

      if (data.abreviacao && data.descricao) {
        if (this.id !== '') {
          axios.put(`${window.apiHostname}/api/v1/turmas/${this.id}`, data)
            .then(response => {
              this.$refs.simplert.openSimplert({
                title: 'Dados salvos',
                message: 'Dados alterados com sucesso',
                type: 'info'
              })
              this.$router.push('/turmas')
            })
            .catch(e => {
              this.$refs.simplert.openSimplert({
                title: 'Erro',
                message: 'Ocorreu um erro ao tentar salvar os dados',
                type: 'alert'
              })
            })
        } else {
          axios.post(`${window.apiHostname}/api/v1/turmas`, data)
            .then(response => {
              this.$refs.simplert.openSimplert({
                title: 'Dados salvos',
                message: 'Turma cadastrada com sucesso',
                type: 'info'
              })
              this.$router.push('/turmas')
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

<style lang="sass" scoped>

</style>
