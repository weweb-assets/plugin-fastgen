export default {
    features: {
        datasource: true,
    },
    editor: {
        settings: {
            edit: () => import('./src/components/SettingsEdit.vue'),
            summary: () => import('./src/components/SettingsSummary.vue'),
            getIsValid() {
                return true;
            },
            onSave: '_onLoad',
        },
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
            copilot: {
                description: 'Make a request to a Fastgen API endpoint',
                returns: 'object',
                schema: {
                    path: {
                        type: 'string',
                        description: 'The API endpoint path',
                        bindable: true
                    },
                    method: {
                        type: 'string',
                        description: 'HTTP method (GET, POST, PATCH, etc)',
                        bindable: true
                    },
                    headers: {
                        type: 'array',
                        description: 'Request headers as key-value pairs',
                        bindable: true
                    },
                    queries: {
                        type: 'array',
                        description: 'URL query parameters as key-value pairs',
                        bindable: true
                    },
                    body: {
                        type: 'array',
                        description: 'Request body data as key-value pairs (for POST/PATCH)',
                        bindable: true
                    },
                    dataType: {
                        type: 'string',
                        description: 'Content-Type header value',
                        bindable: true
                    }
                }
            }
            /* wwEditor:end */
        },
    ],
};