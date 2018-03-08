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
            <button
              v-on:click="$router.push(`/turmas/${turma.id}/disciplinas?semestre=${panelSemestre}&ano=${panelAno}`)"
              v-tooltip.bottom="{ content: 'Disciplinas'}" >
              <icon name="graduation-cap"></icon>
            </button>
          </div>
          <SemesterHeader :panelAno="panelAno" :panelSemestre="panelSemestre" @data-updated="semesterHeaderHendler"></SemesterHeader>
        </div>
      </div>

      <div class="container__row">
        <div class="container__col-md-12 auto-scrolled">
          <table class="schedule">
            <thead>
              <tr>
                <th></th>
                <template v-for="(dia,dKey) in semana">
                  <transition name="slide-fade" v-bind:key="dKey">
                    <th
                      v-if="not(showDay(dia))">
                      {{ dia }}
                      <div class="actions">
                        <button class="button-s1" v-on:click="hideDay(dia)">
                          <icon name="eye-slash"></icon>
                        </button>
                      </div>
                    </th>
                  </transition>
                </template>
              </tr>
            </thead>
            <tbody>
                <tr v-for="(horario, hKey) in horarios" v-bind:key="hKey">
                    <td class="left-head"><span>{{horario}}</span></td>
                    <template v-for="(dia, dKey) in semana">
                    <transition name="slide-fade" v-bind:key="(hKey*7)+dKey">
                        <td
                        v-on:dragenter="handleDragEnter($event)"
                        v-on:dragleave="handleDragLeave($event)"
                        v-on:dragover.prevent="handleDragOver($event)"
                        v-on:drop.prevent="handleDrop({dKey, hKey},$event)"
                        v-if="not(showDay(dia))">
                            <div class="actions" v-if="appointment(dKey, hKey)">
                            <button class="button-s1" v-on:click="removeEnsalamento(dKey, hKey)">
                                <icon name="remove"></icon>
                            </button>
                            </div>
                            <transition name="slide-fade" mode="out-in">
                            <Appointment
                                v-if="appointment(dKey, hKey)"
                                v-bind:appointment="appointment(dKey, hKey)"></Appointment>
                            <div class="clear-appointment" v-else></div>
                            </transition>
                        </td>
                    </transition>
                    </template>
                </tr>
            </tbody>
            <tfoot>
            </tfoot>
          </table>
        </div>
      </div>

      <div class="container__row">
        <div class="container__col-12">
          <div class="box-s1">
            <head>Disciplinas de turmas para agendamento</head>
            <main>
              <Appointment
                v-for="(dt, key) in filteredDisciplinas"
                v-bind:key="key"
                v-bind:appointment="dt"></Appointment>
            </main>
            <footer>Carregue os componentes para a tabela para agendamento</footer>
          </div>
        </div>
      </div>

      <div class="container__row">
        <div class="container__col-12">
          <template v-if="daysHidden.length">
            <div class="box-s1">
              <head>Dias da semana ocultado</head>
              <main>
                <button
                  class="button-s1"
                  v-for="(day, key) in daysHidden"
                  v-bind:key="key"
                  v-on:click="unHideDay(day)">
                  <icon name="eye"></icon> {{day}}
                </button>
              </main>
              <footer>Click no botão para mostra-lo na tabela</footer>
            </div>
          </template>
        </div>
      </div>
      <simplert isUseRadius=true isUseIcon=true ref="simplert"></simplert>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/includes/Breadcrumb'
import SemesterHeader from '@/components/includes/SemesterHeader'
import Appointment from '@/components/includes/Appointment'
import axios from 'axios'
import Simplert from 'vue2-simplert'
import 'vue-awesome/icons/eye-slash'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/remove'
import 'vue-awesome/icons/arrow-left'

export default {
  components: {
    Appointment,
    Simplert,
    Breadcrumb,
    SemesterHeader
  },
  data () {
    return {
      breadcrumbs: [
        { name: 'Turmas', link: '#/turmas' }
      ],
      turma: {},
      count: '',
      semana: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
      horarios: [1, 2],
      disciplinas: [],
      ensalamentos: [],
      daysHidden: ['Domingo'],
      panelAno: 2018,
      panelSemestre: 1
    }
  },
  created () {
    const id = this.$route.params.id
    this.getTurmaInfo({ id })
    // this.resetState()
  },
  methods: {
    save (horario) {
      axios.post(`${window.apiHostname}/api/v1/horarios`, horario)
        .then(response => {
          this.getHorarios({ id: this.turma.id })
        })
        .catch(e => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: `Ocorreu um erro ao tentar salvar os dados:\n${e.response.data.message}`,
            type: 'alert'
          })
        })
    },
    remove (horario) {
      axios.delete(`${window.apiHostname}/api/v1/horarios/${horario.id}`)
        .then(response => {
          this.getHorarios({ id: this.turma.id })
        })
        .catch(e => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: `Ocorreu um erro ao tentar remover os dados:\n${e.response.data.message}`,
            type: 'alert'
          })
        })
    },
    removeEnsalamento (dia, horario) {
      for (let key in this.ensalamentos) {
        let el = this.ensalamentos[key]
        if (parseInt(el.dia) === (dia + 1) && el.horario === this.horarios[horario]) {
          this.remove(el)
        }
      }
    },
    resetState () {
      const id = this.$route.params.id
      this.getDisciplinas({ id })
      this.getHorarios({ id })
    },
    semesterHeaderHendler (data) {
      this.panelAno = data.ano
      this.panelSemestre = data.semestre
      this.resetState()
    },
    getTurmaInfo ({ id }) {
      axios.get(`${window.apiHostname}/api/v1/turmas/${id}`)
        .then(response => {
          this.turma = response.data
          this.breadcrumbs.push({
            name: `Visualizar horarios (${response.data.abreviacao})`,
            link: `#/turmas/${id}/horarios`,
            class: 'current'
          })
          this.getDisciplinas({ id })
          this.getHorarios({ id })
        })
        .catch(() => {
          this.simplert.openSimplert({
            title: 'Erro',
            message: 'Não foi possível recuperar informação da turma',
            type: 'alert'
          })
        })
    },
    not (param) {
      return !param
    },
    unHideDay (day) {
      this.daysHidden = this.daysHidden.filter(el => {
        return (el !== day)
      })
    },
    hideDay (day) {
      this.daysHidden.push(day)
    },
    showDay (day) {
      return (this.daysHidden.indexOf(day) > -1)
    },
    getDisciplinas ({ id }) {
      axios.get(`${window.apiHostname}/api/v1/turmas/${id}/disciplinas`)
        .then(response => {
          this.disciplinas = response.data.map((disciplina, key) => {
            let colorIndex = (disciplina.id % window.colors.length)
            return {
              abreviacao: this.turma.abreviacao,
              descricao: this.turma.descricao,
              id: this.turma.id,
              disciplina,
              color: window.colors[colorIndex]
            }
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getHorarios ({ id }) {
      axios.get(`${window.apiHostname}/api/v1/turmas/${id}/horarios`)
        .then(response => {
          this.ensalamentos = response.data
          this.count = this.ensalamentos.length
        })
        .catch(error => {
          console.log(error)
        })
    },
    appointment (dia, horario) {
      for (let key in this.ensalamentos) {
        let el = this.ensalamentos[key]
        if (parseInt(el.dia) === (dia + 1) && el.horario === this.horarios[horario]) {
          let resp
          // console.log(el)
          for (let dt of this.filteredDisciplinas) {
            if (dt.disciplina.id === el.disciplina.id) {
              resp = dt
              break
            }
          }
          return resp
        }
      }
      return null
    },
    handleDragEnter (e) {
      const el = (e.target.tagName === 'TD') ? e.target : e.target.closest('td')
      el.classList.add('dragenter')
    },
    handleDragLeave (e) {
      const el = (e.target.tagName === 'TD') ? e.target : e.target.closest('td')
      el.classList.remove('dragenter')
    },
    handleDragOver (e) {
      e.dataTransfer.dropEffect = 'move'
      return false
    },
    handleDrop (params, e) {
      let data = JSON.parse(e.dataTransfer.getData('text/plain'))

      if (data) {
        const hasEnsalamento = this.ensalamentos.findIndex(el => {
          return (parseInt(el.dia) === (params.dKey + 1) && el.horario === this.horarios[params.hKey])
        })

        if (hasEnsalamento !== -1) {
          return this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Remova o agendamento presente para adicionar outro',
            type: 'alert'
          })
        }

        this.save({
          disciplinas_turmas_id: data.disciplina.relationship_id,
          dia: (params.dKey + 1).toString(),
          horario: this.horarios[params.hKey]
        })
      }
    }
  },
  computed: {
    filteredDisciplinas: function () {
      return this.disciplinas.filter((turDis) => {
        return ((parseInt(turDis.disciplina.semestre) === this.panelSemestre) &&
          (parseInt(turDis.disciplina.ano) === this.panelAno))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btns {
  margin-top: 20px;
  text-align: right;
}
</style>
