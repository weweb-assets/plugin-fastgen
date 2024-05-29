<template>
    <div class="fastgen-api-collection-edit">
        <wwEditorInputRow
            type="select"
            placeholder="Select a route"
            :model-value="route.path"
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
                label: api.Path,
                value: api.Path,
            }));
        },
        selectedRoute() {
            return this.plugin.routes.find(route => route.Path === this.config.path) || {};
        },
        route() {
            return {
                path: null,
                headers: [],
                body: [],
                ...this.config,
            };
        },
    },
    methods: {
        setRoutePath(path) {
            this.$emit('update:config', { ...this.config, path });
        },
        setProp(key, value) {
            const updatedRoute = { ...this.route, [key]: value };
            this.$emit('update:config', updatedRoute);
        },
    },
};
</script>

<style>
.code-editor {
    max-height: 200px;
}
</style>
