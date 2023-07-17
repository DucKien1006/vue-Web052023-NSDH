import home from '@/router/main/home.js';
import cash from '@/router/main/cash.js';

const router = [
  {
    path: '/',
    children: [...home],
  },
  {
    path: '/cash',
    children: [...cash],
  },
]

export default router;