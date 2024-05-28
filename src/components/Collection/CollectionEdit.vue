<template>
    <div class="fastgen-api-collection-edit">
        <wwEditorInputRow
            type="select"
            placeholder="Select a project"
            :model-value="plugin.settings.privateData.project"
            :disabled="!plugin.settings.privateData.integrationToken"
            :options="projectsOptions"
            required
            label="Project"
            @update:modelValue="changeProject"
        />
        <wwEditorInputRow
            type="select"
            placeholder="Select an API"
            :model-value="plugin.settings.privateData.api"
            :disabled="!plugin.settings.privateData.project"
            :options="apisOptions"
            required
            label="API"
            @update:modelValue="changeApi"
        />

        <wwEditorFormRow label="Method" required>
            <wwEditorInputTextSelect
                :options="methodOptions"
                :model-value="api.method"
                placeholder="Select a method"
                @update:modelValue="setProp('method', $event)"
            />
        </wwEditorFormRow>
        <wwEditorFormRow required label="URL">
            <template #append-label>
                <a class="ww-editor-link ml-2" href="https://app.fastgen.com/api" target="_blank"> Find it here </a>
            </template>
            <wwEditorInputRow
                type="query"
                placeholder="https://your-project.fastgenapp.com/your-path"
                :model-value="api.url"
                @update:modelValue="setProp('url', $event)"
            />
        </wwEditorFormRow>
        <template v-if="isFields">
            <wwEditorFormRow>
                <wwEditorInputRadio
                    :choices="dataChoices"
                    :model-value="api.useRawBody"
                    @update:modelValue="setProp('useRawBody', $event)"
                />
            </wwEditorFormRow>
            <wwEditorInputRow
                v-if="api.useRawBody"
                type="query"
                :model-value="api.data"
                label="Body"
                :bindable="true"
                @update:modelValue="setProp('data', $event)"
            />
            <wwEditorInputRow
                v-else
                label="Fields"
                type="array"
                :model-value="api.data"
                :bindable="true"
                @update:modelValue="setProp('data', $event)"
                @add-item="setProp('data', [...(api.data || []), {}])"
            >
                <template #default="{ item, setItem }">
                    <wwEditorInputRow
                        type="query"
                        :model-value="item.key"
                        label="Key"
                        placeholder="Enter a value"
                        small
                        :bindable="true"
                        @update:modelValue="setItem({ ...item, key: $event })"
                    />
                    <wwEditorInputRow
                        type="query"
                        :model-value="item.value"
                        label="Value"
                        placeholder="Enter a value"
                        small
                        :bindable="true"
                        @update:modelValue="setItem({ ...item, value: $event })"
                    />
                </template>
            </wwEditorInputRow>
        </template>
        <wwEditorInputRow
            label="Headers"
            type="array"
            :model-value="api.headers"
            :bindable="true"
            @update:modelValue="setProp('headers', $event)"
            @add-item="setProp('headers', [...(api.headers || []), {}])"
        >
            <template #default="{ item, setItem }">
                <wwEditorInputRow
                    type="query"
                    :model-value="item.key"
                    label="Key"
                    placeholder="Enter a value"
                    small
                    :bindable="true"
                    @update:modelValue="setItem({ ...item, key: $event })"
                />
                <wwEditorInputRow
                    type="query"
                    :model-value="item.value"
                    label="Value"
                    placeholder="Enter a value"
                    small
                    :bindable="true"
                    @update:modelValue="setItem({ ...item, value: $event })"
                />
            </template>
        </wwEditorInputRow>
        <wwEditorInputRow
            label="Query string"
            type="array"
            :model-value="api.queries"
            :bindable="true"
            @update:modelValue="setProp('queries', $event)"
            @add-item="setProp('queries', [...(api.queries || []), {}])"
        >
            <template #default="{ item, setItem }">
                <wwEditorInputRow
                    type="query"
                    :model-value="item.key"
                    label="Key"
                    placeholder="Enter a value"
                    small
                    :bindable="true"
                    @update:modelValue="setItem({ ...item, key: $event })"
                />
                <wwEditorInputRow
                    type="query"
                    :model-value="item.value"
                    label="Value"
                    placeholder="Enter a value"
                    small
                    :bindable="true"
                    @update:modelValue="setItem({ ...item, value: $event })"
                />
            </template>
        </wwEditorInputRow>
    </div>
</template>

<script>
const PROJECTS = [
    {
        Uuid: 'b16e2674-e39c-456f-a133-e0528b4a199f',
        Name: 'wwExplo',
        Subdomain: 'wwexplo.fastgenapp.com',
        CreatedAt: '2024-03-26T09:25:11.758221Z',
        UpdatedAt: '2024-03-26T09:25:11.758221Z',
        TeamUuid: '41a68fa3-1852-41b9-ad6f-a3aa5431010b',
    },
];

const APIs = [
    {
        Id: 6,
        Version: 17,
        Method: 'POST',
        Path: '/post',
        Name: 'Push',
        Description: '',
        Authentication: {
            Required: true,
            UsersAllowed: true,
            AllowedUserRoles: null,
            ApiTokens: [Array],
        },
        BodyValidation: {
            age: {
                Type: 'number',
            },
            email: {
                Type: 'string',
            },
            username: {
                Type: 'string',
                MinLength: 3,
            },
        },
        CreatedAt: '2024-04-08T21:10:03.900241Z',
        UpdatedAt: '2024-05-27T16:54:02.093072Z',
    },
    {
        Id: 1,
        Version: 29,
        Method: 'GET',
        Path: '/hello',
        Name: 'hello',
        Description: '',
        Authentication: {
            ApiTokens: [],
            Required: false,
            UsersAllowed: false,
            AllowedUserRoles: null,
        },
        BodyValidation: {},
        CreatedAt: '2024-03-26T09:29:43.515629Z',
        UpdatedAt: '2024-04-09T14:02:36.044881Z',
    },
];

export default {
    props: {
        plugin: { type: Object, required: true },
        collection: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    emits: ['update:config'],
    data() {
        return {
            dataChoices: [
                { label: 'Parsed fields', value: false, default: true },
                { label: 'Raw body', value: true },
            ],
            methodOptions: [
                { value: 'GET', label: 'GET', default: true },
                { value: 'POST', label: 'POST' },
                { value: 'PATCH', label: 'PATCH' },
                { value: 'DELETE', label: 'DELETE' },
            ],
        };
    },
    computed: {
        projectsOptions() {
            return PROJECTS.map(project => ({
                label: project.Name,
                value: project.Name,
            }));
        },
        apisOptions() {
            return APIs.map(api => ({
                label: api.Name,
                value: api.Path,
            }));
        },
        api() {
            return {
                method: 'GET',
                url: undefined,
                headers: [],
                queries: [],
                data: [],
                useRawBody: false,
                ...this.config,
            };
        },
        securedByToken() {
            return this.args.securedByToken;
        },
        isFields() {
            return ['POST', 'PATCH'].includes(this.api.method);
        },
    },
    methods: {
        setProp(key, value) {
            this.$emit('update:config', { ...this.api, [key]: value });
        },
    },
};
</script>
