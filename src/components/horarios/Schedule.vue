<template>
  <div class="card schedule">
    <div class="card-block">
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <template v-for="(dia,dKey) in semana">
              <transition name="slide-fade">
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
            <tr v-for="(horario, hKey) in horarios" v-bind:key="hKey">
              <td v-if="hKey === 0" v-bind:rowspan="horarios.length" class="left-head"><span>{{sala.nome}}</span></td>
              <td class="left-head"><span>{{horario}}</span></td>
              <template v-for="(dia, dKey) in semana">
                <transition name="slide-fade">
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
    <transition name="slide-fade">
      <div class="btns" v-if="hasChange()">
        <button class="button-s1" v-on:click="resetState">Resetar</button>
        <button class="button-s1" v-on:click="saveState">Salvar</button>
      </div>
    </transition>
    <div class="box-s1">
      <head>Disciplinas de turmas para agendamento</head>
      <main>
        <Appointment
          v-for="(dt, key) in disciplinasTurmas"
          v-bind:key="key" 
          v-bind:appointment="dt"></Appointment>
      </main>
      <footer>Carregue os componentes para a tabela para agendamento</footer>
    </div>
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
    <simplert isUseRadius=true isUseIcon=true ref="simplert"></simplert>
  </div>
</template>

<script>
import axios from 'axios'
import Appointment from './Appointment'
import Simplert from 'vue2-simplert'
import 'vue-awesome/icons/eye-slash'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/remove'

export default {
  data () {
    return {
      count: '',
      semana: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
      salas: [],
      horarios: [1, 2],
      disciplinasTurmas: [],
      ensalamentos: [],
      daysHidden: ['Domingo']
    }
  },
  created () {
    this.resetState()
  },
  methods: {
    not (param) {
      return !param
    },
    hasChange () {
      if (this.count !== this.ensalamentos.length) return true
      let has = false
      for (let ensalamento of this.ensalamentos) {
        if (!ensalamento.hasOwnProperty('updated_at')) {
          has = true
          break
        }
      }
      return has
    },
    resetState () {
      const id = this.$route.params.id
      this.getEnsalamentos({ id })
      this.getSalas()
      this.getDisciplinasTurmas()
    },
    saveState () {
      const id = this.$route.params.id
      const data = this.ensalamentos.map((el) => {
        return {
          dia: `${el.dia}`,
          turmas_id: el.turmas_id,
          salas_id: el.salas_id,
          horario: el.horario,
          disciplinas_id: el.disciplinas_id
        }
      })
      axios.post(`${window.apiHostname}/api/v1/horarios/${id}/ensalamentos`, data)
        .then(response => {
          this.$refs.simplert.openSimplert({
            title: 'Sucesso',
            message: 'Informações salvas',
            type: 'info'
          })
          this.resetState()
        })
        .catch(() => {
          this.$refs.simplert.openSimplert({
            title: 'Erro',
            message: 'Não foi possível salvar as informações requeridas',
            type: 'alert'
          })
        })
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
    getDisciplinasTurmas () {
      axios.get(`${window.apiHostname}/api/v1/disciplinasTurmas`)
        .then(response => {
          const data = []
          let turmaDisc
          response.data.forEach((turma) => {
            turma.disciplinas.forEach((disciplina) => {
              turmaDisc = {
                abreviacao: turma.abreviacao,
                descricao: turma.descricao,
                id: turma.id,
                disciplina: {
                  id: disciplina.id,
                  nome: disciplina.nome,
                  horarios: disciplina.pivot.horarios
                }
              }
              data.push(turmaDisc)
            })
          })
          this.disciplinasTurmas = data
        })
        .catch(error => {
          console.log(error)
        })
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
      axios.get(`${window.apiHostname}/api/v1/horarios/${id}/ensalamentos`)
        .then(response => {
          this.ensalamentos = response.data
          this.count = this.ensalamentos.length
        })
        .catch(error => {
          console.log(error)
        })
    },
    removeEnsalamento (sala, dia, horario) {
      for (let key in this.ensalamentos) {
        let el = this.ensalamentos[key]
        if (el.salas_id === this.salas[sala].id && parseInt(el.dia) === dia && el.horario === this.horarios[horario]) {
          this.ensalamentos.splice(key, 1)
        }
      }
    },
    appointment (sala, dia, horario) {
      for (let key in this.ensalamentos) {
        let el = this.ensalamentos[key]
        if (el.salas_id === this.salas[sala].id && parseInt(el.dia) === dia && el.horario === this.horarios[horario]) {
          let resp
          for (let dt of this.disciplinasTurmas) {
            if (dt.id === el.turmas_id && dt.disciplina.id === el.disciplinas_id) {
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
      try {
        let data = JSON.parse(e.dataTransfer.getData('text/plain'))
        if (data) {
          const hasEnsalamento = this.ensalamentos.findIndex(el => {
            return (parseInt(el.dia) === params.dKey && el.salas_id === this.salas[params.sKey].id && el.horario === this.horarios[params.hKey])
          })
          if (hasEnsalamento === -1) {
            this.ensalamentos.push({
              dia: params.dKey,
              salas_id: this.salas[params.sKey].id,
              horario: this.horarios[params.hKey],
              turmas_id: data.id,
              disciplinas_id: data.disciplina.id
            })
          } else {
            this.$refs.simplert.openSimplert({
              title: 'Erro',
              message: 'Remova o agendamento presente para adicionar outro',
              type: 'alert'
            })
          }
        }
      } catch (e) {

      }
    }
  },
  components: {
    Appointment,
    Simplert
  }
}
</script>

<style lang="scss" scoped>
.btns {
  margin-top: 20px;
  text-align: right;
}
</style>
