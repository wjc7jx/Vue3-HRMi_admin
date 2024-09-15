<template>
    <div class="avatar-upload">
        <!-- 头像上传区域 -->
        <el-upload class="avatar-uploader" action="" :show-file-list="false" :auto-upload="false"
            :before-upload="beforeAvatarUpload" :on-change="handleFileChange">
            <!-- 如果有预览图，则显示头像预览 -->
            <div v-if="previewUrl" class="avatar-preview">
                <img :src="previewUrl" class="avatar">
                <div class="mask">
                    <el-icon>
                        <Edit />
                    </el-icon>
                </div>
            </div>
            <!-- 如果没有预览图，则显示添加图标 -->
            <el-icon v-else class="plus-icon">
                <Plus />
            </el-icon>
        </el-upload>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Plus, Edit } from '@element-plus/icons-vue';


// 用于存储头像预览的URL
const previewUrl = defineModel()

// 选中的文件
const selectedFile = ref(null);

/**
 * 在文件上传前进行检查
 * @param {File} file - 要上传的文件
 * @returns {boolean} - 如果文件符合要求则返回true，否则返回false
 */
const beforeAvatarUpload = (file) => {
    const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type);
    const isLt2M = file.size / 1024 / 1024 < 5; // 5M
    if (!isJPG) {
        ElMessage.error('上传头像图片只能是 JPG PNG GIF BMP 格式!');
    }
    if (!isLt2M) {
        ElMessage.error('上传头像图片大小不能超过 5MB!');
    }
    return isJPG && isLt2M;
};

/**
 * 文件更改时的处理函数
 * @param {File} file - 选定的文件
 * @param {Array} fileList - 文件列表
 */
const handleFileChange = (file, fileList) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        previewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file.raw);

}
</script>


<style scoped>
.avatar-upload {
    position: relative;
    width: 100px;
    height: 100px;
}

.avatar-uploader {
    width: 100%;
    height: 100%;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

.avatar {
    width: 100%;
    height: 100%;
    display: block;
}

.plus-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 100px;
    text-align: center;
}

.avatar-preview {
    position: relative;
}

.mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s;
    color: white;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.avatar-preview:hover .mask {
    opacity: 1;
}
</style>