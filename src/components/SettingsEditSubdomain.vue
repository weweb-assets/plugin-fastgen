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
import { onMounted } from 'vue';
import useFastgenInstance from '../useFastgenInstance';

export default {
    props: {
        plugin: { type: Object, required: true },
        settings: { type: Object, required: true },
    },
    emits: ['update:settings'],
    setup(props, { emit }) {
        const { fetchProject, project } = useFastgenInstance();

        const token = props.settings.privateData.integrationToken;

        onMounted(async () => {
            if (token) {
                await fetchProject(token);

                emit('update:settings', {
                    ...props.settings,
                    publicData: {
                        ...props.settings.publicData,
                        project: { Name: project.value?.Name, Subdomain: project.value?.Subdomain },
                    },
                });
            }
        });

        return {};
    },
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
