<template>
  <div class="card">
    <form action="POST" v-on:submit.prevent="save($event)" class="form-s1">
      <input type="text" hidden v-model="id">
      <ul>
        <li>
          <label for="ano">Ano</label>
          <input type="number" v-model="ano">
          <span>Ano de referência</span>
        </li>
        <li>
          <label for="semestre">Semestre</label>
          <select v-model="semestre">
            <option value="1">1º semestre</option>
            <option value="2">2º semestre</option>
          </select>
          <span>Semestre de referência</span>
        </li>
        <li>
          <label for="descricao">Descrição</label>
          <textarea v-model="descricao" col="3"></textarea>
          <span>Descrição do horario</span>
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
      ano: (new Date().getFullYear()),
      semestre: '1',
      descricao: '',
      id: ''
    }
  },
  created () {
    const id = this.$route.params.id
    if (typeof id !== 'undefined') {
      
      axios.get(`${window.apiHostname}/api/v1/horarios/${id}`)
        .then(response => {
          const data = response.data
          this.id = data.id
          this.ano = data.ano
          this.semestre = data.semestre
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
        ano: this.ano,
        semestre: this.semestre,
        descricao: this.descricao
      }

      if (data.ano && data.descricao && data.semestre) {
        if (this.id !== '') {
          axios.put(`${window.apiHostname}/api/v1/horarios/${this.id}`, data)
            .then(response => {
              this.$refs.simplert.openSimplert({
                title: 'Dados salvos',
                message: 'Dados alterados com sucesso',
                type: 'info'
              })
              this.$router.push('/horarios')
            })
            .catch(e => {
              this.$refs.simplert.openSimplert({
                title: 'Erro',
                message: 'Ocorreu um erro ao tentar salvar os dados',
                type: 'alert'
              })
            })
        } else {
          axios.post(`${window.apiHostname}/api/v1/horarios`, data)
            .then(response => {
              this.$refs.simplert.openSimplert({
                title: 'Dados salvos',
                message: 'Horario cadastrada com sucesso',
                type: 'info'
              })
              this.$router.push('/horarios')
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

<style lang="scss">

</style>
