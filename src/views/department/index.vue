<template>
  <el-tree style="max-width: 600px" :data="data" :props="defaultProps" :default-expand-all="true">
    <template #default="{ node, data }">
      <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
        <el-col :span="6">
          {{ data.name }}
        </el-col>
        <el-col :span="6">
          <el-dropdown>
            <span class="">
              <span class="tree-manager">{{ data.managerName }}</span>
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            </span>
            <template #dropdown>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>添加子部门</el-dropdown-item>
                <el-dropdown-item>编辑部门</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

        </el-col>
      </el-row>
    </template>
  </el-tree>

</template>

<script setup>
import { getDepartmentListService } from '@/api/department'
import { transListToTreeData } from '@/utils'
import { ref, onMounted } from 'vue'
const data = ref([])
const defaultProps = {
  children: 'children',
  label: 'name',
}
onMounted(async () => {
  const res= await getDepartmentListService()
  data.value= transListToTreeData(res) 
})
</script>

<style lang="scss" scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}

.tree-manager {
  width: 50px;
  display: inline-block;
  margin-right:27px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  display: inline-block;
  margin-right: 10px;
}
</style>