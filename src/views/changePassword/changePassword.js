import axios from 'axios'

export default {
  data(){
    return{
      oldPw:'',
      newPw:'',
      confirmPw:'',
      passwordMatch:true,
    }
  },
  mounted() {
    this.msg()
  },
  watch:{
    newPw: function (newVal, oldVal) {
      if (this.confirmPw === ''){
        this.passwordMatch = true
      }else {
        this.passwordMatch = newVal === this.confirmPw
      }
    },
    confirmPw: function (newVal, oldVal) {
      if (this.newPw === ''){
        this.passwordMatch = true
      }else {
        this.passwordMatch = newVal === this.newPw
      }
    },
  },
  methods:{
    test(){
      console.log(this.confirmPw)
    },
    msg(){
      if(this.passwordMatch === false){
        this.$message('两次密码不一致')
      }

    },
    submit(oldVal,newVal){
      axios.post("/api/user/changePw",{
        oldPw:oldVal,
        newPw:newVal
      }).then(res=>{
        if (res.data.code === '200'){
          this.$message.success(res.data.msg)
        }else {
          console.log(res.data.code)
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
