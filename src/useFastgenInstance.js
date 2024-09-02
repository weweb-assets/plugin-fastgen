import { ref } from 'vue';

const PROJECT = ref(null);
const ROUTES = ref([]);

export default () => {
    const websiteId = wwLib.wwWebsiteData.getInfo()?.id;

    async function fetchProject() {
        const response = await wwAxios.get(
            `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${websiteId}/fastgen/datasource/project/type/datasource`
        );

        PROJECT.value = response.data.data;
    }

    async function fetchRoutes() {
        const response = await wwAxios.get(
            `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${websiteId}/fastgen/project/routes/type/datasource`
        );

        ROUTES.value = response.data.data;
    }

    return {
        project: PROJECT,
        routes: ROUTES,
        fetchProject,
        fetchRoutes,
    };
};
