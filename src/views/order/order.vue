<template>
  <div>
    <el-table :data="orders" style="width: 100%" :border="false" @selection-change="handleSelectionChange" >
      // 表头
      <el-table-column
        prop="orderId"
        label="订单编号"
        width="180"
        align="center"
      />
      <el-table-column
        prop="userName"
        label="用户名字"
        width="180"
        style="background-color: #99a9bf"
        align="center"
      />
      <el-table-column
        prop="product_name"
        label="商品ID"
        width="180"
        style="background-color: #99a9bf"
        align="center"
      />
      <el-table-column
        prop="productNum"
        label="采购数量"
        width="180"
        style="background-color: #99a9bf"
        align="center"
      />
      <el-table-column
        prop="productPrice"
        label="订单金额"
        width="370"
        style="background-color: #99a9bf"
        align="center"
      />
      <el-table-column
        prop="orderTime"
        label="下单时间"
        width="620"
        style="background-color: #99a9bf"
        align="center"
      />
    </el-table>
  </div>
</template>
<script src="./js/order.js"/>

<style scoped>

</style>
