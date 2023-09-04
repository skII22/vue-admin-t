<template>
  <div>
    <div>
      <el-button icon="el-icon-plus" type="primary" plain @click="handleAdd()">添 加商品</el-button>
      <el-button icon="el-icon-delete" type="danger" plain :disabled="multipleSelection.length === 0" @click="handleDeleteItem(multipleSelection)">删除</el-button>
    </div>
    <div>
      <el-table :data="products" style="width: 100%" :border="false" @selection-change="handleSelectionChange" v-load>
        <el-table-column type="selection" :show-overflow-tooltip="true" />
        // 表头
        <el-table-column
          prop="name"
          label="商品名称"
          width="730"
          align="center"
        />


        // 图片上传

        <el-table-column
          label="商品图片"
          width="200px"
          prop="imageUrl"
          align="center"
        >
          <template scope="scope">
            <div>
              <el-image :src="scope.row.imageUrl[0]" height="180" width="150"/>
<!--              <img :src="products.imageUrl" height="180" width="150"/>-->
            </div>
          </template>
        </el-table-column>


        <el-table-column label="操作" width="700" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
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
    <div v-if="showForm" >
      <el-dialog
        class="addForm"
        :visible.sync="showForm"
        :close-on-click-modal="false"
        :before-close="resetForm"
        style="overflow-x: hidden">
        <el-scrollbar style="height: 600px;overflow-x:hidden;overflow-y: auto" >
          <el-form ref="resetForm" @submit.prevent="addProduct"
          >
            <el-form-item label="商品名称：">

              <el-input v-model="form.name" type="text" required />
            </el-form-item>
<!--             图片-->
            <el-form-item>
              <a>picture:</a>

                <el-upload
                  ref="addUpload"
                  action="/api/goods/upload"
                  :file-list="fileList"
                  :on-success="handleUploadSubmitAdd"
                  :data="form"
                  list-type="picture-card"
                  :auto-upload="false"
                  :on-exceed="handleBeforeUpload"
                  :on-change="handleChange"
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


            <el-button type="submit" @click="addProduct">确认添加</el-button>
            <el-button type="button" @click="resetForm">取消</el-button>
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


<!--           图片-->
          <el-form-item label="">
            <a>图片：</a>
            <el-upload
              ref="editUpload"
              action="/api/goods/upload"
              list-type="picture-card"
              :auto-upload="true"
              :data="currentItem"
              :on-success= handleUploadSubmit
              :on-exceed="handleBeforeUpload(7)"
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

<script src="./js/picture.js"/>
<style src="./css/goods.css"/>

