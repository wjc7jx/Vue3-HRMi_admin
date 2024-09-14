<template>
    <!-- 员工导入对话框 -->
    <el-dialog width="500px" title="员工导入" v-model="isVisible" @close="btnClose">
        <!-- 文件上传区域 -->
        <el-upload class="upload-demo" action="#" drag :on-success="handleSuccess" :on-error="handleError"
            :before-upload="beforeUpload" :file-list="fileList" accept=".xlsx, .xls" :http-request="customUpload">
            <!-- 上传图标 -->
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <!-- 下载模板按钮 -->
            <el-button link @click.stop="downloadTemplate">下载导入模板</el-button>
            <!-- 提示文字和上传按钮 -->
            <span>将文件拖到此处或
                <el-button link>点击上传</el-button>
            </span>
        </el-upload>
        <!-- 对话框底部操作按钮 -->
        <el-row type="flex" justify="end">
            <el-button size="small" type="primary" @click="btnClose">取消</el-button>
        </el-row>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { downloadFile } from '@/utils';
import { getExcelTemplate, uploadExcel } from '@/api/employee';
import { UploadFilled } from '@element-plus/icons-vue';

// 文件列表状态
const fileList = ref([]);
// 对话框可见性模型
const isVisible = defineModel()

// 下载模板函数
const downloadTemplate = async () => {
    downloadFile(getExcelTemplate, '员工列表模板.xlsx')
}

// 上传成功处理函数
const handleSuccess = () => {
    ElMessage.success('导入成功')
    fileList.value = []
    isVisible.value = false
}

// 上传错误处理函数
const handleError = () => {
    ElMessage.error('导入失败')
    fileList.value = []
    isVisible.value = false
}

// 上传前检查函数
const beforeUpload = (file) => {
    const isExcel= file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
    if(!isExcel){
        ElMessage.error('只能上传excel文件')
        return false
    }
}

// 自定义上传函数
const customUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file.file)
    await uploadExcel(formData)
    handleSuccess()
}
// 关闭对话框函数
const btnClose = () => {
    isVisible.value = false
}
</script>