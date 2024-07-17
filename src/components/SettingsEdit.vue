<template>
    <div class="flex flex-col">
        <wwEditorFormRow required label="Integration Token">
            <template #append-label>
                <a class="ml-2 ww-editor-link" href="https://app.fastgen.com/settings/integrationToken" target="_blank">
                    Find it here
                </a>
            </template>
            <div class="flex items-center">
                <wwEditorInputText
                    :type="isKeyVisible ? 'text' : 'password'"
                    name="integration-token"
                    placeholder="ey**************"
                    :model-value="settings.privateData.integrationToken"
                    @update:modelValue="changeIntegrationToken"
                    class="w-full mr-2"
                />
                <button class="ww-editor-button -icon -secondary -dark" @click.prevent="isKeyVisible = !isKeyVisible">
                    <wwEditorIcon :name="isKeyVisible ? 'eye-off' : 'eye'"></wwEditorIcon>
                </button>
            </div>
        </wwEditorFormRow>

        <div v-if="plugin.project?.Name" class="p-2 ww-border-radius-02 border-primary">
            <div class="body-sm content-secondary">
                <span class="p-1 mr-2 content-primary ww-border-radius-01 bg-secondary bold">
                    {{ plugin.project.Name }}
                </span>
                <span>{{ plugin.project.Subdomain }}</span>
            </div>
        </div>
    </div>
    <wwLoader :loading="isLoading" />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    data() {
        return {
            isKeyVisible: false,
            isLoading: false,
        };
    },
    watch: {
        async 'settings.privateData.integrationToken'(value) {
            if (value) {
                this.plugin.fetchProject();
                this.plugin.fetchRoutes();
            } else {
                wwLib.wwNotification.open({
                    text: 'Your integration token seems to be invalid. Please enter a valid token.',
                    color: 'red',
                });
            }
        },
    },
    methods: {
        async changeIntegrationToken(integrationToken) {
            this.$emit('update:settings', {
                ...this.settings,
                privateData: { ...this.settings.privateData, integrationToken },
            });
        },
        async changeProject(project) {
            this.$emit('update:settings', {
                ...this.settings,
                privateData: { ...this.settings.privateData, project },
            });
        },
    },
};
</script>
