<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { addDepartmentService, getDepartmentListService, getEmployeeService, getDepartmentDetailService, updateDepartmentService } from '@/api/department';

// 控制对话框的显示状态
const dialogVisible = ref(false);
// 引用el-dialog组件，以便于操作对话框
const dialogRef = ref(null);
// 引用el-form组件，用于表单操作
const formRef = ref(null);
// 默认表单数据
const defaultForm = {
    name: '',
    code: '',
    managerId: '',
    introduce: '',
    pid: ''
};
// 表单数据，初始时复制默认表单数据
const form = ref(JSON.parse(JSON.stringify(defaultForm)));
// 员工列表，用于选择负责人
const employeeList = ref([]);
// 部门列表，用于验证部门名称和编码是否已存在
const departmentList = ref([]);

// 获取员工数据，用于填充负责人选择框
async function getEmployee() {
    employeeList.value = await getEmployeeService();
}

// 获取部门列表数据，用于验证部门名称和编码
async function getDepartmentList() {
    departmentList.value = await getDepartmentListService();
}

// 在组件挂载后获取负责人列表和部门列表数据
onMounted(async () => {
    await getEmployee();
    await getDepartmentList();
});

// 表单验证规则
const rules = {
    name: [
        { required: true, message: '部门名称不能为空', trigger: 'blur' },
        { min: 1, max: 50, message: '部门名称长度在 1 到 50 个字符', trigger: 'blur' },
        { validator: validateName, trigger: 'change' }
    ],
    code: [
        { required: true, message: '部门编码不能为空', trigger: 'blur' },
        { min: 1, max: 50, message: '部门编码长度在 1 到 50 个字符', trigger: 'blur' },
        { validator: validateCode, trigger: 'change' }
    ],
    managerId: [
        { required: true, message: '部门负责人不能为空', trigger: 'blur' }
    ],
    introduce: [
        { required: true, message: '部门介绍不能为空', trigger: 'blur' },
        { min: 1, max: 300, message: '部门介绍长度在 1 到 300 个字符', trigger: 'blur' }
    ]
};

// 验证部门名称是否已存在
async function validateName(rule, value, callback) {
    if (form.value.id) { callback(); } else {
        const isExistName = departmentList.value.find(item => item.name === value);
        if (isExistName) {
            callback(new Error('部门名称已存在'));
        } else {
            callback();
        }
    }
}

// 验证部门编码是否已存在
async function validateCode(rule, value, callback) {
    if (form.value.id) { callback(); } else {
        const isExistCode = departmentList.value.find(item => item.code === value);
        if (isExistCode) {
            callback(new Error('部门编码已存在'));
        } else {
            callback();
        }
    }
}

// 打开对话框，根据命令添加或编辑部门
async function open(id, command) {
    dialogVisible.value = true;
    resetForm();

    if (command === 'add') {
        form.value.pid = id;
    }
    else if (command === 'edit') {
        const res = await getDepartmentDetailService(id);
        form.value = res;
    }
}
// 暴露open方法，以便外部调用
defineExpose({ open });

// 定义emit方法，用于触发自定义事件
const emit = defineEmits(['update:success']);
// 提交表单
async function handleSubmit() {
    // 验证表单数据有效性
    await formRef.value.validate(async (valid) => {
        if (valid) {
            // console.log(form.value);
            if (!form.value.id) {
                await addDepartmentService(form.value);

            } else {
                await updateDepartmentService(form.value)
            }
            emit('update:success');
            handleCancel();
        }
    });
}

// 重置表单数据和表单状态
function resetForm() {
    form.value = JSON.parse(JSON.stringify(defaultForm));
    nextTick(() => {
        if (formRef.value) {
            formRef.value.resetFields();
        }
    });
}

// 取消操作，关闭对话框并重置表单
function handleCancel() {
    resetForm();
    nextTick(() => {
        dialogVisible.value = false;
    });
}


</script>

<template>
    <!-- 对话框，包含表单 -->
    <el-dialog v-model="dialogVisible" ref="dialogRef">
        <el-form ref="formRef" :model="form" :rules="rules" validate-on-rule-change>
            <el-form-item label="部门名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="部门编码" prop="code">
                <el-input v-model="form.code"></el-input>
            </el-form-item>
            <el-form-item label="部门负责人" prop="managerId">
                <el-select v-model="form.managerId" placeholder="请选择">
                    <el-option v-for="item in employeeList" :key="item.id" :label="item.username"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="部门介绍" prop="introduce">
                <el-input v-model="form.introduce" type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
                <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<style scoped>
/* 这里可以添加一些样式 */
</style>