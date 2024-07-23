<template>
    <div class="fastgen-api-collection-edit">
        <wwEditorFormRow label="Route" required>
            <div class="flex items-center">
                <wwEditorInputTextSelect
                    class="w-100"
                    placeholder="Select a route"
                    :disabled="!plugin.project"
                    :model-value="selectedValue"
                    :options="routesOptions"
                    required
                    label="Route"
                    @update:modelValue="setRouteInfo"
                />
                <button type="button" class="ww-editor-button -secondary -small -icon ml-2" @click="fetchRoutes">
                    <wwEditorIcon name="refresh" medium />
                </button>
            </div>
        </wwEditorFormRow>

        <div>
            {{ selectedRoute }}
        </div>

        <div>
            {{ routesOptions }}
        </div>

        <div v-if="selectedRoute.Name">
            <div class="p-2 mb-4 ww-border-radius-02 border-primary">
                {{ selectedRoute.Name }} <br />
                <span class="body-sm content-secondary mt-1">{{ plugin.project.Subdomain + selectedRoute.Path }}</span>
            </div>

            <wwEditorFormRow v-if="selectedRoute.Description" label="Description">
                <div class="p-2 ww-border-radius-02 border-primary">
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
                :model-value="route.headers"
                :bindable="true"
                @update:modelValue="setProp('headers', $event)"
                @add-item="setProp('headers', [...(route.headers || []), {}])"
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
                :model-value="route.body"
                :bindable="true"
                @update:modelValue="setProp('body', $event)"
                @add-item="setProp('body', [...(route.body || []), {}])"
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
                :model-value="route.queries"
                :bindable="true"
                @update:modelValue="setProp('queries', $event)"
                @add-item="setProp('queries', [...(route.queries || []), {}])"
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
        collection: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    emits: ['update:config'],
    data() {
        return {};
    },
    computed: {
        routesOptions() {
            return this.plugin.routes.map(api => ({
                label: api.Name,
                value: `${api.Method}-${api.Name}-${api.Path}`,
            }));
        },
        selectedValue() {
            return `${this.config.method}-${this.config.name}-${this.config.path}`;
        },
        selectedRoute() {
            return (
                this.plugin.routes.find(
                    route =>
                        route.Method === this.config.method &&
                        route.Path === this.config.path &&
                        route.Name === this.config.name
                ) || {}
            );
        },
        route() {
            const [method, name, path] = (this.config.path || '').split('-');
            return {
                method,
                path,
                name,
                headers: [],
                body: [],
                ...this.config,
            };
        },
    },
    methods: {
        setRouteInfo(value) {
            const [method, name, path] = (value || '').split('-');
            console.log('setRouteInfo', method, name, path);
            this.$emit('update:config', { ...this.config, method, path, name });
        },
        setProp(key, value) {
            const updatedRoute = { ...this.route, [key]: value };
            this.$emit('update:config', updatedRoute);
        },
        fetchRoutes() {
            this.plugin.fetchRoutes();
            this.setRouteInfo('');
        },
    },
};
</script>

<style>
.code-editor {
    max-height: 200px;
}
</style>
