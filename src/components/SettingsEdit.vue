<template>
    <div class="flex flex-col">
        <wwEditorFormRow required label="Integration token">
            <template #append-label>
                <a
                    class="ml-2 ww-editor-link"
                    href="https://app.fastgen.com/settings/integrationToken/"
                    target="_blank"
                >
                    Find it here
                </a>
            </template>
            <div class="flex items-center">
                <wwEditorInputText
                    :type="isTokenVisible ? 'text' : 'password'"
                    name="integration-token"
                    placeholder="ey**************"
                    :model-value="settings.privateData.integrationToken"
                    @update:modelValue="changeIntegrationToken"
                    class="w-full mr-2"
                />
                <button
                    class="ww-editor-button -icon -secondary -dark"
                    @click.prevent="isTokenVisible = !isTokenVisible"
                >
                    <wwEditorIcon :name="isTokenVisible ? 'eye-off' : 'eye'"></wwEditorIcon>
                </button>
            </div>
        </wwEditorFormRow>
        <wwEditorInputRow
            label="Domain"
            type="query"
            full
            placeholder="Domain"
            required
            :model-value="settings.publicData.project?.Subdomain"
            :disabled="!settings.publicData.project"
            @update:modelValue="setCustomDomain"
        />
    </div>
    <wwLoader :loading="isLoading" />
</template>

<script>
import useFastgenInstance from '../useFastgenInstance';

export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    setup() {
        const { fetchProject, fetchRoutes, project, routes } = useFastgenInstance();

        return { fetchProject, fetchRoutes, project, routes };
    },
    data() {
        return {
            isTokenVisible: false,
            isLoading: false,
        };
    },
    methods: {
        async changeIntegrationToken(integrationToken) {
            this.$emit('update:settings', {
                ...this.settings,
                privateData: { ...this.settings.privateData, integrationToken },
            });

            if (integrationToken) {
                await this.fetchProject();
                await this.fetchRoutes();

                this.$emit('update:settings', {
                    ...this.settings,
                    publicData: { ...this.settings.publicData, project: this.project, routes: this.routes },
                });
            }
        },
        setCustomDomain(domain) {
            this.$emit('update:settings', {
                ...this.settings,
                publicData: {
                    ...this.settings.publicData,
                    project: { ...this.settings.publicData.project, Subdomain: domain },
                },
            });
        },
    },
};
</script>
