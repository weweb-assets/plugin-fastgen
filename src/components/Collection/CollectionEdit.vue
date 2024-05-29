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

        <div v-if="route.path">
            <div class="p-2 ww-border-radius-02 border-primary">
                {{ route.name }} <br />
                <span class="body-sm content-secondary mt-1">{{ plugin.project.Subdomain + route.path }}</span>
            </div>

            <wwEditorFormRow v-if="route.description" label="Description">
                <div class="p-2 ww-border-radius-02 border-primary">
                    {{ route.description }}
                </div>
            </wwEditorFormRow>

            <wwEditorFormRow label="Method">
                <wwEditorInputText :model-value="route.method" disabled />
            </wwEditorFormRow>

            <wwEditorFormRow label="Authentication">
                <wwEditorInputCode
                    :model-value="JSON.stringify(route.authentication)"
                    class="code-editor"
                    no-settings
                    format
                    disabled
                />
            </wwEditorFormRow>

            <wwEditorFormRow label="Body Validation">
                <wwEditorInputCode
                    :model-value="JSON.stringify(route.bodyValidation)"
                    class="code-editor"
                    no-settings
                    format
                    disabled
                />
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
        route() {
            const route = this.plugin.routes.find(route => route.Path === this.config.path) || {};

            return {
                path: route.Path || '',
                name: route.Name || '',
                method: route.Method || '',
                description: route.Description || '',
                authentication: route.Authentication || {},
                bodyValidation: route.BodyValidation || {},
                headers: route.Headers || [],
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
