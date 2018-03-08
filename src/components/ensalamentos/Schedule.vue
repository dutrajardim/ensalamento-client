<template>
  <div class="container">
    <Breadcrumb :list="breadcrumbs"></Breadcrumb>
    <div class="card">
      <div class="container__row">
        <div class="container__col-12 auto-scrolled">
          <table class="schedule">
            <thead>
              <tr>
                <th></th>
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
              <template v-for="(sala, sKey) in salas">
                <tr v-for="(horario, hKey) in horarios" v-bind:key="(hKey*7)+sKey">
                  <td v-if="hKey === 0" v-bind:rowspan="horarios.length" class="left-head"><span>{{sala.nome}}</span></td>
                  <td class="left-head"><span>{{horario}}</span></td>
                  <template v-for="(dia, dKey) in semana">
                    <transition name="slide-fade" v-bind:key="(hKey*7)+dKey">
                      <td
                        v-on:dragenter="handleDragEnter($event)"
                        v-on:dragleave="handleDragLeave($event)"
                        v-on:dragover.prevent="handleDragOver($event)"
                        v-on:drop.prevent="handleDrop({sKey, dKey, hKey},$event)"
                        v-if="not(showDay(dia))">
                          <div class="actions" v-if="appointment(sKey, dKey, hKey)">
                            <button class="button-s1" v-on:click="removeEnsalamento(sKey, dKey, hKey)">
                              <icon name="remove"></icon>
                            </button>
                          </div>
                          <transition name="slide-fade" mode="out-in">
                            <Appointment
                              v-if="appointment(sKey, dKey, hKey)"
                              v-bind:appointment="appointment(sKey, dKey, hKey)"></Appointment>
                            <div class="clear-appointment" v-else></div>
                          </transition>
                      </td>
                    </transition>
                  </template>
                </tr>
              </template>
            </tbody>
            <tfoot>
            </tfoot>
          </table>
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

    </div>
    <simplert isUseRadius=true isUseIcon=true ref="simplert"></simplert>
  </div>

</template>

<script>
import Breadcrumb from '@/components/includes/Breadcrumb'
import axios from 'axios'
import Appointment from '@/components/includes/Appointment'
import Simplert from 'vue2-simplert'
import 'vue-awesome/icons/eye-slash'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/remove'

export default {
  components: {
    Appointment,
    Simplert,
    Breadcrumb
  },
  data () {
    return {
      breadcrumbs: [
        { name: 'Ensalamentos', link: '#/ensalamentos' }
      ],
      count: '',
      semana: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
      salas: [],
      horarios: [1, 2],
      disciplinasTurmas: [],
      ensalamentos: [],
      daysHidden: ['Domingo'],
      ensalamentoInfo: {}
    }
  },
  created () {
    const id = this.$route.params.id
    axios.get(`${window.apiHostname}/api/v1/ensalamentos/${id}`)
      .then(response => {
        this.breadcrumbs.push({
          name: `Ensalamento (${response.data.titulo})`,
          link: `#/ensalamentos/${id}`,
          class: 'current'
        })
        this.ensalamentoInfo = response.data
      })
      .catch(() => {
        this.$refs.simplert.openSimplert({
          title: 'Erro',
          message: 'Não foi possível recuperar registro para edição',
          type: 'alert'
        })
      })
    this.resetState()
  },
  methods: {
    not (param) {
      return !param
    },
    resetState () {
      const id = this.$route.params.id
      this.getEnsalamentos({ id })
      this.getSalas()
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
    getSalas () {
      axios.get(`${window.apiHostname}/api/v1/salas`)
        .then(response => {
          this.salas = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getEnsalamentos ({ id }) {
      axios.get(`${window.apiHostname}/api/v1/ensalamentos/${id}`)
        .then(response => {
          this.ensalamentos = response.data.ensalamentos
          this.count = this.ensalamentos.length
        })
        .catch(error => {
          console.log(error)
        })
    },
    removeEnsalamento (sala, dia, horario) {
      for (let key in this.ensalamentos) {
        let ensalamento = this.ensalamentos[key]
        if (ensalamento.sala.id === this.salas[sala].id && parseInt(ensalamento.dia) === (dia + 1) && ensalamento.horario === this.horarios[horario]) {
          axios.delete(`${window.apiHostname}/api/v1/horarios/${ensalamento.id}`)
            .then(response => {
              this.resetState()
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
    },
    appointment (sala, dia, horario) {
      for (let key in this.ensalamentos) {
        let ensalamento = this.ensalamentos[key]
        if (ensalamento.sala.id === this.salas[sala].id && parseInt(ensalamento.dia) === (dia + 1) && ensalamento.horario === this.horarios[horario]) {
          let colorIndex = (ensalamento.turma.id % window.colors.length)
          return {
            abreviacao: ensalamento.turma.abreviacao,
            descricao: ensalamento.turma.descricao,
            disciplina: ensalamento.disciplina,
            ensalamento: ensalamento,
            color: window.colors[colorIndex]
          }
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
      try {
        let data = JSON.parse(e.dataTransfer.getData('text/plain'))
        if (data) {
          let replace = {
            from: {
              horario: data.ensalamento.horario,
              dia: data.ensalamento.dia,
              horarios_id: data.ensalamento.id,
              salas_id: data.ensalamento.sala.id,
              disciplinas_turmas_id: data.ensalamento.disciplinas_turmas_id
            },
            to: {
              dia: (params.dKey + 1).toString(),
              horario: this.horarios[params.hKey],
              salas_id: this.salas[params.sKey].id
            }
          }
          axios.put(`${window.apiHostname}/api/v1/ensalamentos/${this.ensalamentoInfo.id}/replace`, replace)
            .then(response => {
              this.resetState()
            })
            .catch(e => {
              this.$refs.simplert.openSimplert({
                title: 'Erro',
                message: `Erro ao tentar realizar as atualizações solicitadas:\n${e.response.data.message}`,
                type: 'alert'
              })
            })
        }
      } catch (e) {

      }
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
