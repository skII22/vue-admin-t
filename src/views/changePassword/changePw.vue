<template>
  <div class="main">
    <el-form ref="form" label-width="80px">
      <el-form-item class="form">
        <el-form-item>
          <i STYLE="padding-right:100px">原密码：</i>
          <el-input v-model="oldPw" type="password" class="input" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item>
          <i STYLE="padding-right:100px">新密码：</i>
          <el-input v-model="newPw" type="password" style="width: 200px"></el-input>
        </el-form-item>
        <div class="message" v-if="passwordMatch === false" style="color: red">两次密码不一致,请重新查看后输入</div>
        <el-form-item  >
          <i STYLE="padding-right:85px">确认密码：</i>
          <el-input v-model="confirmPw" type="password" style="width: 200px"></el-input>
        </el-form-item>
      </el-form-item>
    </el-form>
    <el-button type="primary" :disabled="passwordMatch === false" @click="submit(oldPw,newPw)" style="margin-left: 140px">提交</el-button>
  </div>
</template>

<script src="./changePassword.js">
export default {
  name: 'changePw'
}
</script>
<style scoped="scoped">
.main{
  padding-right: 200px;
text-align: center;
  margin-top: 300px;
}

</style>


