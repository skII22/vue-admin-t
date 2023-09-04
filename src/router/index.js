import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '商品信息维护', icon: 'el-icon-more' },
    children: [
      {
        path: 'goods',
        name: 'Good',
        component: () => import('@/views/goods/goods'),
        meta: { title: '商品管理', icon: 'el-icon-picture' }
      },
      {
      path: 'goods_picture',
      name: 'Picture',
      component: ()=> import('@/views/goods_picture/goods_picture'),
      meta:{title: '商品图片',icon: 'el-icon-picture-outline'}
      },
    ]
  },

  {
    path: '/lunbo',
    component: Layout,
    children: [
      {
        path: '',
        name: 'lunbo',
        component: ()=> import('@/views/lunBo/lunBo'),
        meta:{title: '轮播',icon: 'el-icon-data-analysis'}
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: '',
        name: 'order',
        component: ()=> import('@/views/order/order'),
        meta:{title: '订单处理',icon: 'el-icon-s-order'}
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: '/changepw',
        name: 'changepw',
        component: ()=> import('@/views/changePassword/changePw'),
        meta:{title: '密码修改',icon: 'el-icon-s-tools'}
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
