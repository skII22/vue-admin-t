import axios from 'axios'
export default {
  data() {
    return {
      products: [],
      showForm: false,
      showEditForm: false,
      form: {
        name: '',
        title: '',
        categoryId: '',
        intro: '',
        imageUrl: '',
        price: null,
        sellingPrice: null,
        num: null
      },
      showEditModal: false,
      currentItem: {},
      multipleSelection: [],
      // 上传图片参数
      dialogImageUrl: [],
      dialogVisible: false,
      disabled: false,
      fileList:[],
      AddImgUrl:'',
      ProductName:'',
      deleteList:[],
      pagination:{
        total:0,
        currentPage:1,
        pageSize:10,
      }
    }
  },
  mounted() {
    this.getDetail()
      // 延迟刷新

  },
  methods: {


    // 数据获取
    getDetail() {
      axios.get("/api/goods/getDetail",{
        params:{
        page:this.pagination.currentPage,
        pageSize:this.pagination.pageSize },
      }).then(response=>{
        this.pagination.total=response.data.data.total
        this.products = response.data.data.list
      })
    },
    // 分页数据监控
    handleSizeChange(val) {console.log(val)
      this.pagination.pageSize = val;
      this.getDetail()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getDetail()
    },
    // 添加表单的弹出
    handleAdd(){
      this.form ={}
      this.fileList=[]
      this.showForm =true
    },
    // 添加商品
    addProduct() {
      // TODO: 添加商品到服务器
      this.$refs.addUpload.submit()


      // 生成新数据的ID
      const maxId = Math.max(...this.products.map(item => item.id))
      this.products.forEach((item, index) => {
        item.id = index + 1 // 重新生成 id
      })
      const newItem = { id: maxId + 1, name: this.form.name, price: this.form.price ,imageUrl:[]} // 创建一个新的元素，并生成新的 id
      if(this.fileList.length === 0){
        this.$nextTick(() => {
          this.$message.warning('请上传一个图片')
        })
      }else {
        this.showForm = false
        this.products.push(newItem)
        this.$message.success('添加商品成功')
        this.resetForm()
      }
      window.location.reload();
    },
    // 表单数据清零
    resetForm() {
      this.showForm = false
      this.form = {
        name: '',
        price: null
      }
    },
    // 获取选中对象信息
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 单个删除功能
    handleDelete(row) {
      this.deleteList=[]
      this.deleteList[0] = row.id
      // delete 请求
      const data = this.deleteList
      axios.post("/api/goods/delete",data, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response=>{
        if(response.data.code === 200){
          //
          const index = this.products.indexOf(row)
          if (index !== -1) {
            this.products.splice(index, 1)
          }}
        //
        this.deleteList = []
        if (response.data.code ===200){
          this.$message(response.data.msg)
        }else {
          this.$message.error(response.data.msg)
        }
      }).catch(error=>{
        this.$message.error(error)
      })
    },
    // 批量删除功能
    handleDeleteItem(val) {
      val.forEach((items)=>{
        this.deleteList.push(items.id)
      })

      // delete 请求
      axios.post('/api/goods/delete', this.deleteList,)
        .then(response => {
          if (response.data.code === 200){
            // 前端删除
            if (val.length === 0) {
              this.$message.error('请选择数据再点击')
            }
            this.deleteList=[]
            val.forEach((items) => {
              const index = this.products.findIndex(item => item.id === items.id)
              if (index !== -1) {
                this.products.splice(index, 1)
              }
            })}
          //
          this.fileList=[]
          if (response.data.code ===200){
            this.$message(response.data.msg)
          }else {
            this.$message.error(response.data.msg)
          }
        })
        .catch(error => {
          this.$message.error(error)
        });
    },
    // 弹出编辑表单页面
    async handleEdit(row) {
      this.currentItem = Object.assign({}, row)
      this.ProductName = this.currentItem.name
      this.fileList=[]
      this.fileList = row.imageUrl.map((url, index) => {
        return {
          name: `file${index+1}`,
          url: url,
          status: 'success'
        };
      });
      this.showEditModal = true
    },
    // 编辑后数据进行保存
    handleSave() {
      this.showEditModal = false
      const index = this.products.findIndex(item => item.id === this.currentItem.id)
      // this.$refs.editUpload.submit()
      if (index !== -1) {
        /////  保存修改过的img路径
        this.currentItem.imageUrl=[]

        // this.fileList.forEach(file =>{
        //   if (file.url != undefined){
        //   this.currentItem.imageUrl.splice(this.currentItem.imageUrl.length,1,file.url)}
        // })
        this.products.splice(index, 1, this.currentItem)

        const data={
          name : this.currentItem.name,
          imageUrl : this.currentItem.imageUrl,
          id: this.currentItem.id
        }
        axios.post("/api/goods/editForm", data).then(response=>{
          this.fileList=[]
          this.$message.success('商品信息已保存')
          setTimeout(location.reload(),80)
        }).catch(error=>{
          this.$message.error(this.response.data.msg)
        })
      }



      this.resetForm()
    },
    // 图片上传
    handleUploadSubmitAdd(response){
      let item = this.products[this.products.length-1]
      console.log(response)
      item.imageUrl.splice(item.imageUrl.length,1,response.data)
    },
    upload(){
      this.handleUploadSubmit()
      },
    handleUploadSubmit(response) {
          // 将新上传的文件信息添加到fileList数组中
      // this.currentItem.imageUrl.push(response.data.data[0])
      this.fileList.push(response.data[0])
      console.log(response.data[0])
    },
    // 处理上传成功后的响应数据
    handleSuccess(response,file,fileList) {
      console.log(response.data.url)
    },
    // 删除图片
    handleRemove(file) {
      // 上传控件删除
      this.$refs.editUpload.handleRemove(file)
      // fileList删除元素
      const index = this.fileList.indexOf(file);
      if (index > -1) {
        this.fileList.splice(index, 1);
      }
      axios.post("/api/goods/deletePhoto",{url:file.url})
    },
    // 预览
    handlePictureCardPreview(file) {
      let val
      if(file.url!== undefined){
        val = file.url;
      }else {
        val = file.imageUrl
      }
      console.log(val)
      this.dialogVisible = true;
      this.dialogImageUrl = val


    },
    // 下载按钮
    handleDownload(file) {
      console.log(file);
    },
    // 上传限制
    handleBeforeUpload() {
      // this.$message.warning(`当前限制选择 1 个文件，已选择 ${this.fileList.length} 个文件，本次选择的文件将不会上传`);
      console.log(this.currentItem.imageUrl)
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    }
  }
}
