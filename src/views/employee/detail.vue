<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="formRef" :model="userInfo" :rules="rules" label-width="220px">
          <!-- 姓名 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userInfo.username" size="small" class="inputW" />
              </el-form-item>
            </el-col>

          </el-row>
          <!-- 工号 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="workNumber">
                <!-- 工号是系统生成的  禁用这个组件-->
                <el-input v-model="userInfo.workNumber" disabled size="small" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--手机  -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="userInfo.mobile" size="small" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 部门 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">

                <el-cascader v-model="userInfo.departmentId" :options="treeData" :props="props" separator="-" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select v-model="userInfo.formOfEmployment" size="small" class="inputW">
                  <el-option label="正式" :value="1" />
                  <el-option label="非正式" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker v-model="userInfo.timeOfEntry" size="small" type="date" value-format="YYYY-MM-DD"
                  class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker v-model="userInfo.correctionTime" size="small" type="date" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 员工照片 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工头像">
                <!-- 放置上传图片 -->
                <image-upload v-model="userInfo.staffPhoto" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 保存个人信息 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left:220px">
              <el-button size="small" type="primary" @click="submitForm">保存更新</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch,computed  } from 'vue'
import { getDepartmentListService } from '@/api/department'
import { addEmployeeService, getEmployeeDetailService,updateEmployeeService } from '@/api/employee'
import { transListToTreeData } from '@/utils'
import { useRouter,useRoute } from 'vue-router'
import ImageUpload from './components/image-upload.vue'
const router = useRouter()
const route=useRoute()
const userInfo = ref({
  username: '',
  workNumber: '',
  mobile: '',
  departmentId: '',
  formOfEmployment: '',
  timeOfEntry: '',
  correctionTime: '',
  staffPhoto: ''
})
const rules = ref({
  username: [{ required: true, message: '请输入姓名', trigger: 'blur' }, {
    min: 1, max: 4, message: '姓名为1-4位'
  }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, {
    //   pattern 正则表达式
    pattern: /^1[3-9]\d{9}$/,
    message: '手机号格式不正确',
    trigger: 'blur'
  }],
  formOfEmployment: [{ required: true, message: '请选择聘用形式', trigger: 'blur' }],
  departmentId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
  timeOfEntry: [{ required: true, message: '请选择入职时间', trigger: 'blur' }],
  correctionTime: [{ required: true, message: '请选择转正时间', trigger: 'blur' }, {
    validator: (rule, value, callback) => {
      if (userInfo.value.timeOfEntry) {
        console.log(userInfo.value.timeOfEntry);
        if (new Date(value) < new Date(userInfo.value.timeOfEntry)) {
          return callback(new Error('转正时间不能早于入职时间'))
        }
      }
      callback()
    }
  }]
})
// 部门树形数据
const props = {
  value: 'id',
  label: 'name'
}
const treeData = ref([])
const formRef = ref(null)
const getDepartmentList = async () => {
  const res = await getDepartmentListService()
  treeData.value = transListToTreeData(res)
  
}
const getEmployeeDetail = async () => {
  const res = await getEmployeeDetailService(route.params.id)
  userInfo.value = res
}

onMounted(async () => {
  await getDepartmentList()
  if (route.params.id) {
    await getEmployeeDetail()
    console.log(userInfo.value);
  }

})

// 头像上传成功处理函数
const handleAvatarSuccess = (response, file) => {
  // state.userForm.staffPhoto = URL.createObjectURL(file.raw)
}

// 头像上传前处理函数
const beforeAvatarUpload = (file) => {
  // const isJPG = file.type === 'image/jpeg'
  // const isLt2M = file.size / 1024 / 1024 < 2

  // if (!isJPG) {
  //   ElMessage.error('上传头像图片只能是 JPG 格式!')
  // }
  // if (!isLt2M) {
  //   ElMessage.error('上传头像图片大小不能超过 2MB!')
  // }
  // return isJPG && isLt2M
}

watch(() => userInfo.value.departmentId, (newVal, oldVal) => {
  // 检查newVal是否为数组并且至少有一个元素
  if (Array.isArray(newVal) && newVal.length > 0) {
    // 获取数组的最后一个元素
    const lastDepartmentId = newVal[newVal.length - 1];
    userInfo.value.departmentId = lastDepartmentId
  }
}, {
  deep: true // 因为departmentId是一个数组，所以需要深度监听
})

// 表单提交函数
const submitForm = async () => {
  await formRef.value.validate()
  if (!userInfo.value.id) {
    await addEmployeeService(userInfo.value)
    formRef.value.resetFields()
  }else{
    await updateEmployeeService(userInfo.value)
  }
  // 提交成功后，返回员工列表页面
  router.push('/employee')
}
</script>



<style scoped lang="scss">
.edit-form {
  background: #fff;
  padding: 20px;

  .inputW {
    width: 380px
  }
}
</style>