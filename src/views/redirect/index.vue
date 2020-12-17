<script>
export default {
  created() {
    const u = this.$route.params.pathMatch;
    if(u.startsWith('http://')||u.startsWith('https://')){
      window.open(u,'_blank');
      this.$router.go(-1);
    } else this.$router.replace(u);
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
