<template>
  <!-- 新增角色按钮 -->
  <el-button type="primary" @click="handleAddRole">新增角色 </el-button>
  <!-- 角色表格容器 -->
  <div class="role-table-container">
    <!-- 角色表格 -->
    <el-table :data="tableData" style="width: 100%">
      <!-- 角色名称列 -->
      <el-table-column prop="name" label="角色名称" width="180" align="center">
        <template #default="{ row }">
          <el-input v-if="row.isEdit" v-model="row.editRow.name" size="small" />
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!-- 启用状态列 -->
      <el-table-column prop="state" label="启用状态" width="180" align="center">
        <template #default="{ row }">
          <!-- 根据状态显示不同的标签颜色 -->
          <el-switch v-if="row.isEdit" v-model="row.editRow.state" size="small" :active-value="1"
            :inactive-value="0"></el-switch>
          <el-tag v-else :type="row.state ? 'success' : 'danger'">{{ row.state ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <!-- 描述列 -->
      <el-table-column prop="description" label="描述" align="center">
        <template #default="{ row }">
          <el-input v-if="row.isEdit" v-model="row.editRow.description" size="small" />
          <span v-else>{{ row.description }}</span>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column fixed="right" label="操作" width="220" align="center">
        <template #default="{ row }">
          <div v-if="row.isEdit">
            <el-button size="small" @click="saveEdit(row)">保存</el-button>
            <el-button size="small" @click="cancelEdit(row)">取消</el-button>
          </div>
          <div v-else><el-button link size="small" @click="handlePermission(row)">分配权限</el-button>
            <el-button link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link size="small" @click="handleDelete(row)">删除</el-button>
          </div>
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
  <!-- 分配权限对话框 -->
   <el-dialog title="分配权限" v-model="showPermissionDialog" width="40%">
    <el-tree ref="treeRef" :data="permissionList" show-checkbox node-key="id" default-expand-all :props="defaultProps" :default-checked-keys="permIds" />
    <template #footer>
      <el-button @click="btnCancelPermission">取消</el-button>
      <el-button type="primary" @click="btnOKPermission">确定</el-button>
    </template>
   </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getRoleList, addRole, updateRole, delRole, getRoleDetail,assignPermission } from '@/api/role'
import {getPermissionList} from '@/api/permission'
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


const handleEdit = (row) => {
  startEdit(row)
  // console.log('编辑', row)
  // 这里可以添加编辑角色的逻辑
}

const handleDelete = async(row) => {
  // 删除角色
  if(tableData.value.length === 1 && PageParams.page > 1) {
    PageParams.page--
  }
  await delRole(row.id)
  await getTableData()
}

// 新增角色表单数据
const formData = reactive({
  name: '',
  state: 1,
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

// 编辑相关方法
// 开始编辑
function startEdit(row) {
  const item = tableData.value.find(item => item.id === row.id);
  if (item) {
    item.isEdit = true;
    item.editRow = {
      id: row.id,
      name: row.name,
      state: row.state,
      description: row.description
    };
  }
}

// 保存编辑
async function saveEdit(row) {
  // console.log(object);
  await updateRole(row.editRow);
  const item = tableData.value.find(item => item.id === row.id);
  if (item) {
    item.isEdit = false;
    item.name = item.editRow.name;
    item.state = item.editRow.state;
    item.description = item.editRow.description;
  }
}

// 取消编辑
function cancelEdit(row) {
  const item = tableData.value.find(item => item.id === row.id);
  if (item) {
    item.isEdit = false;
    item.editRow = {}
  }
}

// 分配权限
const showPermissionDialog = ref(false)
const currentRoleId= ref(null)
const permIds = ref([])
const permissionList = ref([])
const defaultProps = {
  children: 'children',
  label: 'name'
}
const treeRef = ref(null)
const handlePermission = async(row) => {
  currentRoleId.value = row.id
  permIds.value = await getRoleDetail(row.id).then(res => res.permIds)
  permissionList.value = await getPermissionList()
  showPermissionDialog.value = true
}
const btnOKPermission = async() => {
  await assignPermission({
    id: currentRoleId.value,
    permIds: treeRef.value.getCheckedKeys()
  })
  console.log(permIds.value);
  btnCancelPermission()
}
const btnCancelPermission = () => {
  showPermissionDialog.value = false
}

</script>

<style lang="scss" scoped>
.role-table-container {
  padding: 20px;
}
</style>