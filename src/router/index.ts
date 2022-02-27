import { createRouter,createWebHistory} from "vue-router";

// 路由信息
const routes = [
  {
    path: "/",
    name: "demo",
    component:  () => import('@/views/demo/demo.vue'),
  },
];

// 导出路由
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
