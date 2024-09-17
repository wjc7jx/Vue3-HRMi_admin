<template>
  <!-- 放置一个弹层 用来编辑新增节点 -->
  <el-dialog :title="`${showText}权限点`" v-model="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="formData.description" style="width:90%" />
      </el-form-item>
      <el-form-item label="开启">
        <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { addPermission, getPermissionDetail, updatePermission } from '@/api/permission'

// 定义表单数据
const formData = ref({
  name: '', // 名称
  code: '', // 标识
  description: '', // 描述
  type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
  pid: '', // 因为做的是树 需要知道添加到哪个节点下了
  enVisible: "0", // 默认关闭
})

// 接收父组件传入的属性
const props = defineProps({
  pid: { type: Number }, // 父级id
  type: { type: Number },
  id: { type: Number }
})
const emit=defineEmits(["success"])
// 监听pid属性的变化
watch(() => props.pid, async (newValue) => {
  formData.value.pid = newValue
})

// 监听type属性的变化
watch(() => props.type, async (newValue) => {
  formData.value.type = newValue
})

// 监听id属性的变化，并获取对应的详情
watch(() => props.id, async (newValue) => {
  formData.value.id = newValue
  const detail = await getPermissionDetail(props.id);
  formData.value = { ...formData.value, ...detail };
}, { immediate: true })

// 定义表单验证规则
const rules = ref({
  name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
})

// 引用表单对象，用于表单校验和重置
const formRef = ref(null)

// 控制弹窗的显示与隐藏
const showDialog = defineModel()

// 计算显示的文本，根据id判断是新增还是编辑
const showText = computed(() => {
  return formData.value.id ? '编辑' : '新增'
})


// 确定按钮事件处理
const btnOK = async () => {
  await formRef.value.validate() // 校验表单
  console.log(formData.value);
  if (formData.value.id) {
    await updatePermission(formData.value) // 更新权限
  } else {
    await addPermission(formData.value) // 添加权限
  }
  emit("success")
  btnCancel()
}

// 取消按钮事件处理
const btnCancel = () => {
  formRef.value.resetFields(); // 重置表单
  formData.value = {
    name: '', // 名称
    code: '', // 标识
    description: '', // 描述
    type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
    pid: '', // 因为做的是树 需要知道添加到哪个节点下了
    enVisible: "0", // 默认关闭
  };
  showDialog.value = false; // 关闭弹窗
}

</script>

<style lang="scss" scoped></style>