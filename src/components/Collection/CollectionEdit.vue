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
                    @update:modelValue="setRouteInfo"
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
                <wwEditorInputPreview
                    v-if="selectedRoute.Method !== 'GET'"
                    :value="selectedRoute.BodyValidation"
                    colored
                    formated
                />
                <InfoBox v-else>
                    <template #content>
                        While not strictly prohibited by the specification, the semantics of sending a message body in
                        GET requests are undefined. Some systems may reject the request with a 400 or another 4XX client
                        error. <br />
                        <a
                            href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET"
                            target="_blank"
                            class="mt-2 ww-editor-link"
                        >
                            Get documentation - MDN
                        </a>
                    </template>
                </InfoBox>
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
        config: { type: Object, required: true },
    },
    emits: ['update:config'],
    setup(props) {
        const isFetching = ref(false);

        const { fetchRoutes, routes } = useFastgenInstance();

        const routesOptions = computed(() => [
            ...new Map(routes.value.map(api => [api.Name, { label: api.Name, value: api.Name }])).values(),
        ]);

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
            await fetchRoutes();
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
        setRouteInfo(name) {
            const path = this.routes.find(route => route.Name === name)?.Path;
            const method = this.routes.find(route => route.Name === name)?.Method;
            this.$emit('update:config', { ...this.config, path, name, method });
        },
        setProp(key, value) {
            const updatedRoute = { ...this.route, [key]: value };
            this.$emit('update:config', updatedRoute);
        },
        async fetchRoutes() {
            this.isFetching = true;
            await this.fetchRoutes();
            this.isFetching = false;
        },
    },
};
</script>
