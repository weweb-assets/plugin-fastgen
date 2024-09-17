export default {
    features: {
        datasource: true,
    },
    editor: {
        settings: [
            {
                label: 'Token configuration',
                edit: () => import('./src/components/SettingsEditToken.vue'),
                summary: () => import('./src/components/SettingsSummaryToken.vue'),
                getIsValid(config) {
                    return !!config.privateData.integrationToken;
                },
            },
            {
                label: 'Domain configuration',
                edit: () => import('./src/components/SettingsEditSubdomain.vue'),
                summary: () => import('./src/components/SettingsSummarySubdomain.vue'),
                getIsValid(config) {
                    return !!config.publicData.project?.Subdomain;
                },
                onSave: '_init',
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
