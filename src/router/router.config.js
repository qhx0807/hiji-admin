const Error404 = r => require.ensure([], () => r(require('@/components/error-page/404.vue')))
const Login = r => require.ensure([], () => r(require('@/components/login/login')))
const Main = r => require.ensure([], () => r(require('@/components/main/main')))
const Lock = r => require.ensure([], () => r(require('@/components/main-components/lockscreen/components/locking-page.vue')))
const Department = r => require.ensure([], () => r(require('@/components/settings/department.vue')))
const Menu = r => require.ensure([], () => r(require('@/components/settings/menu.vue')))
const Api = r => require.ensure([], () => r(require('@/components/settings/api.vue')))
const Auction = r => require.ensure([], () => r(require('@/components/auction/auction.vue')))
const Log = r => require.ensure([], () => r(require('@/components/settings/log.vue')))
const Home = r => require.ensure([], () => r(require('@/components/home/home.vue')))
const Account = r => require.ensure([], () => r(require('@/components/settings/account.vue')))
const Device = r => require.ensure([], () => r(require('@/components/settings/device.vue')))
const Role = r => require.ensure([], () => r(require('@/components/settings/role.vue')))
const Merchant = r => require.ensure([], () => r(require('@/components/merchant/merchant.vue')))
const PayOrders = r => require.ensure([], () => r(require('@/components/merchant/payorders.vue')))
const Handler = r => require.ensure([], () => r(require('@/components/settings/handler.vue')))
const ApplyCash = r => require.ensure([], () => r(require('@/components/merchant/applycash.vue')))
const ReviewCashApply = r => require.ensure([], () => r(require('@/components/merchant/ReviewCashApply.vue')))

const routesArr = [
  Department,
  Menu,
  Api,
  Auction,
  Log,
  Account,
  Device,
  Merchant,
  PayOrders,
  Handler,
  ApplyCash,
  ReviewCashApply,
  Role
]

let arr = []

routesArr.forEach((item, index) => {
  let obj = {}
  obj[`path`] = item.name
  obj[`name`] = item.name
  obj[`component`] = item

  arr.push(obj)
})

const routes = [
  {
    path: '*',
    component: Error404
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Main',
    component: Main,
    children: [
      {
        path: '',
        component: Home,
        name: 'Home'
      },
      ...arr
    ]
  },
  {
    path: '/Lock',
    name: 'Lock',
    component: Lock
  }
]

export default routes
