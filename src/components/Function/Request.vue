<template>
    <div class="fastgen-api-collection-edit">
        <div class="flex items-center mb-4">
            <wwEditorInputRow
                type="select"
                placeholder="Select a route"
                :model-value="selectedValue"
                :disabled="!plugin.project"
                :options="routesOptions"
                required
                label="Route"
                @update:modelValue="setRouteInfo"
            />
            <button type="button" class="ww-editor-button -secondary -small -icon ml-2" @click="fetchRoutes">
                <wwEditorIcon name="refresh" medium />
            </button>
        </div>

        <div v-if="selectedRoute.Name">
            <div class="p-2 mb-4 ww-border-radius-02 border-primary">
                {{ selectedRoute.Name }} <br />
                <span class="body-sm content-secondary mt-1">{{ plugin.project.Subdomain + selectedRoute.Path }}</span>
            </div>

            <wwEditorFormRow v-if="selectedRoute.Description" label="Description">
                <div class="p-2 body-sm content-secondary ww-border-radius-02 border-primary">
                    {{ selectedRoute.Description }}
                </div>
            </wwEditorFormRow>

            <wwEditorFormRow label="Method">
                <wwEditorInputText :model-value="selectedRoute.Method" disabled />
            </wwEditorFormRow>

            <wwEditorFormRow label="Authentication" v-if="Object.keys(selectedRoute.Authentication).length">
                <wwEditorInputPreview :value="selectedRoute.Authentication" colored formated />
            </wwEditorFormRow>

            <wwEditorFormRow label="Body Validation" v-if="Object.keys(selectedRoute.BodyValidation).length">
                <wwEditorInputPreview :value="selectedRoute.BodyValidation" colored formated />
            </wwEditorFormRow>

            <wwEditorInputRow
                label="Headers"
                type="array"
                :model-value="headers"
                :bindable="true"
                @update:modelValue="setHeaders"
                @add-item="setHeaders([...(headers || []), {}])"
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
                label="Body"
                type="array"
                :model-value="body"
                :bindable="true"
                @update:modelValue="setBody"
                @add-item="setBody([...(body || []), {}])"
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
                label="Queries"
                type="array"
                :model-value="queries"
                :bindable="true"
                @update:modelValue="setQueries"
                @add-item="setQueries([...(queries || []), {}])"
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
    </div>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        config: { type: Object, required: true },
        args: {
            type: Object,
            default: () => ({
                routeInfo: {
                    path: null,
                    method: null,
                    name: null,
                },
                body: [],
                headers: [],
                queries: [],
            }),
        },
    },
    emits: ['update:args'],
    computed: {
        routesOptions() {
            return this.plugin.routes.map(api => ({
                label: `${api.Method} - ${api.Name}`,
                value: `${api.Method}-${api.Name}-${api.Path}`,
            }));
        },
        selectedValue() {
            return `${this.args.routeInfo.method}-${this.args.routeInfo.name}-${this.args.routeInfo.path}`;
        },
        selectedRoute() {
            return (
                this.plugin.routes.find(
                    route =>
                        route.Method === this.args.routeInfo.method &&
                        route.Path === this.args.routeInfo.path &&
                        route.Name === this.args.routeInfo.name
                ) || {}
            );
        },
        path() {
            return this.args.routeInfo.path;
        },
        headers() {
            return this.args.headers || [];
        },
        body() {
            return this.args.body || [];
        },
        queries() {
            return this.args.queries || [];
        },
    },
    methods: {
        setRouteInfo(value) {
            const [method, name, path] = value.split('-');
            this.$emit('update:args', { ...this.args, routeInfo: { method, path, name } });
        },
        setHeaders(headers) {
            this.$emit('update:args', { ...this.args, headers });
        },
        setBody(body) {
            this.$emit('update:args', { ...this.args, body });
        },
        setQueries(queries) {
            this.$emit('update:args', { ...this.args, queries });
        },
        fetchRoutes() {
            this.plugin.fetchRoutes();
        },
    },
    watch: {
        'plugin.routes': {
            deep: true,
            handler() {
                this.$forceUpdate();
            },
        },
    },
};
</script>
