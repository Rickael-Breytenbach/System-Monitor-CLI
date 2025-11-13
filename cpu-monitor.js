import os from 'os';
import osUtils from 'os-utils';
import si from 'systeminformation';
import chalk from 'chalk';
import Table from 'cli-table2';

export async function monitorSystem() {
    return new Promise((resolve) => {
        osUtils.cpuUsage(async (cpuUsage) => {
            const table = new Table({
                head: [chalk.blue('Metric'), chalk.blue('Value')],
                colWidths: [25, 50]
            });

            // CPU Information
            const cpus = os.cpus();
            table.push(
                [chalk.white('CPU Usage'), chalk.green(`${(cpuUsage * 100).toFixed(2)}%`)],
                [chalk.white('CPU Cores'), chalk.white(cpus.length)],
                [chalk.white('CPU Model'), chalk.white(cpus[0].model)],
                [chalk.white('Architecture'), chalk.white(os.arch())],
                [chalk.white('Platform'), chalk.white(os.platform())],
                [chalk.white('Uptime'), chalk.white(formatUptime(os.uptime()))],
                [chalk.white('Load Average'), chalk.white(os.loadavg().map(l => l.toFixed(2)).join(', '))]
            );

            // System Information
            const osInfo = await si.osInfo();
            table.push(
                [chalk.white('OS'), chalk.white(`${osInfo.distro} ${osInfo.release}`)],
                [chalk.white('Kernel'), chalk.white(osInfo.kernel)]
            );

            resolve(table.toString());
        });
    });
}

function formatUptime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    return `${days}d ${hours}h ${minutes}m`;
}