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
              <table class="table-s1" v-if="professorDisciplinas.length">
                <thead>
                  <tr>
                    <th>Disciplinas selecionadas</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="disciplina in professorDisciplinas" v-bind:key="disciplina.id">
                    <td>{{disciplina.nome}}</td>
                    <td>
                      <div class="btn-group">
                        <button v-on:click="remove(disciplina)" v-tooltip.bottom="{ content: 'Remover', class: 'red'}">
                          <icon name="trash"></icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="container__col-6">
                <span class="alert__attention">Nenhuma disciplina cadastrada</span>
              </div>
            </main>
          </div>
        </div>

        <div class="container__col-6">
          <div class="box-s1">
            <main>
              <table class="table-s1" v-if="filteredDisciplinas.length">
                <thead>
                  <tr>
                    <th>Disciplinas disponíveis</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="disciplina in filteredDisciplinas" v-bind:key="disciplina.id">
                    <td>{{disciplina.nome}}</td>
                    <td>
                      <div class="btn-group">
                        <button v-on:click="save(disciplina)" v-tooltip.bottom="{ content: 'Adicionar', class: 'red'}">
                          <icon name="plus"></icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="container__col-6">
                <span class="alert__attention">Nenhuma disciplina disponível</span>
              </div>
            </main>
          </div>
        </div>
        <!-- <div v-if="filteredFormacoes.length > 1 || id !== ''" class="container__col-6">
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
        </div> -->
        <!-- <div v-else class="container__col-6">
          <span class="alert__attention">Todas as formações disponíveis para cadastro já foram atribuidas à este professor</span>
        </div> -->
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
import 'vue-awesome/icons/plus'
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
      // grausDeFormacao: ['', 'Técnico', 'Graduação', 'Pos-graduação', 'Mestrado', 'Doutorado'],
      disciplinas: [],
      professorDisciplinas: [],
      checkedDisciplinas: [],
      checkedSelDisciplinas: [],
      professor: {},
      id: '',
      disciplinas_id: ''
    }
  },
  created () {
    const id = this.$route.params.id
    this.getProfessorDisciplinas({ id })
    this.getDisciplinas()
    this.getProfessorInfo({ id })
  },
  methods: {
    getDisciplinas () {
      axios.get(`${window.apiHostname}/api/v1/disciplinas`)
        .then(response => {
          this.disciplinas = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getProfessorDisciplinas ({ id }) {
      axios.get(`${window.apiHostname}/api/v1/professores/${id}/disciplinas`)
        .then(response => {
          // console.log(response.data)
          this.professorDisciplinas = response.data
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Não foi possível recurar registros das disciplinas cadastradas',
            type: 'alert'
          })
        })
    },
    getProfessorInfo ({ id }) {
      axios.get(`${window.apiHostname}/api/v1/professores/${id}`)
        .then(response => {
          this.professor = response.data
          this.breadcrumbs.push({
            name: `Visualizar disciplinas (${response.data.nome})`,
            link: `#/professores/${id}/disciplinas`,
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
    // edit (formacao) {
    //   this.id = formacao.relationship_id
    //   this.formacoes_id = formacao.id
    //   this.ano = formacao.ano
    //   this.grau = formacao.grau
    // },
    remove (disciplina) {
      axios.delete(`${window.apiHostname}/api/v1/professores/${this.professor.id}/disciplinas/${disciplina.id}`)
        .then(response => {
          let professorId = this.professor.id
          this.getProfessorDisciplinas({ id: professorId })

          this.$refs.simplert.openSimplert({
            title: 'Ok',
            message: 'Cadastro de disciplina removido com sucesso',
            type: 'info'
          })
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Erro ao tentar excluir cadastro de disciplina',
            type: 'alert'
          })
        })
    },
    save (disciplina) {
      const professorId = this.professor.id
      return axios.post(`${window.apiHostname}/api/v1/professores/${this.professor.id}/disciplinas/${disciplina.id}`)
        .then(response => {
          this.$refs.simplert.openSimplert({
            title: 'Dados salvos',
            message: 'Dados alterados com sucesso',
            type: 'info'
          })
          this.getProfessorDisciplinas({ id: professorId })
        })
        .catch(e => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: `Ocorreu um erro ao tentar atualizar os dados:\n${e.response.data.message}`,
            type: 'alert'
          })
        })
    }
  },
  computed: {
    filteredDisciplinas: function () {
      return this.disciplinas.filter((disciplina) => {
        return (this.professorDisciplinas.findIndex((professorDisciplina) => {
          return professorDisciplina.id === disciplina.id
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
