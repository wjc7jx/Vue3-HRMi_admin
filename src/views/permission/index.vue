<template>
  <!-- 页面加载时显示行尾按钮以添加权限 -->
  <el-row type="flex" justify="end">
    <el-button size="small" @click="addPermission(0, 1)" >添加权限</el-button>    
  </el-row>
  <!-- 以树状形式展示权限列表 -->
  <el-table :data="list" row-key="id">
    <!-- 显示权限名称 -->
    <el-table-column prop="name" label="名称" align="center" />
    <!-- 显示权限标识，并允许排序 -->
    <el-table-column prop="code" label="标识" sortable align="center" />
    <!-- 显示权限描述，并允许排序 -->
    <el-table-column prop="description" label="描述" sortable align="center" />
    <!-- 操作列，允许对权限进行添加、编辑和删除操作 -->
    <el-table-column  label="操作" align="center">
      <template #default="{ row }">
        <el-button size="small" link @click="addPermission(row.id, 2)">添加</el-button>
        <el-button size="small" link @click="editPermission(row.id)">编辑</el-button>
        <el-button size="small" link @click="">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 添加或编辑权限的对话框 -->
  <PermissionDialog v-model="showDialog" :pid="PID" :type="TYPE" :id="ID" @success="success"></PermissionDialog>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import {transListToTreeData}from "@/utils";
import { getPermissionList } from "@/api/permission";
import PermissionDialog from "./PermissionDialog.vue";

// 控制权限对话框的显示与隐藏
const showDialog = ref(false);
// 保存权限列表的树形数据
const list = ref();
// 在页面加载时获取权限列表数据
onMounted(async() => {
  list.value = transListToTreeData(await getPermissionList(), 0)
});


// 保存选中的权限ID
const PID = ref();
// 保存操作类型（如添加、编辑）
const TYPE = ref();
// 保存当前行的id
const ID = ref();
// 打开对话框以添加或编辑权限
const addPermission = (pid, type) => {
  PID.value = pid;
  TYPE.value = type;
  showDialog.value = true;
}
const editPermission = (id) => {
  ID.value = id;
  showDialog.value = true;
}
// 当对话框关闭时更新权限列表数据
const success= async () => {
    list.value = transListToTreeData(await getPermissionList(), 0)
}


</script>

<style lang="scss" scoped>
</style>