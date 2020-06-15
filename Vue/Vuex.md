 # Vuex

 ## state

 - this.$store.state.xxx
 - mapState(['xxx', 'yyy'])
 - mapState({
     newName: state=>state.xxx
 })

 ## getters

 - this.$store.getters.xxx
 - mapGetters(['xxx'])
 - mapGetters({
     newName: 'xxx'
   })
 - getters: {
     func(state, getters) {
         return 'xxx'
     }
 } 

 ## mutations

- 改变vuex中的状态
- 只能执行同步的
- this.$store.commit('xxxfun')
- mapMutations(['xxxfun'])
- mapMutations({
    newName: 'xxxfun'
})

 ## actions

 - 提交mutations，让mutation去更改状态
 - 能够执行异步
 - this.$store.dispatch('xxxfun')
 - mapActions(['xxxfun'])
 - mapActions({
     newName: 'xxxfun'
 })

 ## modules

 - 根据功能让vuex分出模块
 - state会放入到每一个模块下，getters、mutations、actions会直接放入到全局

 ### 获取vuex中的数据(无namespaced的情况下)
 - 获取state：this.$store.state.moduleName.xxx
 - 获取getters：this.$store.getters.xxx
 - 获取mutations：this.$store.commit('xxxfun')
 - 获取actions：this.$store.dispatch('xxxfun')
 - 可以通过mapXXX方式拿到getters、mutations、actions，但是不能拿到state，如果想要通过这种方式获取state，需要加命名空间 namespaced:true

 ### 获取vuex中的数据(有namespaced的情况下)
 - 获取state：this.$store.state.moduleName.xxx
 - 获取getters：this.$store['moduleName/getters'].xxx
 - 获取mutations：this.$store.commit('moduleName/xxxfun')
 - 获取actions：this.$store.dispatch('moduleName/xxxfun')
 - 可以通过mapXXX: mapXXX('moduleName', ['xxx']) mapXXX('moduleName', {})