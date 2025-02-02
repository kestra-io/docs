export default function ({ route, redirect }) {
    const plugins = [
        { base: 'kubernetes', taskRunners: ['kubernetes'] },
        { base: 'aws', taskRunners: ['batch'] },
        { base: 'gcp', taskRunners: ['batch', 'cloudrun'] },
        { base: 'azure', taskRunners: ['batch'] },
    ];

    plugins.forEach(plugin => {
        plugin.taskRunners.forEach(taskRunner => {
            const standardPath = `/plugins/plugin-${plugin.base}/task-runners/io.kestra.plugin.${plugin.base}.runner.${taskRunner}`;
            const eePath = `/plugins/plugin-ee-${plugin.base}/task-runners/io.kestra.plugin.ee.${plugin.base}.runner.${taskRunner}`;

            if (route?.path === standardPath) {
                return redirect(eePath);
            }
        });
    });
}
