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
        <el-button size="small" type="primary">添加员工</el-button>
        <el-button size="small">excel导入</el-button>
        <el-button size="small">excel导出</el-button>
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
      </el-table>
      <!-- 分页 -->
      <el-row type="flex" justify="end" align="middle" style="margin-top: 20px;">
        <el-pagination background layout="prev, pager, next" :total="queryParams.total" :current-page="queryParams.page"
          :page-size="queryParams.pageSize" @current-change="changePage" />
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted, reactive, nextTick, watch, computed } from 'vue'
import { transListToTreeData } from '@/utils'
import { getDepartmentListService } from '@/api/department'
import { getEmployeeList } from '@/api/employee'
import { debounce } from '@/utils'
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