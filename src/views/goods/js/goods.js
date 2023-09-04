import * as url from 'url'
import axios from 'axios'
import image from 'element-ui/packages/image'
import dialog from 'element-ui/packages/dialog'
import { error } from 'autoprefixer/lib/utils'
import da from 'element-ui/src/locale/lang/da'
import item from '@/layout/components/Sidebar/Item'
export default {
  data() {
    return {
      products: [],
      showForm: false,
      showEditForm: false,
      form: {
        name: '',
        title: '',
        categoryId:'',
        intro: '',
        imageUrl: '',
        price: null,
        sellingPrice: null,
        num: null
      },
      showEditModal: false,
      currentItem: {
        name: '',
        title: '',
        categoryId: '',
        intro: '',
        imageUrl: '',
        price: null,
        sellingPrice: null,
        num: null
      },
      multipleSelection: [],
      // 上传图片参数
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList:[],
      deleteList:[],
      options: [{
        value: 1,
        label: '手机'
      }, {
        value: 2,
        label: '电视机'
      }, {
        value: 3,
        label: '空调'
      }, {
        value: 4,
        label: '洗衣机'
      }, {
        value: 5,
        label: '保护套'
      },{
        value: 6,
        label: '保护膜'
      },
      {
          value: 7,
          label: '充电器'
      },
      {
          value: 8,
          label: '充电宝'
      },],
      pagination:{
        total:0,
        currentPage:1,
        pageSize:10,
      }
    }
  },
  mounted() {
    this.getProduct()
  },
  methods: {
    getProduct(){
      console.log(this.fileList)
      axios.get("/api/product/getAll",{
        params:{
          page:this.pagination.currentPage,
          pageSize:this.pagination.pageSize },
      }).then(response=>{

        this.pagination.total=response.data.data.total
        this.products = response.data.data.list
        this.products.forEach(item=>{
          item.categoryId = item.categoryId+1
        })
      })
    },
    // 分页数据监控
    handleSizeChange(val) {console.log(val)
      this.pagination.pageSize = val;
      this.getProduct()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getProduct()
    },
    // 添加表单的弹出
    handleAdd() {
      this.form ={}
      this.fileList=[]
      this.showForm =true
    },
    // 添加商品
    addProduct() {
      // TODO: 添加商品到服务器
      this.$refs.uploadAdd.submit()
      console.log(this.fileList)

      // 生成新数据的ID
      const maxId = Math.max(...this.products.map(item => item.id))
      this.products.forEach((item, index) => {
        item.id = index + 1 // 重新生成 id
      })
      const newItem = {
        id: maxId + 1,
        name: this.form.name,
        price: this.form.price,
        imageUrl:this.form.imageUrl ,
        title: this.form.title,
        categoryId: this.form.categoryId,
        intro: this.form.intro,
        sellingPrice: this.form.sellingPrice,
        num: this.form.num
      }
      // 创建一个新的元素，并生成新的 id
      if(this.fileList.length === 0){
        this.$nextTick(() => {
          this.$message.warning('请上传一个图片')
        })
      }else{
        this.showForm = false
        this.products.push(newItem)
        this.$message.success('添加商品成功')
        this.resetForm()
    }

      window.location.reload();
    },
    // 表单数据清零
    resetForm() {
      this.products = this.products
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
      axios.post("/api/product/delete",data, {
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
      // if (val.length === 0) {
      //   this.$message.error('请选择数据再点击')
      // }
      // this.deleteList=[]
      // val.forEach((items) => {
      //   const index = this.products.findIndex(item => item.id === items.id)
      //   if (index !== -1) {
      //     this.products.splice(index, 1)
      //     this.deleteList.push(items.id)
      //   }
      // })
      val.forEach((items)=>{
        this.deleteList.push(items.id)
      })

      // delete 请求
      axios.post('/api/product/delete', this.deleteList,)
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
    handleEdit(row) {
      this.fileList=[]
      this.currentItem = Object.assign({}, row)

      // if (row.imageUrl != ''){
      // let val =[]
      // val.push(row.imageUrl)
      // this.fileList = val.map((url, index) => {
      //   return {
      //     name: `file${index+1}`,
      //     url: url,
      //     status: 'success'
      //   };
      // });}
      if (this.currentItem.imageUrl!=="http://localhost:81/"){
        this.fileList = [
          ...this.fileList,
          {
            name: `file${this.fileList.length + 1}`,
            url: this.currentItem.imageUrl,
            status: 'success'
          }
        ];
      }
    },
    // 编辑后数据进行保存
    handleSave() {
      this.$refs.uploadEdit.submit()
      this.showEditModal = false

      const index = this.products.findIndex(item => item.id === this.currentItem.id)
      if (index !== -1) {
        /////  保存修改过的img路径
        // 如果非空
        if (this.fileList.length != 0){
        this.fileList.forEach(file =>{
          if (file.url != undefined){
            this.currentItem.imageUrl=file.url}
        })}
        // 删除后添加修改的对象
        this.products.splice(index, 1, this.currentItem)
      }
      const ProductBack = {
        id: this.currentItem.id,
        name: this.currentItem.name,
        title: this.currentItem.title,
        intro: this.currentItem.intro,
        imageUrl: this.currentItem.imageUrl,
        price: this.currentItem.price,
        sellingPrice: this.currentItem.sellingPrice,
        num: this.currentItem.num,
        sales: this.currentItem.sales,
        categoryId: this.currentItem.categoryId
      }


      axios.post('/api/product/editForm', {
        id: this.currentItem.id,
        name: this.currentItem.name,
        title: this.currentItem.title,
        intro: this.currentItem.intro,
        imageUrl: this.currentItem.imageUrl,
        price: this.currentItem.price,
        sellingPrice: this.currentItem.sellingPrice,
        num: this.currentItem.num,
        sales: this.currentItem.sales,
        categoryId: this.currentItem.categoryId
      },{
        headers:{
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          this.$message.success('商品信息已保存')
          location.reload();
        })
        .catch(error => {
          this.$message.error(this.response.data.msg)
        });

      this.resetForm()
    },
    /// 图片上传
    upload(response, file, fileList){
      this.handleUploadSubmit(response, file, fileList)
    },
    // 添加-图片上传成功调用函数
    handleUploadSubmitAdd(response) {
      let item = this.products[this.products.length-1]
      item.imageUrl = response.data
    },
    // 编辑- 上传成功调用函数
    handleUploadSubmit(response) {
      this.currentItem.imageUrl = response.data.url
      this.handleSuccess()
    },
    handleSuccess() {
      // 处理上传成功后的响应数据

    },
    handleRemove(file) {
      console.log(file)
      this.$refs.uploadEdit.handleRemove(file)
      // fileList删除元素

      const index = this.fileList.indexOf(file);
      if (index > -1) {
        this.fileList.splice(index, 1);
      }
      axios.post("/api/product/deletePhoto",{url:file.url})
    },
    // 预览
    handlePictureCardPreview(file) {
      console.log(file)
      let val
      if(file.url!== undefined){
        val = file.url;
      }else {
        val = file.url
      }
      this.dialogVisible = true;
      this.dialogImageUrl = val
    },
    // 下载按钮
    handleDownload(file) {
      console.log(file);
    },
    // 上传限制
    handleBeforeUpload(file, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，已选择 ${fileList.length} 个文件，本次选择的文件将不会上传`);
      // if(fileList.length === 0){
      //   this.$message.warning(`至少上传一个文件`);
      // }

    },
    handleChange(file, fileList) {
      this.fileList = fileList
    }
  }
}
