<template>
  <div
    v-on:dragstart="handleDragStart($event)"
    v-on:dragend="handleDragEnd"
    draggable="true"
    class="appointment">
    <div class="appointment__turma" :style="{ backgroundColor: appointment.color }">{{appointment.abreviacao}}</div>
    <div class="appointment__disciplina" :style="{ color: appointment.color }">{{appointment.disciplina.nome}}</div>
  </div>
</template>

<script>
export default {
  props: {
    appointment: {
      type: Object
    }
  },
  data () {
    return {
      msg: 'test'
    }
  },
  created () {
  },
  methods: {
    handleDragStart (e) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', JSON.stringify(this.appointment))
    },
    handleDragEnd () {
      let elements = document.getElementsByClassName('dragenter')
      for (let el of elements) {
        el.classList.remove('dragenter')
      }
    }
  }
}
</script>
