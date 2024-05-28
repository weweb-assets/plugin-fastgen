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
