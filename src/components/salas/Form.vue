<template>
  <div class="card">
    <form action="POST" v-on:submit.prevent="save($event)" class="form-s1">
      <input type="text" hidden v-model="id">
      <ul>
        <li>
          <label for="nome">Nome</label>
          <input type="text" v-model="nome">
          <span>Entre com um nome para a sala</span>
        </li>
        <li>
          <label for="capacidade">Capacidade</label>
          <input type="number" v-model="capacidade">
          <span>Informe a capacidade da sala</span>
        </li>
        <li>
          <label for="arCondicionado">Ar condicionado</label>
          <input type="checkbox" v-model="arCondicionado">
          <span>Marque se possui ar condicionado</span>
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
      nome: '',
      capacidade: '',
      id: '',
      arCondicionado: false
    }
  },
  created () {
    const id = this.$route.params.id
    if (typeof id !== 'undefined') {
      axios.get(`${window.apiHostname}/api/v1/salas/${id}`)
        .then(response => {
          const data = response.data
          this.id = data.id
          this.capacidade = data.capacidade
          this.arCondicionado = data.arCondicionado
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
        nome: this.nome,
        capacidade: this.capacidade,
        arCondicionado: this.arCondicionado
      }

      if (data.nome && data.capacidade) {
        if (this.id !== '') {
          axios.put(`${window.apiHostname}/api/v1/salas/${this.id}`, data)
            .then(response => {
              this.$refs.simplert.openSimplert({
                title: 'Dados salvos',
                message: 'Dados alterados com sucesso',
                type: 'info'
              })
              this.$router.push('/salas')
            })
            .catch(e => {
              this.$refs.simplert.openSimplert({
                title: 'Erro',
                message: 'Ocorreu um erro ao tentar salvar os dados',
                type: 'alert'
              })
            })
        } else {
          axios.post(`${window.apiHostname}/api/v1/salas`, data)
            .then(response => {
              this.$refs.simplert.openSimplert({
                title: 'Dados salvos',
                message: 'Sala cadastrada com sucesso',
                type: 'info'
              })
              this.$router.push('/salas')
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
