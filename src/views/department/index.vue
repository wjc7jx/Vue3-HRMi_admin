<template>
  <el-tree style="max-width: 600px" :data="data" :props="defaultProps" :default-expand-all="true"
    :expand-on-click-node="false">
    <template #default="{ node, data }">
      <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
        <el-col :span="6">
          {{ data.name }}
        </el-col>
        <el-col :span="6">
          <span class="tree-manager">{{ data.managerName }}</span>
          <el-dropdown @command="handleCommand($event, data.id)">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <template #dropdown>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>
    </template>
  </el-tree>
  <DepartmentDia ref="dialogRef" @update:success="getDepartmentList()"></DepartmentDia>
</template>

<script setup>
import { getDepartmentListService,deleteDepartmentService  } from '@/api/department'
import { transListToTreeData } from '@/utils'
import { ref, onMounted } from 'vue'
import DepartmentDia from './components/DepartmentDia.vue';
// import { ElMessage, ElMessageBox } from 'element-plus'
const data = ref([])
const defaultProps = {
  children: 'children',
  label: 'name',
}
const getDepartmentList = async () => {
  const res = await getDepartmentListService()
  data.value = transListToTreeData(res)
}
onMounted(async () => {
  await getDepartmentList()
})
// 
const dialogRef = ref()
const handleCommand = async (command, id) => {
  // 现在你可以使用 id 来访问当前行的数据
  switch (command) {
    case 'add':
      dialogRef.value.open(id, command)
      break;
    case 'edit':
      dialogRef.value.open(id, command)
      break;
    case 'delete':
      // 弹出删除确认框
      const res = await ElMessageBox.confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      if (res) {
        await deleteDepartmentService(id)
        await getDepartmentList()
      }
  }
}

</script>

<style lang="scss" scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}

.tree-manager {
  width: 50px;
  display: inline-block;
  margin-right: 27px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  display: inline-block;
  margin-right: 10px;
}
</style>