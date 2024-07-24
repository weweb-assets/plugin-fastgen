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
            const { data } = await this.request(collection.config);
            return { data, error: null };
        } catch (err) {
            return {
                error: Object.getOwnPropertyNames(err).reduce((obj, key) => ({ ...obj, [key]: err[key] }), {}),
            };
        }
    },

    // async apiRequest(path, body, headers, queries) {
    //     const url = 'https://' + this.fastgenInstance.project.value.Subdomain + path;
    //     const route = this.fastgenInstance.routes.value.find(route => route.Path === path);
    //     const method = route.Method;

    //     const payload = computePayload(method, body, headers, queries);

    //     console.log('✅ apiRequest', url, 'with method', method, 'and payload', payload);

    //     const response = await axios({
    //         url,
    //         method,
    //         data: payload.data,
    //         headers: payload.headers,
    //         params: payload.params,
    //     });

    //     return response.data;
    // },

    async request({ path, headers, params, body, dataType }, wwUtils) {
        const authToken = wwLib.wwPlugins.fastgenAuth && wwLib.wwPlugins.fastgenAuth.authToken;

        const url = 'https://' + this.fastgenInstance.project.value.Subdomain + path;
        const route = this.fastgenInstance.routes.value.find(route => route.Path === path);
        const method = route.Method;

        for (const key in params) url = url.replace(`{${key}}`, params[key]);

        wwUtils?.log('info', `[Fastgen] Requesting ${method.toUpperCase()} - ${url}`, {
            type: 'request',
            preview: body,
        });

        console.log('✅ apiRequest', url, 'with method', method, 'and payload', {
            url,
            method,
            params: computeList(params),
            data: computeList(body),
            headers: buildFastgenHeaders({ authToken, dataType }, headers),
        });

        return await axios({
            url,
            method,
            params: computeList(params),
            data: computeList(body),
            headers: buildFastgenHeaders({ authToken, dataType }, headers),
        });
    },
};

function computeList(list) {
    return (list || []).reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {});
}

function buildFastgenHeaders({ authToken, dataType }, customHeaders = []) {
    return {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(dataType ? { 'Content-Type': dataType || 'application/json' } : {}),
        ...(Array.isArray(customHeaders) ? customHeaders : [])
            .filter(header => !!header && !!header.key)
            .reduce((curr, next) => ({ ...curr, [next.key]: next.value }), {}),
    };
}
