<template>
    <el-dialog v-model="isVisible" title="修改密码" width="500" >
        <!-- 表单 -->
        <el-form label-width="80px" :model="form" :rules="rules" ref="formRef">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input v-model="form.oldPassword" placeholder="请输入密码" show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="form.newPassword" placeholder="请输入密码" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="form.confirmPassword" placeholder="请输入密码" show-password></el-input>
                </el-form-item>
            </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="btnCancel">取消</el-button>
                <el-button type="primary" @click="btnOK">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { nextTick, ref,watch } from 'vue'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus';
import { updatePasswordService } from '@/api/user'
const userStore = useUserStore()
const isVisible=ref(false)
const props=defineProps({
    dialogVisible:{
        type:Boolean
    }
})
// 定义watch监控dialogVisible
watch(() => props.dialogVisible, (newValue) => {
    isVisible.value=newValue
})
const emit=defineEmits(['update:dialogVisible'])
const form=ref({
    oldPassword:'',
    newPassword:'',
    confirmPassword:''
})
const formRef=ref()
// 校验
const rules={
    oldPassword:[
        { required: true, message: '请输入旧密码', trigger: 'blur' },
        { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
    ],
    newPassword:[
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
    ],
    confirmPassword:[
        { required: true, message: '请输入确认密码', trigger: 'blur' },
        { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
        { validator: (rule, value, callback) => {
            if (value !== form.value.newPassword) {
                return new Error('两次密码不一致')
            }
        }}
    ]
}
const btnOK=async()=>{
    await formRef.value.validate()
    await updatePasswordService(form.value)
    ElMessage.success('修改密码成功')
    emit('update:dialogVisible');
}
const btnCancel=()=>{
    emit('update:dialogVisible');

}
</script>
<style lang="scss" scoped>

</style>