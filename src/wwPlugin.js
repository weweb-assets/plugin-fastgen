import qs from 'qs';
/* wwEditor:start */
import './components/Collection/CollectionEdit.vue';
import './components/Collection/CollectionSummary.vue';
/* wwEditor:end */

export default {
    async _onLoad(settings) {
        console.log('Fastgen plugin loaded', settings);
    },

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

    async request({ path, method, headers, queries, body, dataType }, wwUtils) {
        const authToken =
            (wwLib.wwPlugins.fastgenAuth && wwLib.wwPlugins.fastgenAuth.accessToken) ||
            Object.values(wwLib.wwPlugins).find(plugin => plugin.name === 'Fastgen Auth')?.accessToken;

        let url = 'https://' + this.settings.publicData.project?.Subdomain + path;
        for (const key in queries) url = url.replace(`{${key}}`, queries[key]);

        /* wwEditor:start */
        wwUtils?.log('info', `[Fastgen] Requesting ${method.toUpperCase()} - ${url}`, {
            type: 'request',
            preview: body,
        });
        /* wwEditor:end */

        const shouldHaveBody = ['POST', 'PATCH'].includes(method);
        const params = Array.isArray(queries) ? computeList(queries) : queries;
        const data = shouldHaveBody ? (Array.isArray(body) ? computeList(body) : body) : null;

        return await axios({
            url,
            method,
            params,
            data,
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
