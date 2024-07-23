<template>
    <div class="fastgen-api-collection-edit">
        <wwEditorInputRow
            type="select"
            placeholder="Select a route"
            :model-value="path"
            :disabled="!plugin.project"
            :options="routesOptions"
            required
            label="Route"
            @update:modelValue="setRoutePath"
        />

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
                @add-item="setQueries([...(route.queries || []), {}])"
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
                path: null,
                body: [],
                headers: [],
            }),
        },
    },
    emits: ['update:args'],
    computed: {
        routesOptions() {
            return this.plugin.routes.map(api => ({
                label: `${api.Method} - ${api.Name}`,
                value: `${api.Method}-${api.Path}`,
            }));
        },
        selectedRoute() {
            return this.plugin.routes.find(route => route.Path === this.path) || {};
        },
        path() {
            return this.args.path;
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
        setRoutePath(path) {
            this.$emit('update:args', { ...this.args, path });
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
    },
};
</script>
