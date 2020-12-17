<template>
  <div>
    <el-tag v-for="e in array" :key="e" closable :disable-transitions="false" @close="handleClose(e)">{{ e }}</el-tag>
    <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
  </div>
</template>
<script>

export default {
  name:'ArrayFrom',
  props:{
    array:Array
  },
  data(){
    return{
      inputVisible:false,
      inputValue:''
    }
  },
  methods: {
    handleClose(tag) {
      this.array.splice(this.array.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.array.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
}

</script>
<style scoped>
.el-tag{
  margin: 5px;
}
.button-new-tag {
  margin: 5px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 200px;
  margin: 5px;
  vertical-align: bottom;
}

</style>