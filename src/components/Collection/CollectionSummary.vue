<template>
    <div class="supabase-collection-summary">
        <div class="body-sm content-secondary" v-if="project?.Subdomain">
            <span class="p-1 mr-2 content-primary ww-border-radius-01 bg-secondary bold">
                {{ selectedRoute.Method }}
            </span>
            <span class="body-sm content-secondary mt-1">{{ project.Subdomain + config.path }}</span>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import useFastgenInstance from '../../useFastgenInstance';

export default {
    props: {
        config: { type: Object, required: true },
        plugin: { type: Object, required: true },
    },
    setup(props) {
        const { project, routes } = useFastgenInstance();

        const selectedRoute = computed(() => {
            return (
                routes.value.find(route => route.Path === props.config.path && route.Name === props.config.name) || {}
            );
        });

        return {
            project,
            selectedRoute,
        };
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
