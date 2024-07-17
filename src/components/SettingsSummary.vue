<template>
    <wwEditorFormRow label="Integration token">
        <div class="flex items-center mb-2 pt-2">
            <div><wwEditorIcon large name="key" class="mr-2" /></div>
            <span class="truncate">{{
                settings.privateData.integrationToken
                    ? '*****************************************'
                    : 'Integration token missing'
            }}</span>
        </div>
        <div v-if="plugin.project?.Name" class="p-2 ww-border-radius-02 border-primary">
            <div class="body-sm content-secondary">
                <span class="p-1 mr-2 content-primary ww-border-radius-01 bg-secondary bold">
                    {{ plugin.project.Name }}
                </span>
                <span>{{ plugin.project.Subdomain }}</span>
            </div>
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
