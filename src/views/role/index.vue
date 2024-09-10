<template>
  <!-- 新增角色按钮 -->
  <el-button type="primary" @click="handleAddRole">新增角色 </el-button>
  <!-- 角色表格容器 -->
  <div class="role-table-container">
    <!-- 角色表格 -->
    <el-table :data="tableData" style="width: 100%">
      <!-- 角色名称列 -->
      <el-table-column prop="name" label="角色名称" width="180" align="center" />
      <!-- 启用状态列 -->
      <el-table-column prop="state" label="启用状态" width="180" align="center">
        <template #default="scope">
          <!-- 根据状态显示不同的标签颜色 -->
          <el-tag :type="scope.row.state ? 'success' : 'danger'">{{ scope.row.state ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <!-- 描述列 -->
      <el-table-column prop="description" label="描述" align="center" />
      <!-- 操作列 -->
      <el-table-column fixed="right" label="操作" width="220" align="center">
        <template #default="scope">
          <!-- 分配权限按钮 -->
          <el-button link size="small" @click="handlePermission(scope.row)">分配权限</el-button>
          <!-- 编辑按钮 -->
          <el-button link size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <!-- 删除按钮 -->
          <el-button link size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" justify="end" align="middle" style="margin-top: 20px;">
      <el-pagination background layout="prev, pager, next" :total="PageParams.total" :current-page="PageParams.page"
        :page-size="PageParams.pagesize" @current-change="changePage" />
    </el-row>
  </div>
  <!-- 新增角色对话框 -->
  <el-dialog title="新增角色" v-model="dialogVisible" width="40%">
    <el-form :model="formData" :rules="rules" ref="formRef">
      <!-- 角色名称输入 -->
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <!-- 启用状态开关 -->
      <el-form-item label="启用">
        <el-switch v-model="formData.state" />
      </el-form-item>
      <!-- 角色描述输入 -->
      <el-form-item label="角色描述" prop="description">
        <el-input v-model="formData.description" />
      </el-form-item>
      <!-- 按钮区域 -->
      <el-form-item>
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getRoleList, addRole } from '@/api/role'
// 表格数据
const tableData = ref([])
// 分页参数
const PageParams = reactive({
  page: 1,
  total: 0,
  pagesize: 10
})

// 页面加载时获取表格数据
onMounted(() => {
  getTableData()
})

// 获取表格数据函数
const getTableData = async () => {
  const res = await getRoleList(PageParams)
  tableData.value = res.rows
  PageParams.total = res.total
}

// 分页变化时获取数据
const changePage = async (newPage) => {
  PageParams.page = newPage
  await getTableData()
}

// 操作方法
const handlePermission = (row) => {
  console.log('分配权限', row)
  // 这里可以添加分配权限的逻辑
}

const handleEdit = (row) => {
  console.log('编辑', row)
  // 这里可以添加编辑角色的逻辑
}

const handleDelete = (row) => {
  // 这里可以添加删除角色的逻辑
}

// 新增角色表单数据
const formData = reactive({
  name: '',
  state: true,
  description: ''
})
const formRef = ref(null)
// 表单验证规则
const rules = reactive({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入角色描述', trigger: 'blur' }
  ]
})
// 控制对话框显示隐藏
const dialogVisible = ref(false)

// 打开新增角色对话框
const handleAddRole = () => {
  dialogVisible.value = true
  // 重置表单数据
  formRef.value?.resetFields()
}

// 提交新增表单
const submitForm = async () => {
  await formRef.value.validate()
  await addRole(formData)
  cancelForm()
  await getTableData()
}
// 取消表单操作
const cancelForm = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
}

// // 编辑角色表单数据
// const editFormData = reactive({
  
// })
</script>

<style lang="scss" scoped>
.role-table-container {
  padding: 20px;
}
</style>