export default {
    editor: {
        collection: {
            edit: () => import('./src/components/Collection/CollectionEdit.vue'),
            summary: () => import('./src/components/Collection/CollectionSummary.vue'),
            getIsValid(config) {
                return !!config.method && !!config.url;
            },
            modes: ['dynamic'],
        },
    },
    actions: [
        {
            name: 'Request',
            code: 'apiRequest',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Function/Request.vue'),
            getIsValid({ url, method }) {
                return !!url && !!method;
            },
            /* wwEditor:end */
        },
    ],
};
