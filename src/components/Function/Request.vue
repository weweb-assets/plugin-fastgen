<template>
    <wwEditorFormRow label="Method" required>
        <wwEditorInputTextSelect
            :options="methodOptions"
            :model-value="method"
            placeholder="Select a method"
            @update:modelValue="setMethod"
        />
    </wwEditorFormRow>
    <wwEditorInputRow
        label="URL"
        required
        type="query"
        :model-value="url"
        placeholder="https://your-project.fastgenapp.com/your-path"
        bindable
        @update:modelValue="setUrl"
    />
    <template v-if="isData">
        <wwEditorFormRow>
            <wwEditorInputRadio :choices="dataChoices" :model-value="useRawBody" @update:modelValue="setUseRawBody" />
        </wwEditorFormRow>
        <wwEditorInputRow
            v-if="useRawBody"
            type="query"
            :model-value="data"
            label="Body"
            bindable
            @update:modelValue="setData"
        />
        <wwEditorInputRow
            v-else
            type="array"
            :model-value="data"
            label="Fields"
            bindable
            @update:modelValue="setData"
            @add-item="setData([...(data || []), {}])"
        >
            <template #default="{ item, setItem }">
                <wwEditorInputRow
                    type="query"
                    :model-value="item.key"
                    label="Key"
                    placeholder="Enter a value"
                    bindable
                    small
                    @update:modelValue="setItem({ ...item, key: $event })"
                />
                <wwEditorInputRow
                    type="query"
                    :model-value="item.value"
                    label="Value"
                    placeholder="Enter a value"
                    bindable
                    small
                    @update:modelValue="setItem({ ...item, value: $event })"
                />
            </template>
        </wwEditorInputRow>
    </template>
    <wwEditorInputRow
        label="Headers"
        type="array"
        :model-value="headers"
        bindable
        @update:modelValue="setHeaders"
        @add-item="setHeaders([...(headers || []), {}])"
    >
        <template #default="{ item, setItem }">
            <wwEditorInputRow
                type="query"
                :model-value="item.key"
                label="Key"
                placeholder="Enter a value"
                bindable
                small
                @update:modelValue="setItem({ ...item, key: $event })"
            />
            <wwEditorInputRow
                type="query"
                :model-value="item.value"
                label="Value"
                placeholder="Enter a value"
                bindable
                small
                @update:modelValue="setItem({ ...item, value: $event })"
            />
        </template>
    </wwEditorInputRow>
    <wwEditorInputRow
        type="array"
        :model-value="queries"
        label="Query string"
        bindable
        @update:modelValue="setQueries"
        @add-item="setQueries([...(queries || []), {}])"
    >
        <template #default="{ item, setItem }">
            <wwEditorInputRow
                type="query"
                :model-value="item.key"
                label="Key"
                placeholder="Enter a value"
                bindable
                small
                @update:modelValue="setItem({ ...item, key: $event })"
            />
            <wwEditorInputRow
                type="query"
                :model-value="item.value"
                label="Value"
                placeholder="Enter a value"
                bindable
                small
                @update:modelValue="setItem({ ...item, value: $event })"
            />
        </template>
    </wwEditorInputRow>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: {
            type: Object,
            default: () => ({
                url: null,
                method: null,
                data: [],
                headers: [],
                queries: [],
            }),
        },
    },
    emits: ['update:args'],
    data() {
        return {
            dataChoices: [
                { label: 'Parsed fields', value: false, default: true },
                { label: 'Raw body', value: true },
            ],
            methodOptions: [
                { label: 'GET', value: 'GET' },
                { label: 'POST', value: 'POST', default: true },
                { label: 'PATCH', value: 'PATCH' },
                { label: 'DELETE', value: 'DELETE' },
            ],
        };
    },
    computed: {
        url() {
            return this.args.url;
        },
        method() {
            return this.args.method;
        },
        data() {
            return this.args.data || [];
        },
        headers() {
            return this.args.headers || [];
        },
        queries() {
            return this.args.queries || [];
        },
        dataType() {
            return this.args.dataType;
        },
        isThroughServer() {
            return this.args.isThroughServer || false;
        },
        isWithCredentials() {
            return this.args.isWithCredentials || false;
        },
        useRawBody() {
            return this.args.useRawBody || false;
        },
        isData() {
            return ['POST', 'PATCH'].includes(this.method);
        },
    },
    mounted() {
        if (!this.method) this.setMethod('POST');
    },
    methods: {
        setUrl(url) {
            this.$emit('update:args', { ...this.args, url });
        },
        setMethod(method) {
            this.$emit('update:args', { ...this.args, method });
        },
        setData(data) {
            this.$emit('update:args', { ...this.args, data });
        },
        setQueries(queries) {
            this.$emit('update:args', { ...this.args, queries });
        },
        setHeaders(headers) {
            this.$emit('update:args', { ...this.args, headers });
        },
        setUseRawBody(useRawBody) {
            this.$emit('update:args', { ...this.args, useRawBody, data: useRawBody ? null : [] });
        },
    },
};
</script>
