<template>
  <div class="page">
    <awesome-cascader :selected="defaultSelected" :options="innerData" v-model="selected"></awesome-cascader>
  </div>
</template>

<script>
import SOURCE_DATA from './data'
import AwesomeCascader from '../src/index'
export default {
  name: 'App',

  data () {
    return {
      selected: [],
      defaultSelected: ['id-大类3 id-小类3-1 id-小小类3-1-2']
    }
  },

  created () {
    this.innerData = SOURCE_DATA
  },

  components: { AwesomeCascader }
}
</script>

<style>
.page {
  background-color: #fff;
}
</style>

