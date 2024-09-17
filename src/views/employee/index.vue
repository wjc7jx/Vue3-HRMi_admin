<template>
  <el-container style="height: 83vh">
    <el-aside width="220px" style="border-right: 2px solid #eee;">
      <el-input v-model="queryParams.keyword" style="width: 200px;margin-bottom: 10px;" placeholder="输入员工姓名全员搜索"
        :prefix-icon="Search" @input="searchValue" />
      <el-tree style="max-width: 600px" :data="data" :props="defaultProps" :default-expand-all="true"
        :expand-on-click-node="false" node-key="id" ref="treeRef" highlight-current @current-change="selectNode" />
    </el-aside>
    <el-main>
      <el-row type="flex" justify="end">
        <el-button size="small" @click="router.push('/employee/detail')">添加员工</el-button>
        <el-button size="small" @click="btnImport()">excel导入</el-button>
        <el-button size="small" @click="exportExcel()">excel导出</el-button>
      </el-row>
      <el-table :data="formTable">
        <el-table-column prop="staffPhoto" align="center" label="头像">
          <template #default="{ row }">
            <el-avatar v-if="row.staffPhoto" class="avatar" :size="40" :src="row.staffPhoto"></el-avatar>
            <el-avatar v-else>
              <div class="avatar-text">{{ getInitials(row.username) }}</div>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="姓名" align="center" />
        <el-table-column prop="mobile" label="手机号" sortable align="center" />
        <el-table-column prop="workNumber" label="工号" sortable align="center" />
        <el-table-column prop="formOfEmployment" label="聘用形式" align="center">
          <template #default="{ row }">
            {{ row.formOfEmployment === 1 ? '正式' : '非正式' }}
          </template>
        </el-table-column>
        <el-table-column prop="departmentName" label="部门" align="center" />
        <el-table-column prop="timeOfEntry" label="入职时间" sortable align="center" />
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button size="small" link @click="router.push(`/employee/detail/${row.id}`)">编辑</el-button>
            <el-button size="small" link @click="editRole(row.id)">角色</el-button>

            <el-button size="small" link @click="delEmployee(row.id)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" justify="end" align="middle" style="margin-top: 20px;">
        <el-pagination background layout="prev, pager, next" :total="queryParams.total" :current-page="queryParams.page"
          :page-size="queryParams.pageSize" @current-change="changePage" />
      </el-row>
    </el-main>
  </el-container>
  <!-- 导入excel -->
  <importExcel v-model="showExcelDialog"></importExcel>
  <!-- 员工-角色-分配 -->
  <el-dialog v-model="showRoleDialog" title="分配角色">
      <el-checkbox-group v-model="roleIds">
        <!-- 放置n个的checkbox  要执行checkbox的存储值 item.id-->
        <el-checkbox
          v-for="item in roleList"
          :key="item.id"
          :label="item.id"
        >{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button type="primary" @click="btnOK()">确定</el-button>
        <el-button @click="btnCancel()">取消</el-button>
      </template>
</el-dialog>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted, reactive, nextTick, watch, computed } from 'vue'
import { transListToTreeData } from '@/utils'
import { getDepartmentListService } from '@/api/department'
import { getEmployeeList, exportEmployee, delEmployeeService, getEnableRoleList,assignRole,getEmployeeDetailService } from '@/api/employee'
import { debounce, downloadFile } from '@/utils'
import importExcel from './components/import-excel.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
// 树形结构
const data = ref([])
const defaultProps = {
  children: 'children',
  label: 'name',
}
const treeRef = ref()
const queryParams = reactive({
  departmentId: null,
  currentPage: 1,
  pageSize: 10,
  keyword: '',
  total: 0
})
// 获取部门tree列表
const getDepartmentList = async () => {
  const res = await getDepartmentListService()
  data.value = transListToTreeData(res)
  queryParams.departmentId = data.value[0].id
  treeRef.value.setCurrentKey(data.value[0].id)
}


const selectNode = (node) => {
  queryParams.departmentId = node.id
}

// 表格
const formTable = ref([])
const isLoading = ref(false);
// 获取员工表格数据
const getTableData = async () => {
  isLoading.value = true;
  try {
    const { rows, total } = await getEmployeeList(queryParams);
    formTable.value = rows;
    queryParams.total = total
  } catch (error) {
    console.error('Failed to fetch employee data:', error);
    // 可以在这里添加错误处理逻辑，比如显示错误消息  
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  // 并行调用两个异步函数  
  await Promise.all([getTableData(), getDepartmentList()]);

})

// 监听部门id的变化
watch(() => queryParams.departmentId, (newId) => {
  getTableData()
})

// 筛选出姓名第一个字
const getInitials = (username) => {
  if (!username) return ''; // 如果没有名字，则返回空字符串  
  return username.charAt(0).toUpperCase(); // 返回名字的首字母并转为大写  
}

// 分页变化时获取数据
const changePage = async (newPage) => {
  queryParams.page = newPage
  await getTableData()
}

// 搜索
const debouncedGetData = debounce(getTableData, 500); // 创建一个防抖版本的 getTableData  

const searchValue = (value) => {
  queryParams.keyword = value;
  // 调用防抖函数  
  debouncedGetData();
}

// 导出excel
const exportExcel = async () => {
  console.log('点击');
  downloadFile(exportEmployee, '员工列表.xlsx')
}

const showExcelDialog = ref(false)
// 导入excel
const btnImport = async () => {
  showExcelDialog.value = true
}
// 删除员工
const delEmployee = async (id) => {
  const res = await ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await delEmployeeService(id)
    if (formTable.value.length === 1 && queryParams.page > 1) queryParams.page--
    await getTableData()
  })
}

// 角色管理弹层
const roleList = ref([])
const showRoleDialog = ref(false)
const roleIds = ref([])
const currentID= ref(null)
const editRole= async (id) => {
  roleList.value = await getEnableRoleList()
  roleIds.value = await getEmployeeDetailService(id).then(res => res.roleIds)
  showRoleDialog.value = true
  currentID.value = id
}
const btnOK = async () => {
  const res = await assignRole({
    id: currentID.value,
    roleIds:roleIds.value
  })
  btnCancel()
}
const btnCancel = () => {
  showRoleDialog.value = false
}
</script>

<style lang="scss" scoped>
.avatar {
  margin-right: 10px; // 头像右侧外边距
}

.avatar-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #409EFF;
  /* 你想要的背景颜色 */
  color: white;
  /* 你想要的文字颜色 */
  font-size: 1rem;
  /* 你想要的字体大小 */
}
</style>