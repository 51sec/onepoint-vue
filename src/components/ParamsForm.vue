<template>
  <div>
    <el-card class="box-card" shadow="hover" v-for="e in params" :key="e.name" v-show="!e.hidden">
      <p :class="e.star?'form-star':''">{{ e.name }}<el-popover
          v-if="e.desc"
          placement="right-end"
          trigger="hover">
        <div v-html="e.desc"></div>
        <svg-icon slot="reference" style="fill:#e91e6394;" icon-class="information-outline"></svg-icon>
      </el-popover></p>
      <el-input v-if="e.textarea"
                type="textarea"
                :rows="4"
                :placeholder="e.placeholder"
                v-model="e.value">
      </el-input>
      <el-radio-group v-else-if="e.select" v-model="e.value">
        <el-radio v-for="e1 in e.select" :key="e1" :label="e1"></el-radio>
      </el-radio-group>
      <array-from v-else-if="e.array" :array="e.value"></array-from>
      <el-input v-else v-model="e.value" :placeholder="e.placeholder"></el-input>
    </el-card>
    <el-card class="box-card" shadow="hover">
      <pre><code>{{JSON.stringify(config,null,2) }}</code></pre>
    </el-card>
  </div>
</template>
<script>
import ArrayFrom from "@/components/ArrayFrom";
export default {
  name:'ParamsForm',
  components: {ArrayFrom},
  props:{
    params:Array
  },
  data() {
    return {};
  },
  computed:{
    config(){
      return this.params.reduce((last,e)=>{last[e.name]=e.value;return last;},{});
    }
  }
}
</script>
<style scoped>
.box-card{
  margin-top: 10px;
}
.form-star:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
</style>