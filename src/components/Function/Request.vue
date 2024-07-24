<template>
    <div class="fastgen-api-collection-edit">
        <div class="flex items-center mb-4">
            <wwEditorInputRow
                class="w-100"
                type="select"
                placeholder="Select a route"
                :model-value="selectedRoute.Name"
                :disabled="!plugin.project"
                :options="routesOptions"
                required
                label="Route"
                @update:modelValue="setRoutePath"
            />
            <button type="button" class="ww-editor-button -secondary -small -icon ml-2" @click="fetchRoutes">
                <wwEditorIcon name="refresh" medium />
            </button>
        </div>

        <div v-if="selectedRoute.Name">
            <div class="p-2 mb-4 ww-border-radius-02 border-primary">
                {{ selectedRoute.Name }} <br />
                <span class="body-sm content-secondary mt-1">{{ project?.Subdomain || '' + selectedRoute.Path }}</span>
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
import { computed } from 'vue';
import useFastgenInstance from '../../useFastgenInstance';

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
                queries: [],
            }),
        },
    },
    emits: ['update:args'],
    setup(props) {
        const { routes, fetchRoutes } = useFastgenInstance();

        const routesOptions = computed(() => {
            return routes.value.map(api => ({
                label: api.Name,
                value: api.Name,
            }));
        });

        const selectedRoute = computed(() => {
            routes.value.find(route => route.Path === props.arg.path && route.Name === props.arg.name) || {};
        });

        const route = computed(() => {
            return {
                path: null,
                headers: [],
                body: [],
                queries: [],
                ...props.args,
            };
        });

        return {
            fetchRoutes,
            routesOptions,
            selectedRoute,
            routes,
            route,
        };
    },
    methods: {
        setRoutePath(name) {
            const path = this.routes.find(route => route.Name === name)?.Path;
            this.$emit('update:args', { ...this.args, path, name });
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
            this.fetchRoutes();
        },
    },
};
</script>

<style>
.code-editor {
    max-height: 200px;
}
</style>
