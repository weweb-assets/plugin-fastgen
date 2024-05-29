<template>
    <div class="fastgen-api-collection-edit">
        <wwEditorInputRow
            type="select"
            placeholder="Select an API"
            :model-value="route.path"
            :disabled="!plugin.project"
            :options="routesOptions"
            required
            label="API"
            @update:modelValue="setProp('route', $event)"
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
                value: api.Path,
            }));
        },
        route() {
            return {
                path: null,
                ...this.config,
            };
        },
    },
    methods: {
        setProp(key, value) {
            this.$emit('update:config', {
                ...this.route,
                [key]: (this.plugin.routes.find(api => api.Path === this.route.value)[key] = value),
            });
        },
    },
};
</script>
