<template>
    <div class="fastgen-api-collection-edit">
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
export default {
    props: {
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
