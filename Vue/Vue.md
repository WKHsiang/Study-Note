## 响应式
1. vue 响应式原理：
    Object.defineProperty 数据劫持 （待深入研究）

2. vm.$nextTick & Vue.nextTick
Dom更新后会立即执行
vue的缺点，vue会等待主线程任务执行完，如果一直不执行完，会导致页面卡死