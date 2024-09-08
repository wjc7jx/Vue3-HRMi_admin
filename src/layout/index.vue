<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="auto">
                <!-- 通过设置auto清除默认样式，使得宽度为Aside组件的宽度 -->
                <Aside />
            </el-aside>
            <el-container>
                <el-header>
                    <Header />
                </el-header>
                <el-main>
                    <el-card width="100%">
                        <RouterView />
                    </el-card>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
// 引入侧边栏和头部组件
import Aside from './components/Aside.vue'
import Header from './components/Header.vue'
import { useUserStore } from '@/stores'
const userStore = useUserStore()
</script>

<style lang="scss" scoped>
.common-layout {
    height: 100%;
}

.el-header {
    background-color: #fff;
    border-bottom: 1px solid #ccc;
}

.el-main {
    background-color: #fff;
    min-height: calc(100vh - 120px);
    overflow: hidden;
}
</style>