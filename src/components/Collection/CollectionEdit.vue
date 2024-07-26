<template>
    <div class="fastgen-api-collection-edit">
        <wwEditorFormRow label="Route" required>
            <div class="flex items-center">
                <wwEditorInputTextSelect
                    class="w-100"
                    placeholder="Select a route"
                    :disabled="!plugin.project || isFetching"
                    :model-value="selectedRoute.Name"
                    :options="routesOptions"
                    required
                    label="Route"
                    @update:modelValue="setRoutePath"
                />
                <button type="button" class="ww-editor-button -secondary -small -icon ml-2" @click="fetchRoutes">
                    <wwEditorIcon name="refresh" medium />
                </button>
            </div>
        </wwEditorFormRow>

        <div v-if="selectedRoute.Name">
            <div class="p-2 mb-4 ww-border-radius-02 border-primary">
                {{ selectedRoute.Name }} <br />
                <span class="body-sm content-secondary mt-1">{{ project?.Subdomain || '' + selectedRoute.Path }}</span>
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
                v-if="shouldHaveBody"
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
import { ref, computed, onMounted } from 'vue';
import useFastgenInstance from '../../useFastgenInstance';

export default {
    props: {
        plugin: { type: Object, required: true },
        collection: { type: Object, required: true },
        settings: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    emits: ['update:config', 'update:settings'],
    setup(props, { emit }) {
        const isFetching = ref(false);

        const { fetchProject, fetchRoutes } = useFastgenInstance();

        const routes = computed(() => props.plugin.settings.publicData?.routes || []);

        const routesOptions = computed(() => {
            return routes.value.map(api => ({
                label: api.Name,
                value: api.Name,
            }));
        });

        const selectedRoute = computed(() => {
            return (
                routes.value.find(route => route.Path === props.config.path && route.Name === props.config.name) || {}
            );
        });

        const route = computed(() => {
            return {
                path: null,
                name: null,
                headers: [],
                body: [],
                ...props.config,
            };
        });

        const shouldHaveBody = computed(() => {
            return selectedRoute.value.Method === 'POST' || selectedRoute.value.Method === 'PATCH';
        });

        onMounted(async () => {
            isFetching.value = true;
            await fetchProject();
            await fetchRoutes();

            emit('update:settings', {
                ...props.plugin.settings,
                publicData: {
                    ...props.plugin.settings.publicData,
                    routes: props.routes,
                },
            });
            isFetching.value = false;
        });

        return {
            fetchRoutes,
            routesOptions,
            selectedRoute,
            routes,
            route,
            shouldHaveBody,
            isFetching,
        };
    },
    methods: {
        setRoutePath(name) {
            const path = this.routes.find(route => route.Name === name)?.Path;
            this.$emit('update:config', { ...this.config, path, name });
        },
        setProp(key, value) {
            const updatedRoute = { ...this.route, [key]: value };
            this.$emit('update:config', updatedRoute);
        },
        async fetchRoutes() {
            this.isFetching = true;
            await this.fetchRoutes();

            this.$emit('update:settings', {
                ...this.plugin.settings,
                publicData: {
                    ...this.plugin.settings.publicData,
                    routes: this.routes,
                },
            });
            this.isFetching = false;
        },
    },
};
</script>

<style>
.code-editor {
    max-height: 200px;
}
</style>
