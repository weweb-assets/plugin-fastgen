<template>
    <div class="fastgen-collection-summary">
        <div class="body-sm content-secondary flex" v-if="config.method">
            <span class="p-1 mr-2 content-primary ww-border-radius-01 bg-secondary bold">
                {{ config.method }}
            </span>
            <span class="body-sm content-secondary mt-1 path">{{ config.path }}</span>
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
.fastgen-collection-summary {
    display: grid;
    grid-template-columns: 0fr 1fr;
    column-gap: var(--ww-spacing-02);
    row-gap: var(--ww-spacing-02);

    .path {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
