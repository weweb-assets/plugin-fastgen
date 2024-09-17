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
    </div>
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
            isTokenVisible: false,
        };
    },
    methods: {
        async changeIntegrationToken(integrationToken) {
            this.$emit('update:settings', {
                ...this.settings,
                privateData: { ...this.settings.privateData, integrationToken },
            });
        },
    },
};
</script>
