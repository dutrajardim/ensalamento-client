<template>
  <div class="card">
    <div>
      <div class="box-s1">
        <head>Disciplinas</head>
        <main>
          <div class="btn-group">
            <button v-bind:disabled="not(checkedDisciplinas.length)" v-on:click="clearCheckedDisciplinas">
              <icon name="eraser"></icon>
            </button>
            <button v-bind:disabled="not(checkedDisciplinas.length)" v-on:click="selectDisciplinas">
              <icon name="angle-double-right"></icon>
            </button>
          </div>
          <ul v-for="disciplina in filteredDisciplinas" v-bind:key="disciplina.id">
            <li>
              <input type="checkbox" v-bind:id="cbDisciplinaId(disciplina.id)" v-bind:value="disciplina.id" v-model="checkedDisciplinas">
              <label v-bind:for="cbDisciplinaId(disciplina.id)">{{disciplina.nome}}</label>
            </li>
          </ul>
        </main>
        <footer>Disciplinas disponíveis</footer>
      </div>
      <div class="box-s1">
        <head>Selecionadas</head>
        <main>
          <div class="btn-group">
            <button v-bind:disabled="not(checkedSelDisciplinas.length)" v-on:click="removeTurmaDisciplinas">
              <icon name="remove"></icon>
            </button>
          </div>
          <ul v-for="disciplina in turmaDisciplinas" v-bind:key="disciplina.id">
            <li>
              <input type="checkbox" v-bind:id="cbDisciplinaId(disciplina.id)" v-bind:value="disciplina.id" v-model="checkedSelDisciplinas">
              <label v-bind:for="cbDisciplinaId(disciplina.id)">{{disciplina.nome}}</label>
              <input type="number" v-model="disciplina.pivot.alunos_qtd">
            </li>
          </ul>
        </main>
        <footer>Grade curricular e quantidade de alunos</footer>
      </div>
    </div>
    <button class="button-s1 inverse" v-on:click="resetState">Resetar</button>
    <button class="button-s1 inverse" v-on:click="saveState">Salvar</button>
    <button class="button-s1 inverse" v-on:click="saveState({definirHorarios: true})">Salvar e definir horários</button>
    <simplert isUseRadius=true isUseIcon=true ref="simplert"></simplert>
  </div>
</template>

<script>
import axios from 'axios'
import Simplert from 'vue2-simplert'
import 'vue-awesome/icons/angle-double-right'
import 'vue-awesome/icons/eraser'
import 'vue-awesome/icons/remove'

export default {
  data () {
    return {
      disciplinas: [],
      turmaDisciplinas: [],
      checkedDisciplinas: [],
      checkedSelDisciplinas: []
    }
  },
  created () {
    const id = this.$route.params.id
    this.getTurmaDisciplinas({ id })
    this.getDisciplinas()
  },
  methods: {
    saveState ({ definirHorarios }) {
      const id = this.$route.params.id
      const data = this.turmaDisciplinas.map((el) => {
        return {
          'disciplina_id': el.id,
          'alunos_qtd': el.pivot.alunos_qtd
        }
      })
      axios.post(`${window.apiHostname}/api/v1/turmas/${id}/disciplinas`, data)
        .then(response => {
          this.$refs.simplert.openSimplert({
            title: 'Sucesso',
            message: 'Informações salvas',
            type: 'info'
          })
          if (typeof definirHorarios === 'undefined' && !definirHorarios) this.$router.push('/turmas')
          else this.$router.push(`/turmas/${id}/horarios`)
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Não foi possível salvar as informações requeridas',
            type: 'alert'
          })
        })
    },
    resetState () {
      const id = this.$route.params.id
      this.getTurmaDisciplinas({ id })
      this.getDisciplinas()
      this.checkedDisciplinas = []
      this.checkedSelDisciplinas = []
    },
    cbDisciplinaId (id) {
      return `disci-${id}`
    },
    getDisciplinas () {
      axios.get(`${window.apiHostname}/api/v1/disciplinas`)
        .then(response => {
          this.disciplinas = response.data
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
    not: function (arg) {
      return !arg
    },
    removeTurmaDisciplinas () {
      // filtra disciplinas de curriculo que não estao com check
      this.turmaDisciplinas = this.turmaDisciplinas.filter((el) => {
        const index = this.checkedSelDisciplinas.indexOf(el.id)
        if (index > -1) this.checkedSelDisciplinas.splice(index, 1)
        // se estiver na checked list retorna true
        return (index === -1)
      })
    },
    selectDisciplinas () {
      this.disciplinas.forEach((el) => {
        if (this.checkedDisciplinas.indexOf(el.id) > -1) {
          el.pivot = {
            alunos_qtd: 30
          }
          this.turmaDisciplinas.push(el)
        }
      })
      this.clearCheckedDisciplinas()
    },
    clearCheckedDisciplinas () {
      this.checkedDisciplinas = []
    }
  },
  computed: {
    filteredDisciplinas: function () {
      // filtra disciplinas que não estao no curriculo
      return this.disciplinas.filter((el) => {
        // se estiver na grade retorna false
        return (this.turmaDisciplinas.findIndex((eltest) => {
          return eltest.id === el.id
        }) === -1)
      })
    }
  },
  components: {
    Simplert
  }
}
</script>

<style lang="scss" scoped>
  .card {
    div:first-child {
      display: flex;
      justify-content: space-around;
      text-align: left;
    }
    > button {
      margin-top: 20px;
    }
    text-align: center;
  }
  .box-s1 {
    width: 50%;
    main {
      margin-bottom: 10px;
      flex-grow: 1;
      .btn-group {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
        margin-top: 10px;
      }
      li {
        padding: 3px 8px 10px 8px;
        display: flex;
        justify-content: center;
        align-items: center;

        label {
          flex-grow: 1;
        }
        input[type=checkbox] {
          margin-right: 10px;
        }
        input[type=number] {
          width: 60px;
          color: #777;
          text-align: right;
          padding: 5px;
          border: 0;
          background-color: #ddd;
          border-radius: 2px;
        }
      }
    }
  }
</style>
