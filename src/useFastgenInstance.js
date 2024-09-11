import { ref } from 'vue';

const PROJECT = ref(null);
const ROUTES = ref([]);

export default () => {
    const websiteId = wwLib.wwWebsiteData.getInfo()?.id;

    async function fetchProject(integrationToken = null) {
        const url = new URL(`${wwLib.wwApiRequests._getPluginsUrl()}/designs/${websiteId}/fastgen/datasource/project`);

        if (integrationToken) {
            url.searchParams.append('integrationToken', integrationToken);
        }

        const response = await wwAxios.get(url.toString());

        PROJECT.value = response.data.data;
    }

    async function fetchRoutes(integrationToken = null) {
        const url = new URL(`${wwLib.wwApiRequests._getPluginsUrl()}/designs/${websiteId}/fastgen/project/routes`);

        if (integrationToken) {
            url.searchParams.append('integrationToken', integrationToken);
        }

        const response = await wwAxios.get(url.toString());

        ROUTES.value = response.data.data;
    }

    return {
        project: PROJECT,
        routes: ROUTES,
        fetchProject,
        fetchRoutes,
    };
};
