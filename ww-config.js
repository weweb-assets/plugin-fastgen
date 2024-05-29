export default {
    editor: {
        settings: {
            edit: () => import('./src/components/SettingsEdit.vue'),
            summary: () => import('./src/components/SettingsSummary.vue'),
            getIsValid(settings) {
                return true;
            },
            onSave: 'onLoad',
        },
        collection: {
            edit: () => import('./src/components/Collection/CollectionEdit.vue'),
            summary: () => import('./src/components/Collection/CollectionSummary.vue'),
            getIsValid(config) {
                return true;
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
