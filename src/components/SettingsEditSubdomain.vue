<template>
    <div class="flex flex-col">
        <wwEditorInputRow
            label="Domain"
            type="query"
            full
            placeholder="Domain"
            :model-value="settings.publicData.project?.Subdomain"
            :disabled="!settings.publicData.project"
            @update:modelValue="setCustomDomain"
        />
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
            isTokenVisible: false,
            isLoading: false,
        };
    },
    methods: {
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
