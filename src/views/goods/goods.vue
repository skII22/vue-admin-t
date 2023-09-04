<template>
  <div>
    <div>
      <el-button icon="el-icon-plus" type="primary" plain @click="handleAdd()">添加商品</el-button>
      <el-button icon="el-icon-delete" type="danger" plain :disabled="multipleSelection.length === 0" @click="handleDeleteItem(multipleSelection)">删除</el-button>
    </div>
    <div>
      <el-table :data="products" style="width: 100%" :border="false" @selection-change="handleSelectionChange" >
        <el-table-column type="selection" :show-overflow-tooltip="true" />
        // 表头
        <el-table-column
          prop="name"
          label="商品名称"
          width="180"
          align="center"
        />
        <el-table-column
          prop="price"
          label="商品价格"
          width="180"
          style="background-color: #99a9bf"
          align="center"
        />
        <el-table-column
          prop="title"
          label="标题"
          width="180"
          style="background-color: #99a9bf"
          align="center"
        />
        <el-table-column
          prop="intro"
          label="商品介绍"
          width="180"
          style="background-color: #99a9bf"
          align="center"
        />
        // 图片上传
        <el-table-column
          label="图片"
          width="180px"
          prop="imageUrl"
          align="center"
        >
          <template scope="scope">
            <div>
              <el-image :src="scope.row.imageUrl" height="180" width="150"/>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="sellingPrice"
          label="售卖价格"
          width="180"
          style="background-color: #99a9bf"
          align="center"
        />
        <el-table-column
          prop="num"
          label="数量"
          width="180"
          style="background-color: #99a9bf"
          align="center"
        />

        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row),showEditModal=true"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page=this.pagination.currentPage
        :page-sizes="[10, 20, 30, 40]"
        :page-size=this.pagination.pageSize
        layout="total, sizes, prev, pager, next, jumper"
        :total=this.pagination.total>
      </el-pagination>
    </div>
    <!-- 添加商品的弹出框 -->
    <div v-if="showForm">
      <el-dialog
        class="addForm"
        :visible.sync="showForm"
        :close-on-click-modal="false"
        :before-close="resetForm"
        style="overflow-x: hidden;">
        <el-scrollbar  >
          <el-form ref="resetForm" @submit.prevent="addProduct" style="height: 600px;"
          >
            <el-form-item label="商品名称：">

              <el-input v-model="form.name" type="text" required style="width: 180px;padding-left: 10px"/>
            </el-form-item>

            <el-form-item label="商品价格：">

              <el-input v-model="form.price" required style="width: 180px;padding-left: 10px"/>
            </el-form-item>

            <el-form-item label="类型：">

              <el-select v-model="form.categoryId" placeholder="请选择商品类型" required style="width: 210px;padding-left: 38px">
                <el-option label="手机" value=1></el-option>
                <el-option label="电视机" value=2></el-option>
                <el-option label="空调" value=3></el-option>
                <el-option label="洗衣机" value=4></el-option>
                <el-option label="保护套" value=5></el-option>
                <el-option label="保护膜" value=6></el-option>
                <el-option label="充电器" value=7></el-option>
                <el-option label="充电宝" value=8></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="标题：">

              <el-input v-model="form.title" required style="width: 380px;padding-left: 38px"/>
            </el-form-item>

            <el-form-item label="商品介绍：">

              <el-input v-model="form.intro" required style="width: 353px;padding-left: 8px"/>
            </el-form-item>
<!--             图片-->
            <el-form-item>
              <a>图片:</a>

                <el-upload
                  ref="uploadAdd"
                  action="/api/product/upload"
                  :data="form"
                  list-type="picture-card"
                  :auto-upload="false"
                  :limit= "1"
                  :on-change="handleChange"
                  :on-success="handleUploadSubmitAdd"
                  :on-exceed="handleBeforeUpload"
                  :file-list="fileList"
                >
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                    <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url" alt=""
                    >
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleDownload(file)"
                    >
                      <i class="el-icon-download"></i>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>

            </el-form-item>

            <el-form-item label="售卖价格：">

              <el-input v-model="form.sellingPrice" required style="width: 180px;padding-left:7px"/>
            </el-form-item>

            <el-form-item label="数量：">

              <el-input v-model="form.num" required style="width: 207px;padding-left: 34px"/>
            </el-form-item>
            <div style="text-align: center">
              <el-button type="primary" @click="addProduct">确认添加</el-button>
              <el-button type="danger" @click="resetForm">取消</el-button>
            </div>
          </el-form>
        </el-scrollbar>
      </el-dialog>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
    <!-- 编辑商品的弹出框 -->
    <div v-if="showEditModal" class="editForm">
      <el-dialog
        :visible.sync="showEditModal"
        :close-on-click-modal="false"
      >
        <el-form ref="form" :model="currentItem" @submit.prevent="addProduct">
          <el-form-item label="商品名称：">

            <el-input v-model="currentItem.name" type="text" required/>
          </el-form-item>
          <el-form-item label="商品价格：">

            <el-input v-model.number="currentItem.price" required/>
          </el-form-item>
          <el-form-item label="类型：">
            <el-select v-model="currentItem.categoryId" placeholder="请选择商品类型" required>
<!--              <el-option label="手机" value="1"></el-option>-->
<!--              <el-option label="电视机" value="2"></el-option>-->
<!--              <el-option label="空调" value="3"></el-option>-->
<!--              <el-option label="洗衣机" value="4"></el-option>-->
<!--              <el-option label="保护套" value="5"></el-option>-->
<!--              <el-option label="保护膜" value="6"></el-option>-->
<!--              <el-option label="充电器" value="7"></el-option>-->
<!--              <el-option label="充电宝" value="8"></el-option>-->
              <el-option
                v-for="item in this.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="标题：">

            <el-input v-model="currentItem.title" required />
          </el-form-item>

          <el-form-item label="商品介绍：">

            <el-input v-model="currentItem.intro" required />
          </el-form-item>
<!--           图片-->
          <el-form-item >
            <a>图片:</a>
            <el-upload
              ref="uploadEdit"
              action="/api/product/upload-edit"
              list-type="picture-card"
              :auto-upload="false"
              :limit= "1"
              :data="currentItem"
              :on-success= handleUploadSubmit
              :on-exceed="handleBeforeUpload"
              :file-list="fileList"
              >
<!--              :on-exceed="handleBeforeUpload"-->
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}" >
                <img
                  v-if="file.url"
                  class="el-upload-list__item-thumbnail"
                  :src="file.url" alt=""
                >
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <i class="el-icon-download"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>

          </el-form-item>

          <el-form-item label="售卖价格：">

            <el-input v-model="currentItem.sellingPrice" required />
          </el-form-item>

          <el-form-item label="数量：">

            <el-input v-model="currentItem.num" required />
          </el-form-item>
          <el-button type="primary" @click="handleSave">确认编辑</el-button>
          <el-button @click="showEditModal = false">取消</el-button>
        </el-form>
      </el-dialog>
      <el-dialog :visible.sync="dialogVisible">
        <img width="50%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script src="./js/goods.js"/>
<style src="./css/goods.css"/>

