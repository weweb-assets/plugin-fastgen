import { ref, onMounted } from 'vue';

export default () => {
    const websiteId = wwLib.wwWebsiteData.getInfo()?.id;
    const project = ref(null);
    const routes = ref([]);

    async function fetchProject() {
        const response = await wwAxios.get(
            `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${websiteId}/fastgen/datasource/project`
        );

        project.value = response.data.data;
    }

    async function fetchRoutes() {
        const response = await wwAxios.get(
            `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${websiteId}/fastgen/project/routes`
        );

        routes.value = response.data.data;
    }

    onMounted(() => {
        fetchProject();
        fetchRoutes();
    });

    return {
        project,
        routes,
        fetchProject,
        fetchRoutes,
    };
};
