import qs from 'qs';
/* wwEditor:start */
import './components/Collection/CollectionEdit.vue';
import './components/Collection/CollectionSummary.vue';
/* wwEditor:end */

export default {
    async _onLoad(settings) {
        console.log('✅ Fastgen Datasource loaded', settings.publicData);
    },

    async _fetchCollection(collection) {
        try {
            console.log('✅ Fetching collection', collection);
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

        console.log('✅ Request', path, method, headers, queries, body, dataType, authToken);

        let url = 'https://' + this.settings.publicData.project?.Subdomain + path;

        for (const key in queries) url = url.replace(`{${key}}`, queries[key]);

        /* wwEditor:start */
        wwUtils?.log('info', `[Fastgen] Requesting ${method.toUpperCase()} - ${url}`, {
            type: 'request',
            preview: body,
        });
        /* wwEditor:end */

        const shouldHaveBody = ['POST', 'PATCH'].includes(method);

        const params = typeof queries === 'object' ? queries : computeList(queries);
        const data = shouldHaveBody ? (typeof body === 'object' ? body : computeList(body)) : null;

        console.log('✅ Request', url, 'with method', method, 'and payload', {
            url,
            method,
            params,
            data,
            headers: buildFastgenHeaders({ authToken, dataType }, headers),
        });

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
