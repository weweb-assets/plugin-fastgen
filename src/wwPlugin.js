import qs from 'qs';
/* wwEditor:start */
import './components/Collection/CollectionEdit.vue';
import './components/Collection/CollectionSummary.vue';
/* wwEditor:end */

export default {
    /*=============================================m_ÔÔ_m=============================================\
        Collection API
    \================================================================================================*/
    async fetchCollection(collection) {
        try {
            const { url, method, data, headers, queries } = collection.config;
            const responseData = await this._apiRequest(url, method, data, headers, queries);

            return { data: responseData, error: null };
        } catch (err) {
            return {
                error: Object.getOwnPropertyNames(err).reduce((obj, key) => ({ ...obj, [key]: err[key] }), {}),
            };
        }
    },

    async apiRequest({ url, method, data, headers, queries: params }, wwUtils) {
        /* wwEditor:start */
        const payload = computePayload(method, data, headers, params);
        if (wwUtils) {
            wwUtils.log('info', `Executing request ${method} on ${url}`, {
                type: 'request',
                preview: {
                    Data: payload.data,
                    Headers: payload.headers,
                    'Query string': payload.params,
                },
            });
        }

        /* wwEditor:end */
        return await this._apiRequest(url, method, data, headers, params);
    },

    async _apiRequest(url, method, data, headers, params) {
        const payload = computePayload(method, data, headers, params);

        const response = await axios({
            url,
            method,
            data: payload.data,
            params: payload.params,
            headers: payload.headers,
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

function computePayload(method, data, headers, params, dataType, useRawBody) {
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
        params: computeList(params),
        headers: {
            'content-type': dataType || 'application/json',
            ...computeList(headers),
        },
    };
}

function computeList(list) {
    return (list || []).reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {});
}
