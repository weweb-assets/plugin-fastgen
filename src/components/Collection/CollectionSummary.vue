<template>
    <div class="supabase-collection-summary">
        <div class="p-2 mb-4 ww-border-radius-02 border-primary">
            {{ config.path }} <br />
            <span class="body-sm content-secondary mt-1">{{ plugin.project.Subdomain + config.path }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        config: { type: Object, required: true },
        plugin: { type: Object, required: true },
    },
};
</script>

<style lang="scss" scoped>
.supabase-collection-summary {
    display: grid;
    grid-template-columns: 0fr 1fr;
    column-gap: var(--ww-spacing-02);
    row-gap: var(--ww-spacing-02);
}
</style>
