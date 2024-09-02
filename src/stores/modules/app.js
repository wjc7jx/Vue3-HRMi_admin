import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块
export const useAppStore = defineStore(
  'user',
  () => {
    // 控制侧边栏的状态
    const sidebar = ref({
      opened: true,
      withoutAnimation: false
    });
    
    // 设备类型
    const device = ref('desktop');

    /**
     * 切换侧边栏的打开/关闭状态
     */
    const toggleSideBar = () => {
      sidebar.value.opened = !sidebar.value.opened;
      sidebar.value.withoutAnimation = false;
    };

    /**
     * 关闭侧边栏
     * @param {boolean} withoutAnimation - 是否需要动画
     */
    const closeSideBar = (withoutAnimation) => {
      sidebar.value.opened = false;
      sidebar.value.withoutAnimation = withoutAnimation;
    };

    /**
     * 切换设备类型
     * @param {string} newDevice - 新的设备类型
     */
    const toggleDevice = (newDevice) => {
      device.value = newDevice;
    };

    // 返回侧边栏状态、设备类型和相关方法
    return { sidebar, device, toggleSideBar, closeSideBar, toggleDevice };
  }, { persist: true }
)