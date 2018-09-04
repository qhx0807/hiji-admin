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
const SysSetting = r => require.ensure([], () => r(require('@/components/settings/syssetting.vue')))
const Device = r => require.ensure([], () => r(require('@/components/settings/device.vue')))
const Role = r => require.ensure([], () => r(require('@/components/settings/role.vue')))
const Merchant = r => require.ensure([], () => r(require('@/components/merchant/merchant.vue')))
const MerchantDetail = r => require.ensure([], () => r(require('@/components/merchant/merchantdetail.vue')))
const MerchantAdd = r => require.ensure([], () => r(require('@/components/merchant/merchantadd.vue')))
const PayOrders = r => require.ensure([], () => r(require('@/components/merchant/payorders.vue')))
const Handler = r => require.ensure([], () => r(require('@/components/settings/handler.vue')))
const ApplyCashBill = r => require.ensure([], () => r(require('@/components/merchant/applyCashBill.vue')))
const ApplyRecords = r => require.ensure([], () => r(require('@/components/merchant/applyrecords.vue')))
const ReviewCashApply = r => require.ensure([], () => r(require('@/components/merchant/reviewcashapply.vue')))
const WorldCup = r => require.ensure([], () => r(require('@/components/settings/worldcup.vue')))
const DataSta = r => require.ensure([], () => r(require('@/components/merchant/datasta.vue')))
const AdminParking = r => require.ensure([], () => r(require('@/components/merchant/admin-parking.vue')))
const MerchantParking = r => require.ensure([], () => r(require('@/components/merchant/merchant-parking.vue')))
const CouponType = r => require.ensure([], () => r(require('@/components/coupon/coupontype.vue')))
const CouponItem = r => require.ensure([], () => r(require('@/components/coupon/couponitem.vue')))
const CouponItemAdd = r => require.ensure([], () => r(require('@/components/coupon/couponitemadd.vue')))
const CouponItemEdit = r => require.ensure([], () => r(require('@/components/coupon/couponitemedit.vue')))
const CouponImg = r => require.ensure([], () => r(require('@/components/coupon/couponimg.vue')))
const CouponExtra = r => require.ensure([], () => r(require('@/components/coupon/couponextra.vue')))
const CouponExtraAdd = r => require.ensure([], () => r(require('@/components/coupon/couponextraadd.vue')))
const CouponExtraEdit = r => require.ensure([], () => r(require('@/components/coupon/couponextraedit.vue')))
const CouponList = r => require.ensure([], () => r(require('@/components/coupon/couponlist.vue')))
const UserMember = r => require.ensure([], () => r(require('@/components/usermember/usermember.vue')))
const UserMemberEdit = r => require.ensure([], () => r(require('@/components/usermember/usermemberedit.vue')))
const UserMemberAdd = r => require.ensure([], () => r(require('@/components/usermember/usermemberadd.vue')))
const UserMemberCenter = r => require.ensure([], () => r(require('@/components/usermember/usermembercenter.vue')))
const UserAnalysis = r => require.ensure([], () => r(require('@/components/usermember/useranalysis.vue')))
const UserMemberType = r => require.ensure([], () => r(require('@/components/usermember/usermembertype.vue')))
const UserMemberGrade = r => require.ensure([], () => r(require('@/components/usermember/usermembergrade.vue')))
const ShoppingCar = r => require.ensure([], () => r(require('@/components/usermember/shoppingcar.vue')))
const ShopOrders = r => require.ensure([], () => r(require('@/components/shop/shoporders.vue')))
const ShopOrdersInfo = r => require.ensure([], () => r(require('@/components/shop/shopordersinfo.vue')))
const ShopGoods = r => require.ensure([], () => r(require('@/components/shop/shopgoods.vue')))
const ShopGoodsAdd = r => require.ensure([], () => r(require('@/components/shop/shopgoodsadd.vue')))
const ShopGoodsEdit = r => require.ensure([], () => r(require('@/components/shop/shopgoodsedit.vue')))
const ShopGoodsType = r => require.ensure([], () => r(require('@/components/shop/shopgoodstype.vue')))
const ShopGoodsSort = r => require.ensure([], () => r(require('@/components/shop/shopgoodssort.vue')))
const FinaceTable = r => require.ensure([], () => r(require('@/components/report-table/FinaceTable.vue')))
const RealReceive = r => require.ensure([], () => r(require('@/components/report-table/RealReceive.vue')))
const RealReceiveTotal = r => require.ensure([], () => r(require('@/components/report-table/RealReceiveTotal.vue')))
const RealPay = r => require.ensure([], () => r(require('@/components/report-table/RealPay.vue')))
const Remain = r => require.ensure([], () => r(require('@/components/report-table/Remain.vue')))
const WaitReview = r => require.ensure([], () => r(require('@/components/report-table/WaitReview.vue')))
const MainTable = r => require.ensure([], () => r(require('@/components/report-table/MainTable.vue')))
const FinaceReview = r => require.ensure([], () => r(require('@/components/report-table/FinaceReview.vue')))
const CashPay = r => require.ensure([], () => r(require('@/components/report-table/CashPay.vue')))
const FinaceTotal = r => require.ensure([], () => r(require('@/components/report-table/FinaceTotal.vue')))
const ShopGoodsCx = r => require.ensure([], () => r(require('@/components/shop/ShopGoodsCx.vue')))
const ShopGoodsCxAdd = r => require.ensure([], () => r(require('@/components/shop/ShopGoodsCxAdd.vue')))
const ShopGoodsXg = r => require.ensure([], () => r(require('@/components/shop/ShopGoodsXg.vue')))
const ShopGoodsXgAdd = r => require.ensure([], () => r(require('@/components/shop/ShopGoodsXgAdd.vue')))

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
      {
        path: 'Department',
        component: Department,
        name: 'Department'
      },
      {
        path: 'Menu',
        component: Menu,
        name: 'Menu'
      },
      {
        path: 'Api',
        component: Api,
        name: 'Api'
      },
      {
        path: 'Auction',
        component: Auction,
        name: 'Auction'
      },
      {
        path: 'Log',
        component: Log,
        name: 'Log'
      },
      {
        path: 'Account',
        component: Account,
        name: 'Account'
      },
      {
        path: 'Device',
        component: Device,
        name: 'Device'
      },
      {
        path: 'Merchant',
        component: Merchant,
        name: 'Merchant'
      },
      {
        path: 'Merchant/:id',
        component: MerchantDetail,
        name: 'MerchantDetail'
      },
      {
        path: 'MerchantAdd',
        component: MerchantAdd,
        name: 'MerchantAdd'
      },
      {
        path: 'PayOrders',
        component: PayOrders,
        name: 'PayOrders'
      },
      {
        path: 'Handler',
        component: Handler,
        name: 'Handler'
      },
      {
        path: 'ApplyCash',
        component: ApplyCashBill,
        name: 'ApplyCash'
      },
      {
        path: 'ApplyRecords',
        component: ApplyRecords,
        name: 'ApplyRecords'
      },
      {
        path: 'ReviewCashApply',
        component: ReviewCashApply,
        name: 'ReviewCashApply'
      },
      {
        path: 'Role',
        component: Role,
        name: 'Role'
      },
      {
        path: 'WorldCup',
        component: WorldCup,
        name: 'WorldCup'
      },
      {
        path: 'DataSta',
        component: DataSta,
        name: 'DataSta'
      },
      {
        path: 'AdminParking',
        component: AdminParking,
        name: 'AdminParking'
      },
      {
        path: 'MerchantParking',
        component: MerchantParking,
        name: 'MerchantParking'
      },
      {
        path: 'CouponType',
        component: CouponType,
        name: 'CouponType'
      },
      {
        path: 'CouponItem',
        component: CouponItem,
        name: 'CouponItem'
      },
      {
        path: 'CouponItemAdd',
        component: CouponItemAdd,
        name: 'CouponItemAdd'
      },
      {
        path: 'CouponItem/:id',
        component: CouponItemEdit,
        name: 'CouponItemEdit'
      },
      {
        path: 'CouponImg',
        component: CouponImg,
        name: 'CouponImg'
      },
      {
        path: 'CouponExtra',
        component: CouponExtra,
        name: 'CouponExtra'
      },
      {
        path: 'CouponExtraAdd',
        component: CouponExtraAdd,
        name: 'CouponExtraAdd'
      },
      {
        path: 'CouponExtra/:id',
        component: CouponExtraEdit,
        name: 'CouponExtraEdit'
      },
      {
        path: 'CouponList',
        component: CouponList,
        name: 'CouponList'
      },
      {
        path: 'UserMember',
        component: UserMember,
        name: 'UserMember'
      },
      {
        path: 'UserMemberAdd',
        component: UserMemberAdd,
        name: 'UserMemberAdd'
      },
      {
        path: 'UserMember/:id',
        component: UserMemberEdit,
        name: 'UserMemberEdit'
      },
      {
        path: 'UserMemberCenter/:id',
        component: UserMemberCenter,
        name: 'UserMemberCenter'
      },
      {
        path: 'UserAnalysis',
        component: UserAnalysis,
        name: 'UserAnalysis'
      },
      {
        path: 'ShoppingCar',
        component: ShoppingCar,
        name: 'ShoppingCar'
      },
      {
        path: 'SysSetting',
        component: SysSetting,
        name: 'SysSetting'
      },
      {
        path: 'UserMemberType',
        component: UserMemberType,
        name: 'UserMemberType'
      },
      {
        path: 'UserMemberGrade',
        component: UserMemberGrade,
        name: 'UserMemberGrade'
      },
      {
        path: 'ShopOrders',
        component: ShopOrders,
        name: 'ShopOrders'
      },
      {
        path: 'ShopOrders/:id',
        component: ShopOrdersInfo,
        name: 'ShopOrdersInfo'
      },
      {
        path: 'ShopGoods',
        component: ShopGoods,
        name: 'ShopGoods'
      },
      {
        path: 'ShopGoodsType',
        component: ShopGoodsType,
        name: 'ShopGoodsType'
      },
      {
        path: 'ShopGoodsAdd',
        component: ShopGoodsAdd,
        name: 'ShopGoodsAdd'
      },
      {
        path: 'ShopGoods/:id',
        component: ShopGoodsEdit,
        name: 'ShopGoodsEdit'
      },
      {
        path: 'ShopGoodsSort',
        component: ShopGoodsSort,
        name: 'ShopGoodsSort'
      },
      {
        path: 'FinaceTable',
        component: FinaceTable,
        name: 'FinaceTable'
      },
      {
        path: 'RealReceive',
        component: RealReceive,
        name: 'RealReceive'
      },
      {
        path: 'RealReceiveTotal',
        component: RealReceiveTotal,
        name: 'RealReceiveTotal'
      },
      {
        path: 'RealPay',
        component: RealPay,
        name: 'RealPay'
      },
      {
        path: 'Remain',
        component: Remain,
        name: 'Remain'
      },
      {
        path: 'WaitReview',
        component: WaitReview,
        name: 'WaitReview'
      },
      {
        path: 'MainTable',
        component: MainTable,
        name: 'MainTable'
      },
      {
        path: 'FinaceReview',
        component: FinaceReview,
        name: 'FinaceReview'
      },
      {
        path: 'CashPay',
        component: CashPay,
        name: 'CashPay'
      },
      {
        path: 'FinaceTotal',
        component: FinaceTotal,
        name: 'FinaceTotal'
      },
      {
        path: 'ShopGoodsCx',
        component: ShopGoodsCx,
        name: 'ShopGoodsCx'
      },
      {
        path: 'ShopGoodsCxAdd',
        component: ShopGoodsCxAdd,
        name: 'ShopGoodsCxAdd'
      },
      {
        path: 'ShopGoodsXg',
        component: ShopGoodsXg,
        name: 'ShopGoodsXg'
      },
      {
        path: 'ShopGoodsXgAdd',
        component: ShopGoodsXgAdd,
        name: 'ShopGoodsXgAdd'
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
