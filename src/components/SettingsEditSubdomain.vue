<template>
    <div class="flex flex-col">
        <wwEditorInputRow
            v-if="!isLoading"
            label="Domain"
            type="query"
            full
            placeholder="Domain"
            :model-value="settings.publicData.project?.Subdomain"
            :disabled="!settings.publicData.project"
            @update:modelValue="setCustomDomain"
        />
        <div v-else class="flex flex-row items-center">
            <wwLoaderSmall :loading="isLoading" />
            <div class="ml-2 body-sm">Gathering your project information...</div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import useFastgenInstance from '../useFastgenInstance';

export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    setup(props, { emit }) {
        const { fetchProject, project } = useFastgenInstance();
        const isLoading = ref(true);

        onMounted(async () => {
            if (props.settings.privateData.integrationToken) {
                await fetchProject();

                emit('update:settings', {
                    ...props.settings,
                    publicData: {
                        ...props.settings.publicData,
                        project: { Name: project.value?.Name, Subdomain: project.value?.Subdomain },
                    },
                });

                setTimeout(() => {
                    isLoading.value = false;
                }, 3000);
            }
        });

        return { isLoading };
    },
    data() {
        return {
            isTokenVisible: false,
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
