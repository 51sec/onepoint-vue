<template>
  <div>
    <el-card class="box-card" shadow="hover" v-for="e in params" :key="e.name" v-show="!e.hidden">
      <h3 :class="e.star?'form-star':''">{{ e.name }}</h3>
      <array-from v-if="Array.isArray(e.value)" :array="e.value"></array-from>
      <el-input v-else-if="e.textarea"
                type="textarea"
                :rows="10"
                :placeholder="e.placeholder"
                v-model="e.value">
      </el-input>
      <el-radio-group v-else-if="e.select" v-model="e.value">
        <el-radio v-for="e1 in e.select" :key="e1" :label="e1"></el-radio>
      </el-radio-group>
      <el-input v-else v-model="e.value" :placeholder="e.placeholder"></el-input>
      <div class="mt-3" v-html="e.desc"></div>
    </el-card>
    <el-card class="box-card" shadow="hover">
      <h3>result</h3>
      <pre style="overflow-x: auto;"><code>{{JSON.stringify(config,null,2) }}</code></pre>
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
  created() {
    this.params.sort((a, b) => b.level-a.level);
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
h3:before {
  content: "#";
  color: #f56c6c;
  margin-right: 4px;
}
.form-star:after {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
</style>