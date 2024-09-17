export default {
    features: {
        datasource: true,
    },
    editor: {
        settings: [
            {
                edit: () => import('./src/components/SettingsEditToken.vue'),
                summary: () => import('./src/components/SettingsSummaryToken.vue'),
                getIsValid({ integrationToken }) {
                    return !!integrationToken;
                },
            },
            {
                edit: () => import('./src/components/SettingsEditSubdomain.vue'),
                summary: () => import('./src/components/SettingsSummarySubdomain.vue'),
                getIsValid() {
                    return true;
                },
            },
        ],
        collection: {
            edit: () => import('./src/components/Collection/CollectionEdit.vue'),
            summary: () => import('./src/components/Collection/CollectionSummary.vue'),
            getIsValid(config) {
                return !!config.path;
            },
            modes: ['dynamic'],
        },
    },
    actions: [
        {
            name: 'Request',
            code: 'request',
            isAsync: true,
            /* wwEditor:start */
            edit: () => import('./src/components/Function/Request.vue'),
            getIsValid({ path }) {
                return !!path;
            },
            /* wwEditor:end */
        },
    ],
};
