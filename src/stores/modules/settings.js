import { defineStore } from 'pinia';  
import defaultSettings from '@/settings';  
import{ref} from 'vue'
  
export const useSettingsStore = defineStore(  
  'settings',  
  () => {  
    const { showSettings, fixedHeader, sidebarLogo } = defaultSettings
    const state = ref({  
      showSettings:showSettings,  
      fixedHeader:fixedHeader,  
      sidebarLogo:sidebarLogo  
    })
  
    const changeSetting = (key, value) => {  
      if (state.hasOwnProperty(key)) {  
        state[key] = value;  
      }  
    } 
      return { state, changeSetting };  
  },  
  {  
    // 如果需要持久化，可以在这里配置  
    // persist: true,  
  }  
);