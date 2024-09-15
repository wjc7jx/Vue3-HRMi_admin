<template>
    <div class="header-container">
        <div class="header-left">
            <!-- 菜单折叠按钮 -->
            <el-icon class="icon-menu" size="25" @click="handleMenu">
                <Fold />
            </el-icon>
            <!-- 标签页 -->
            <ul class="tags">
                <li v-for="tag in menuStore.tagList" :key="tag.path" class="tag"
                    :class="{ 'is-active': tag.path === route.path }" @click="handleClick(tag)">
                    <el-icon>
                        <component :is="tag.meta.icon"></component>
                    </el-icon>
                    <span>{{ tag.meta.title }}</span>
                    <span class="close-icon" @click.stop="closeTab(tag, index)">×</span>
                </li>
            </ul>
        </div>
        <div class="header-right">
            <!-- 下拉框 -->
            <el-dropdown trigger="click">
                <div class="el-dropdown-link">

                    <el-avatar v-if="userStore.userInfo.staffPhoto" class="avatar" :size="40"
                        :src="userStore.userInfo.staffPhoto"></el-avatar>
                    <el-avatar v-else>
                        <div class="avatar-text">{{ getInitials }}</div>
                    </el-avatar>
                    <p class="user-name">{{ userStore.userInfo.username }}</p>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="changePass">修改密码</el-dropdown-item>
                        <el-dropdown-item @click="logout">登出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <change-pass-dialog :dialogVisible="dialogVisible" @update:dialogVisible="dialogVisible=false"></change-pass-dialog>
</template>

<script setup>
import { useMenuStore, useUserStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router';
import { computed, ref } from "vue";
import ChangePassDialog from './ChangePassDialog.vue'
const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const userStore = useUserStore()
const title=computed((tag)=>{
    return tag.meta.title
})
// 菜单折叠
const handleMenu = () => {
    menuStore.setMenuIsCollapse(!menuStore.menuIsCollapse)
}
// 点击tag
const handleClick = (item) => {
    router.push(item.path)
}
// 关闭tag
const closeTab = (tag, index) => {
    const tagIndex = menuStore.tagList.findIndex(item => item.path === tag.path);
    if (tagIndex === -1) return; // 如果找不到标签，则直接返回  
    menuStore.closeTag(tag);
    if (route.path !== tag.path) {
        return;
    }
    if (menuStore.tagList.length === 0) {
        router.push('/dashboard');
    } else {
        if (tagIndex === menuStore.tagList.length - 1) {
            // 如果是最后一个标签，跳转到前一个  
            if (tagIndex > 0) {
                router.push({ path: menuStore.tagList[tagIndex - 1].path });
            } else {
                router.push('/dashboard'); // 如果只有一个标签，也跳转到 dashboard  
            }
        } else {
            // 如果不是最后一个标签，跳转到下一个  
            router.push({ path: menuStore.tagList[tagIndex + 1].path });
        }
    }
};
// 筛选出姓名第一个字
const getInitials = computed(() => {
    return userStore.userInfo.username?.charAt(0);
})
// 登出
const logout = () => {
    userStore.logout()
    router.push('/login')
}
const dialogVisible=ref(false)
// 修改密码
const changePass = () => {
    dialogVisible.value = true
}

</script>

<style lang="scss" scoped>
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    background-color: #fff; // 使用央视常用的白色背景
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // 添加轻微的阴影效果

    .header-left {
        display: flex;
        align-items: center;

        .icon-menu {
            height: 100%;
            width: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;

            &:hover {
                background-color: #e6e6e6;
                color: #c81623;
            }
        }

        .tags {
            margin-left: 10px;
            list-style: none; // 移除默认的列表样式
            padding: 0; // 移除默认的内边距
            display: flex;
            flex-wrap: wrap;

            .tag {
                margin: 0 5px 5px 0;
                padding: 0 10px;
                height: 32px; // 设置 tag 的高度
                line-height: 32px; // 设置行高以垂直居中文字
                display: flex;
                align-items: center;
                cursor: pointer;
                background-color: #f4f4f5; // 设置背景颜色
                border: 1px solid #dcdfe6; // 设置边框
                border-radius: 4px; // 设置圆角

                .el-icon {
                    margin-right: 5px;
                    font-size: 16px;
                }

                span {
                    font-size: 14px;
                }

                .close-icon {
                    margin-left: 5px;
                    cursor: pointer;
                }

                &:hover {
                    opacity: 0.8;
                }

                &.is-active {
                    background-color: #409eff;
                    color: #fff;
                    border-color: #409eff;
                }
            }

        }
    }

    .header-right {
        .el-dropdown-link {
            display: flex;
            align-items: center;
            padding: 0 20px;
            cursor: pointer;

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

            .user-name {
                color: #333; // 用户名字体颜色
                margin-left:15px ;
            }
        }

        .el-dropdown-menu {
            background-color: #fff; // 下拉菜单背景颜色
            border: 1px solid #dcdfe6; // 下拉菜单边框
        }

        .el-dropdown-item {
            color: #606266; // 下拉菜单项字体颜色

            &:hover {
                background-color: #ecf5ff; // 鼠标悬停时下拉菜单项背景颜色
                color: #409eff; // 鼠标悬停时下拉菜单项字体颜色
            }
        }
    }
}
</style>
