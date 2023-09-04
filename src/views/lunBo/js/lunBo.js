import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'

export default {
  data(){
    return{
      fileList:[],
      currentItem:{},
      dialogImageUrl:'',
      dialogVisible:false,
      products: [],
    }
  },
  mounted() {
    // this.products=[]
    this.getProduct()

  },
  methods:{
    test() {
      console.log(this.products)
      console.log(this.fileList)
    },
    getProduct() {
      axios.get('/api/resources/carousel').then(response=>{
        console.log(response)
        response.data.data.forEach(item => {
          console.log(item)
          this.products.push('/api/'+item.imgPath);
        });
        this.getFileList()
        },
      )

    },
    getFileList(){

        this.fileList = this.products.map((url, index,uid) => {

          return {
            uid: uuidv4(),
            name: `file${index+1}`,
            url: url,
            status: 'success'
          };
        });

    },
    handleRemove(file) {
      //delete请求
      axios.delete("/api/resources/delete",
        {
          params:{
            fileUrl: file.url
          }
        }).then(response=>{
          console.log(response)
        },
      )
      // 上传控件删除
      this.$refs.editUpload.handleRemove(file)
      // fileList删除元素
      const index = this.fileList.indexOf(file);
      if (index > -1) {
        this.fileList.splice(index, 1);
      }
    },
    handlePictureCardPreview(file) {
      let val
      if(file.url!== undefined){
        val = file.url;
      }else {
        val = file.imageUrl
      }
      this.dialogVisible = true;
      this.dialogImageUrl = val
    },

    handleSuccess(response){
      this.fileList.push(response.data.url)
    }

  }
}
