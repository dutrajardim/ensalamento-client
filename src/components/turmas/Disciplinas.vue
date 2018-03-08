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
            <button v-on:click="$router.push(`/turmas/${turma.id}/horarios?semestre=${panelSemestre}&ano=${panelAno}`)">
              <icon name="calendar"></icon>
            </button>
          </div>
          <SemesterHeader :panelAno="panelAno" :panelSemestre="panelSemestre" @data-updated="semesterHeaderHendler"></SemesterHeader>
        </div>
      </div>
      <div class="container__row">
        <div class="container__col-6">
          <div class="box-s1">
            <main>
              <table class="table-s1" v-if="semestreTurmaDisciplinas.length">
                <thead>
                  <tr>
                    <th>Disciplina</th>
                    <th>Quantidade de alunos</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="disciplina in semestreTurmaDisciplinas" v-bind:key="disciplina.id">
                    <td>{{disciplina.nome}}</td>
                    <td>{{disciplina.alunos_qtd}}</td>
                    <td>
                      <div class="btn-group">
                        <button v-on:click="remove(disciplina)" v-tooltip.bottom="{ content: 'Remover', class: 'red'}">
                          <icon name="trash"></icon>
                        </button>
                        <button v-on:click="edit(disciplina)" v-tooltip.bottom="{ content: 'Editar', class: 'red'}">
                          <icon name="edit"></icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="container__col-6">
                <span class="alert__attention">Nenhuma matéria cadastrada para este semestre</span>
              </div>
            </main>
          </div>
        </div>
        <div v-if="filteredDisciplinas.length > 1" class="container__col-6">
          <div v-if="id !== ''">Atualização de registro</div>
          <form action="POST" v-on:submit.prevent="save($event)" class="form-s1">
            <input type="text" hidden v-model="id">
            <ul>
              <li>
                <label for="disciplinas_id">Disciplina</label>
                <select v-model="disciplinas_id" v-bind:disabled="id !== ''">
                  <option v-for="disciplina in filteredDisciplinas" v-bind:value="disciplina.id" v-bind:key="disciplina.id">
                    {{disciplina.nome}}
                  </option>
                </select>
                <span>Disciplina para adicionar</span>
              </li>
              <li>
                <label for="alunos_qtd">Alunos</label>
                <input type="number" v-model="alunos_qtd">
                <span>Quantidade de alunos</span>
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
          <span class="alert__attention">Todas as matérias disponíveis para cadastro já foram atribuidas à esta turma</span>
        </div>
      </div>
      <simplert isUseRadius=true isUseIcon=true ref="simplert"></simplert>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/includes/Breadcrumb'
import SemesterHeader from '@/components/includes/SemesterHeader'
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
    Breadcrumb,
    SemesterHeader
  },
  data () {
    return {
      breadcrumbs: [
        { name: 'Turmas', link: '#/turmas' }
      ],
      disciplinas: [],
      turmaDisciplinas: [],
      checkedDisciplinas: [],
      checkedSelDisciplinas: [],
      turma: {},
      panelAno: 2018,
      panelSemestre: 1,
      id: '',
      disciplinas_id: '',
      alunos_qtd: ''
    }
  },
  created () {
    const id = this.$route.params.id
    this.getTurmaDisciplinas({ id })
    this.getDisciplinas()
    this.getTurmaInfo({ id })
  },
  methods: {
    // cbDisciplinaId (id) {
    //   return `disci-${id}`
    // },
    semesterHeaderHendler (data) {
      this.panelAno = data.ano
      this.panelSemestre = data.semestre
      this.resetForm()
    },
    getDisciplinas () {
      axios.get(`${window.apiHostname}/api/v1/disciplinas`)
        .then(response => {
          this.disciplinas = response.data
          this.disciplinas.unshift({
            nome: '',
            id: ''
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getTurmaDisciplinas ({ id }) {
      axios.get(`${window.apiHostname}/api/v1/turmas/${id}/disciplinas`)
        .then(response => {
          // console.log(response.data)
          this.turmaDisciplinas = response.data
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Não foi possível recurar registros das disciplinas cadastradas',
            type: 'alert'
          })
        })
    },
    getTurmaInfo ({ id }) {
      axios.get(`${window.apiHostname}/api/v1/turmas/${id}`)
        .then(response => {
          this.turma = response.data
          this.breadcrumbs.push({
            name: `Visualizar disciplinas (${response.data.abreviacao})`,
            link: `#/turmas/${id}/disciplinas`,
            class: 'current'
          })
        })
        .catch(() => {
          this.simplert.openSimplert({
            title: 'Erro',
            message: 'Não foi possível recuperar informação da turma',
            type: 'alert'
          })
        })
    },
    edit (disciplina) {
      this.id = disciplina.relationship_id
      this.disciplinas_id = disciplina.id
      this.alunos_qtd = disciplina.alunos_qtd
    },
    remove (disciplina) {
      axios.delete(`${window.apiHostname}/api/v1/turmas/${this.turma.id}/disciplinas/${disciplina.id}`)
        .then(response => {
          let turmaId = this.turma.id
          this.getTurmaDisciplinas({ id: turmaId })

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
    save () {
      let data = {
        alunos_qtd: this.alunos_qtd,
        semestre: this.panelSemestre,
        ano: this.panelAno
      }
      const turmaId = this.turma.id

      if (!(this.alunos_qtd && this.disciplinas_id)) {
        return this.$refs.simplert.openSimplert({
          title: 'Dados incompletos',
          message: 'É necessário preencher os campos',
          type: 'alert'
        })
      }

      if (this.id !== '') {
        return axios.put(`${window.apiHostname}/api/v1/turmas/${this.turma.id}/disciplinas/${this.disciplinas_id}`, data)
          .then(response => {
            this.$refs.simplert.openSimplert({
              title: 'Dados salvos',
              message: 'Dados alterados com sucesso',
              type: 'info'
            })
            this.resetForm()
            this.getTurmaDisciplinas({ id: turmaId })
          })
          .catch(e => {
            this.$refs.simplert.openSimplert({
              title: 'Erro',
              message: `Ocorreu um erro ao tentar atualizar os dados:\n${e.response.data.message}`,
              type: 'alert'
            })
          })
      }

      data.disciplinas_id = this.disciplinas_id
      axios.post(`${window.apiHostname}/api/v1/turmas/${this.turma.id}/disciplinas`, data)
        .then(response => {
          this.$refs.simplert.openSimplert({
            title: 'Dados salvos',
            message: 'Disciplina cadastrada com sucesso',
            type: 'info'
          })

          this.resetForm()
          this.getTurmaDisciplinas({ id: turmaId })
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
      this.disciplinas_id = ''
      this.alunos_qtd = ''
    }
  },
  computed: {
    filteredDisciplinas: function () {
      return this.disciplinas.filter((disciplina) => {
        return (this.turmaDisciplinas.findIndex((turmaDisciplina) => {
          return turmaDisciplina.id === disciplina.id
        }) === -1)
      })
    },
    semestreTurmaDisciplinas: function () {
      return this.turmaDisciplinas.filter((el) => {
        return (parseInt(el.ano) === this.panelAno &&
          parseInt(el.semestre) === this.panelSemestre)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .form-s1 {
    margin-top: 5px;
    margin-bottom: 5px;
  }
</style>
