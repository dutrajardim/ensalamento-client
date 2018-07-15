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
      <div class="container__row">
        <div class="container__col-6">
          <div class="box-s1">
            <main>
              <table class="table-s1" v-if="professorFormacoes.length">
                <thead>
                  <tr>
                    <th>Formação</th>
                    <th>Grau</th>
                    <th>Ano de conclusão</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="formacao in professorFormacoes" v-bind:key="formacao.id">
                    <td>{{formacao.nome}}</td>
                    <td>{{formacao.grau}}</td>
                    <td>{{formacao.ano}}</td>
                    <td>
                      <div class="btn-group">
                        <button v-on:click="remove(formacao)" v-tooltip.bottom="{ content: 'Remover', class: 'red'}">
                          <icon name="trash"></icon>
                        </button>
                        <button v-on:click="edit(formacao)" v-tooltip.bottom="{ content: 'Editar', class: 'red'}">
                          <icon name="edit"></icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="container__col-6">
                <span class="alert__attention">Nenhuma formação cadastrada</span>
              </div>
            </main>
          </div>
        </div>
        <div v-if="filteredFormacoes.length > 1 || id !== ''" class="container__col-6">
          <!-- <div v-if="id !== ''">Atualização de registro</div> -->
          <form action="POST" v-on:submit.prevent="save($event)" class="form-s1">
            <input type="text" hidden v-model="id">
            <ul>
              <li v-if="id === ''">
                <label for="formacoes_id">Formação</label>
                <select v-model="formacoes_id" v-bind:disabled="id !== ''">
                  <option v-for="formacao in filteredFormacoes" v-bind:value="formacao.id" v-bind:key="formacao.id">
                    {{formacao.nome}}
                  </option>
                </select>
                <span>Formação para adicionar</span>
              </li>
              <li>
                <label for="grau">Grau</label>
                <select v-model="grau">
                  <option v-for="grauF in grausDeFormacao" v-bind:value="grauF" v-bind:key="grauF">
                    {{grauF}}
                  </option>
                </select>
                <span>Grau da formação</span>
              </li>
              <li>
                <label for="ano">Ano de conclusão</label>
                <input type="number" v-model="ano">
                <span>Ano de conclusão</span>
              </li>
              <li>
                <input v-if="id === ''" type="reset" value="Limpar" class="button-s1" v-on:click="resetForm()">
                <input v-else type="reset" value="Cancelar" class="button-s1" v-on:click="resetForm()">
                <input type="submit" value="Salvar" class="button-s1">
              </li>
            </ul>
          </form>
        </div>
        <div v-else class="container__col-6">
          <span class="alert__attention">Todas as formações disponíveis para cadastro já foram atribuidas à este professor</span>
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
import 'vue-awesome/icons/angle-double-right'
import 'vue-awesome/icons/eraser'
import 'vue-awesome/icons/remove'
import 'vue-awesome/icons/angle-right'
import 'vue-awesome/icons/angle-left'

export default {
  components: {
    Simplert,
    Breadcrumb
  },
  data () {
    return {
      breadcrumbs: [
        { name: 'Professores', link: '#/professor' }
      ],
      grausDeFormacao: ['', 'Técnico', 'Graduação', 'Pos-graduação', 'Mestrado', 'Doutorado'],
      formacoes: [],
      professorFormacoes: [],
      checkedFormacoes: [],
      checkedSelFormacoes: [],
      professor: {},
      id: '',
      formacoes_id: '',
      grau: '',
      ano: ''
    }
  },
  created () {
    const id = this.$route.params.id
    this.getProfessorFormacoes({ id })
    this.getFormacoes()
    this.getProfessorInfo({ id })
  },
  methods: {
    getFormacoes () {
      axios.get(`${window.apiHostname}/api/v1/formacoes`)
        .then(response => {
          this.formacoes = response.data
          this.formacoes.unshift({
            nome: '',
            id: ''
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getProfessorFormacoes ({ id }) {
      axios.get(`${window.apiHostname}/api/v1/professores/${id}/formacoes`)
        .then(response => {
          // console.log(response.data)
          this.professorFormacoes = response.data
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Não foi possível recurar registros das formações cadastradas',
            type: 'alert'
          })
        })
    },
    getProfessorInfo ({ id }) {
      axios.get(`${window.apiHostname}/api/v1/professores/${id}`)
        .then(response => {
          this.professor = response.data
          this.breadcrumbs.push({
            name: `Visualizar professores (${response.data.nome})`,
            link: `#/professores/${id}/formacoes`,
            class: 'current'
          })
        })
        .catch(() => {
          this.simplert.openSimplert({
            title: 'Erro',
            message: 'Não foi possível recuperar informação do professor',
            type: 'alert'
          })
        })
    },
    edit (formacao) {
      this.id = formacao.relationship_id
      this.formacoes_id = formacao.id
      this.ano = formacao.ano
      this.grau = formacao.grau
    },
    remove (formacao) {
      axios.delete(`${window.apiHostname}/api/v1/professores/${this.professor.id}/formacoes/${formacao.id}`)
        .then(response => {
          let professorId = this.professor.id
          this.getProfessorFormacoes({ id: professorId })

          this.$refs.simplert.openSimplert({
            title: 'Ok',
            message: 'Cadastro de formação removido com sucesso',
            type: 'info'
          })
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Erro ao tentar excluir cadastro de formação',
            type: 'alert'
          })
        })
    },
    save () {
      let data = {
        grau: this.grau,
        ano: this.ano
      }
      const professorId = this.professor.id

      if (!(this.grau && this.formacoes_id && this.ano)) {
        return this.$refs.simplert.openSimplert({
          title: 'Dados incompletos',
          message: 'É necessário preencher os campos',
          type: 'alert'
        })
      }

      if (this.id !== '') {
        return axios.put(`${window.apiHostname}/api/v1/professores/${this.professor.id}/formacoes/${this.formacoes_id}`, data)
          .then(response => {
            this.$refs.simplert.openSimplert({
              title: 'Dados salvos',
              message: 'Dados alterados com sucesso',
              type: 'info'
            })
            this.resetForm()
            this.getProfessorFormacoes({ id: professorId })
          })
          .catch(e => {
            this.$refs.simplert.openSimplert({
              title: 'Erro',
              message: `Ocorreu um erro ao tentar atualizar os dados:\n${e.response.data.message}`,
              type: 'alert'
            })
          })
      }

      data.formacoes_id = this.formacoes_id
      console.log(data)
      axios.post(`${window.apiHostname}/api/v1/professores/${this.professor.id}/formacoes`, data)
        .then(response => {
          this.$refs.simplert.openSimplert({
            title: 'Dados salvos',
            message: 'Formação cadastrada com sucesso',
            type: 'info'
          })

          this.resetForm()
          this.getProfessorFormacoes({ id: professorId })
        })
        .catch(e => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: `Ocorreu um erro ao tentar salvar os dados:\n${e.response.data.message}`,
            type: 'alert'
          })
        })
    },
    resetForm () {
      this.id = ''
      this.grau = ''
      this.ano = ''
    }
  },
  computed: {
    filteredFormacoes: function () {
      return this.formacoes.filter((formacao) => {
        return (this.professorFormacoes.findIndex((professorFormacao) => {
          return professorFormacao.id === formacao.id
        }) === -1)
      })
    }
    // semestreTurmaDisciplinas: function () {
    //   return this.turmaDisciplinas.filter((el) => {
    //     return (parseInt(el.ano) === this.panelAno &&
    //       parseInt(el.semestre) === this.panelSemestre)
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
  .form-s1 {
    margin-top: 5px;
    margin-bottom: 5px;
  }
</style>
