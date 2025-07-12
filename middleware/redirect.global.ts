export default defineNuxtRouteMiddleware((to) => {
    const plugins = [
        { base: 'kubernetes', taskRunners: ['kubernetes'] },
        { base: 'aws', taskRunners: ['batch'] },
        { base: 'gcp', taskRunners: ['batch', 'cloudrun'] },
        { base: 'azure', taskRunners: ['batch'] },
    ];

    for (const plugin of plugins) {
        for (const taskRunner of plugin.taskRunners) {
            const standardPath = `/plugins/plugin-${plugin.base}/io.kestra.plugin.${plugin.base}.runner.${taskRunner}`;
            const eePath = `/plugins/plugin-ee-${plugin.base}/io.kestra.plugin.ee.${plugin.base}.runner.${taskRunner}`;

            if (to?.path === standardPath) {
                return eePath;
            }
        }
    }
})
