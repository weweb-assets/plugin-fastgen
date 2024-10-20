<template>
    <wwEditorFormRow>
        <div class="body-sm content-secondary">
            <span
                v-if="settings.publicData.project?.Name"
                class="p-1 mr-2 content-primary ww-border-radius-01 bg-secondary bold"
            >
                {{ settings.publicData.project?.Name }}
            </span>
            <span>{{ settings.publicData.project?.Subdomain || 'Undefined' }}</span>
        </div>
    </wwEditorFormRow>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
};
</script>
