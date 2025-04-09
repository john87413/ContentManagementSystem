import { defineStore } from "pinia";
import { ref } from "vue";

export const useSidebarStore = defineStore("sidebar", () => {
    const isCollapsed = ref(window.innerWidth < 768);
    
    function toggleSidebar() {
        isCollapsed.value = !isCollapsed.value;
    }
    
    function setCollapsed(value) {
        isCollapsed.value = value;
    }

    return {
        isCollapsed,
        toggleSidebar,
        setCollapsed
    };
});