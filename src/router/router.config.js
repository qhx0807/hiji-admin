const Login = r => require.ensure([], () => r(require('@/components/login/login')))
const Main = r => require.ensure([], () => r(require('@/components/main/main')))
const Lock = r => require.ensure([], () => r(require('@/components/main-components/lockscreen/components/locking-page.vue')))
const Department = r => require.ensure([], () => r(require('@/components/settings/department.vue')))

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Main',
    name: 'Main',
    component: Main,
    children: [
      {
        path: 'Department',
        name: 'Department',
        component: Department
      }
    ]
  },
  {
    path: '/Lock',
    name: 'Lock',
    component: Lock
  }
]

export default routes
