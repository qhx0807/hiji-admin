const Login = r => require.ensure([], () => r(require('@/components/login/login')))
const Main = r => require.ensure([], () => r(require('@/components/main/main')))

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/main',
    name: 'Main',
    component: Main
  }
]

export default routes
