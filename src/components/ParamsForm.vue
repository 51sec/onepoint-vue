<template>
  <div>
    <el-card class="box-card" shadow="hover" v-for="e in params" :key="e.name" v-show="!e.hidden">
      <h3 :class="e.star?'form-star':''">{{ e.name }}</h3>
      <array-from v-if="Array.isArray(values[e.name])" :array="values[e.name]"></array-from>
      <el-input v-else-if="e.textarea"
                type="textarea"
                :autosize="{ minRows: 6 }"
                :placeholder="e.placeholder"
                v-model="values[e.name]">
      </el-input>
      <el-radio-group v-else-if="e.select" v-model="values[e.name]">
        <el-radio v-for="e1 in e.select" :key="e1" :label="e1"></el-radio>
      </el-radio-group>
      <el-input v-else v-model="values[e.name]" :placeholder="e.placeholder"></el-input>
      <div class="mt-3" v-html="e.desc"></div>
    </el-card>
    <el-card class="box-card" shadow="hover">
      <h3>result</h3>
      <pre style="overflow-x: auto;"><code>{{ JSON.stringify(values, null, 2) }}</code></pre>
    </el-card>
  </div>
</template>
<script>
import ArrayFrom from "@/components/ArrayFrom";

export default {
  name: 'ParamsForm',
  components: {ArrayFrom},
  props: {
    params: Array,
    values: Object
  },
  data() {
    return {};
  },
  created() {
    this.format(this.params);
  },
  watch: {
    params: function (v) {
      this.format(v);
    }
  },
  methods: {
    format(v) {
      Array.prototype.sort.call(v, (a, b) => b.level - a.level)
      console.log(v);
      v.forEach(e => {
        if (this.values[e.name] === undefined || this.values[e.name] === null) {
          this.$set(this.values, e.name, e.value)
        }
      })
    }
  },
  computed: {
    config() {
      return this.params.reduce((last, e) => {
        last[e.name] = this.values[e.name];
        return last;
      }, {});
    }
  }
}
</script>
<style scoped>
.box-card {
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