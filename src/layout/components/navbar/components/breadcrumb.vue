<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <el-breadcrumb-item v-for="(item) in levelList" :key="item.path">
      <span>
        {{item.meta.title}}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  props:{

  },
  data(){
    return{
      levelList:[],
    }
  },
  methods:{

  }
}
</script>
<style scoped lang='scss'>

</style>