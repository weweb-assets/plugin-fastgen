import qs from 'qs';
/* wwEditor:start */
import './components/Collection/CollectionEdit.vue';
import './components/Collection/CollectionSummary.vue';
/* wwEditor:end */

export default {
    websiteId: null,
    project: null,
    routes: [],
    async onLoad(settings) {
        this.websiteId = wwLib.wwWebsiteData.getInfo()?.id || '9a0f5351-fc24-4915-af0c-5ccec49e2157'; // TODO to remove
        /* wwEditor:start */
        if (settings.privateData.integrationToken) {
            this.fetchProject();
            this.fetchRoutes();
        }
        /* wwEditor:end */
    },
    async fetchProject() {
        const response = await wwAxios.get(
            `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${this.websiteId}/fastgen/project`
        );

        this.project = response.data.data;

        console.log('🔥 Project: ', this.project);
    },
    async fetchRoutes() {
        const response = await wwAxios.get(
            `${wwLib.wwApiRequests._getPluginsUrl()}/designs/${this.websiteId}/fastgen/project/routes`
        );

        this.routes = response.data.data;

        console.log('🔥 Routes: ', this.routes);
    },
    /*=============================================m_ÔÔ_m=============================================\
        Collection API
    \================================================================================================*/
    async fetchCollection(collection) {
        console.log('🤖 Collection: ', collection);

        try {
            const { path, headers, body } = collection.config;

            const route = this.routes.find(route => route.Path === path);
            const url = 'https://' + this.project.Subdomain + path;
            const method = route.Method;

            const responseData = await this._apiRequest(url, method, body, headers);

            return { data: responseData, error: null };
        } catch (err) {
            return {
                error: Object.getOwnPropertyNames(err).reduce((obj, key) => ({ ...obj, [key]: err[key] }), {}),
            };
        }
    },

    async apiRequest({ url, method, body, headers }, wwUtils) {
        /* wwEditor:start */
        const payload = computePayload(method, body, headers);
        if (wwUtils) {
            wwUtils.log('info', `Executing request ${method} on ${url}`, {
                type: 'request',
                preview: {
                    Data: payload.data,
                    Headers: payload.headers,
                },
            });
        }

        /* wwEditor:end */
        return await this._apiRequest(url, method, body, headers);
    },

    async _apiRequest(url, method, body, headers) {
        const payload = computePayload(method, body, headers);

        console.log('🔥 _apiRequest: ', url, method, payload);

        const response = await axios({
            url,
            method,
            data: payload.data,
            headers: payload.headers,
        });

        console.log('🔥 Response: ', response.data);

        return response.data;
    },

    /* wwEditor:start */
    getCollectionErrorDetails(collection) {
        return (
            collection.error &&
            collection.error.message &&
            collection.error.message === 'Network Error' &&
            '⚠️ There is a network error. That can happen when the server you are trying to call is down, or it is not found, or there is a CORS issue because the server expects a call from another server and not a frontend like WeWeb.'
        );
    },
    /* wwEditor:end */
};

function computePayload(method, data, headers, dataType, useRawBody) {
    if (!useRawBody) {
        data = computeList(data);

        switch (dataType) {
            case 'application/x-www-form-urlencoded': {
                data = qs.stringify(data);
                break;
            }
            case 'multipart/form-data': {
                const formData = new FormData();
                for (const key in data) formData.append(key, data[key]);
                data = formData;
                break;
            }
            default:
                break;
        }
    }

    switch (method) {
        case 'GET':
        case 'DELETE':
            data = undefined;
            break;
        default:
            break;
    }

    return {
        data,
        headers: {
            'content-type': dataType || 'application/json',
            ...computeList(headers),
        },
    };
}

function computeList(list) {
    return (list || []).reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {});
}
