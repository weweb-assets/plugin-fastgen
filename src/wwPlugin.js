import qs from 'qs';
/* wwEditor:start */
import './components/Collection/CollectionEdit.vue';
import './components/Collection/CollectionSummary.vue';
/* wwEditor:end */

import useFastgenInstance from './useFastgenInstance';

export default {
    fastgenInstance: null,
    async onLoad(settings) {
        /* wwEditor:start */
        if (settings.privateData.integrationToken) {
            this.fastgenInstance = useFastgenInstance();
            console.log('✅ Fastgen instance created', this.fastgenInstance);
            await this.fastgenInstance.fetchProject();
            await this.fastgenInstance.fetchRoutes();
        }
        /* wwEditor:end */
    },
    /*=============================================m_ÔÔ_m=============================================\
        Collection API
    \================================================================================================*/
    async _fetchCollection(collection) {
        try {
            const { path, headers, body, queries } = collection.config;

            const responseData = await this._apiRequest(path, body, headers, queries);

            return { data: responseData, error: null };
        } catch (err) {
            return {
                error: Object.getOwnPropertyNames(err).reduce((obj, key) => ({ ...obj, [key]: err[key] }), {}),
            };
        }
    },

    async apiRequest({ path, body, headers, queries }, wwUtils) {
        /* wwEditor:start */
        const route = this.fastgenInstance.routes.value.find(route => route.Path === path);
        const method = route.Method;

        const payload = computePayload(method, body, headers, queries);
        if (wwUtils) {
            wwUtils.log('info', `Executing request ${method} on ${path}`, {
                type: 'request',
                preview: {
                    Data: payload.data,
                    Headers: payload.headers,
                },
            });
        }

        /* wwEditor:end */
        return await this._apiRequest(path, body, headers, queries);
    },

    async _apiRequest(path, body, headers, queries) {
        const url = 'https://' + this.fastgenInstance.project.value.Subdomain + path;
        const route = this.fastgenInstance.routes.value.find(route => route.Path === path);
        const method = route.Method;

        console.log(
            '✅ _apiRequest',
            url,
            'with method',
            method,
            'and body',
            body,
            'and headers',
            headers,
            'and queries',
            queries
        );
        const payload = computePayload(method, body, headers, queries);

        console.log('✅ apiRequest', url, 'with method', method, 'and payload', payload);

        const response = await axios({
            url,
            method,
            data: payload.data,
            body: payload.data,
            headers: payload.headers,
            params: payload.params,
        });

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

function computePayload(_, data, headers, params) {
    data = computeList(data);

    return {
        data,
        params: computeList(params),
        headers: {
            'content-type': 'application/json',
            ...computeList(headers),
        },
    };
}

function computeList(list) {
    return (list || []).reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {});
}
