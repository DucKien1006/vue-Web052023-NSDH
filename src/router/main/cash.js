const router = [
  {
    path: '/cash',
    component: () => import('@/views/cash/CashMain.vue'),
    meta: { title: 'Tiền mặt' }
  },
  {
    path: '/cash/employee',
    component: () => import("@/views/cash/employee/EmployeePage.vue"),
    meta: { title: 'Nhân viên' }
  },
]

export default router;