<template>
  <div
    v-on:dragstart="handleDragStart($event)"
    v-on:dragend="handleDragEnd"
    draggable="true">
    <div class="turma">{{appointment.abreviacao}}</div>
    <div class="disciplina">{{appointment.disciplina.nome}}</div>
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

<style lang="scss" scoped>
div[draggable] {
	user-select: none;
	display: inline-block;
	margin: 3px 15px 10px 3px;
	align-items: center;
	justify-content: center;
  text-transform: uppercase;
  font-size: 10px;
	cursor: move;
  position: relative;

  .turma {
    background-color: teal;
    text-align: center;
    height: 35px;
    border-radius: 2px;
    color: #fff;
    padding-top: 2px;
    width: 110px;
  }
  .disciplina {
    position: absolute;
    top: 15px;
    left: 5px;
    font-size: 8px;
    background-color: #fff;
    color: darkred;
    border: 1px solid #ccc;
    border-radius: 2px;
    height: 25px;
    display: flex;
    width: 110px;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    padding: 2px;
  }
}
</style>
