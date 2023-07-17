const router = [
  {
    path: '/',
    component: () => import("@/views/home/HomePage.vue"),
    meta: { title: 'Trang chủ' }
  },
]

export default router;