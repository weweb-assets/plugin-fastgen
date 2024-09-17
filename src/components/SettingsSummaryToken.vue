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
