import axios from 'axios'

export default {
  data() {
    return {
      orders: [],
      status : false,
      handle:false,
    }
  },
  watch:{
    status(newValue){
      if (newValue === true){
        this.handle=true
      }

    }
  },
  mounted() {
    this.getOrder()
  },
  methods:{
    getOrder(){
      axios.get("/api/order/getorder").then(res=>{
        this.orders = res.data.data
        console.log(res)
      })
    }
  }
}
