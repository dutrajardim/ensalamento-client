import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/index'
import SalasForm from '@/components/salas/Form'
import SalasList from '@/components/salas/List'
import DisciplinasForm from '@/components/disciplinas/Form'
import DisciplinasList from '@/components/disciplinas/List'
import TurmasForm from '@/components/turmas/Form'
import TurmasList from '@/components/turmas/List'
import TurmasDisciplinas from '@/components/turmas/Disciplinas'
import TurmasHorarios from '@/components/turmas/Horarios'
import Schedule from '@/components/horarios/Schedule'
import HorariosList from '@/components/horarios/List'
import HorariosForm from '@/components/horarios/Form'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/salas/cadastrar',
      name: 'SalasForm',
      component: SalasForm
    },
    {
      path: '/salas',
      name: 'SalasList',
      component: SalasList
    },
    {
      path: '/salas/editar/:id',
      name: 'SalasEditForm',
      component: SalasForm
    },
    {
      path: '/disciplinas/cadastrar',
      name: 'DisciplinasForm',
      component: DisciplinasForm
    },
    {
      path: '/disciplinas',
      name: 'DisciplinasList',
      component: DisciplinasList
    },
    {
      path: '/disciplinas/editar/:id',
      name: 'DisciplinasEditForm',
      component: DisciplinasForm
    },
    {
      path: '/turmas/cadastrar',
      name: 'TurmasForm',
      component: TurmasForm
    },
    {
      path: '/turmas',
      name: 'TurmasList',
      component: TurmasList
    },
    {
      path: '/turmas/:id/editar',
      name: 'TurmasEditForm',
      component: TurmasForm
    },
    {
      path: '/turmas/:id/disciplinas',
      name: 'TurmasDisciplinasForm',
      component: TurmasDisciplinas
    },
    {
      path: '/turmas/:id/horarios',
      name: 'TurmasHorariosForm',
      component: TurmasHorarios
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/horarios/cadastrar',
      name: 'HorariosForm',
      component: HorariosForm
    },
    {
      path: '/horarios',
      name: 'HorariosList',
      component: HorariosList
    },
    {
      path: '/horarios/:id/editar',
      name: 'HorariosEditForm',
      component: HorariosForm
    },
    {
      path: '/horarios/:id/ensalamentos',
      name: 'Schedule',
      component: Schedule
    }
  ]
})
