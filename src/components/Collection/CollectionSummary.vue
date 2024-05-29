<template>
    <div class="supabase-collection-summary">
        <div class="p-2 ww-border-radius-02 border-primary">
            <div class="body-sm content-secondary">
                <div class="flex flex-row">
                    <span class="p-1 mr-2 content-primary ww-border-radius-01 bg-secondary bold">
                        {{ selectedRoute.Name }}
                    </span>
                    <span class="p-1 mr-2 content-primary ww-border-radius-01 bg-secondary bold">
                        {{ selectedRoute.Method }}
                    </span>
                </div>
                <span class="body-sm content-secondary mt-1">{{ plugin.project.Subdomain + config.path }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        config: { type: Object, required: true },
        plugin: { type: Object, required: true },
    },
    computed: {
        selectedRoute() {
            return this.plugin.routes.find(route => route.Path === this.config.path);
        },
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
