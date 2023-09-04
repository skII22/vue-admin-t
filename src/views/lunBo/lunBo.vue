<template>

    <div align="center" style="margin-top: 200px">
    <span>上传图片</span>
      <div>
        <el-upload
          action="/api/goods/carousel-upload"
          ref="upload"
          :auto-upload="true"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        :file-list="fileList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </div>

</template>
<script src="./js/lunBo.js"/>
<style scoped="scoped" src="./css/lunBo.css"/>

