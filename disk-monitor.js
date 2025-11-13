import si from 'systeminformation';
import chalk from 'chalk';
import Table from 'cli-table2';

export async function monitorDisk() {
    const disks = await si.fsSize();

    const table = new Table({
        head: [chalk.magenta('Filesystem'), chalk.magenta('Size'), chalk.magenta('Used'), chalk.magenta('Available'), chalk.magenta('Use%'), chalk.magenta('Mount')],
        colWidths: [10, 12, 12, 12, 10, 20]
    });

    function formatBytes(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 B';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    function getUsageBar(percentage, width = 10) {
        const filled = Math.round((percentage / 100) * width);
        const empty = width - filled;
        return '█'.repeat(filled) + '░'.repeat(empty);
    }

    disks.forEach(disk => {
        const usagePercent = (disk.use || 0);
        let usageColor = chalk.green;
        if (usagePercent > 80) usageColor = chalk.red;
        else if (usagePercent > 60) usageColor = chalk.yellow;

        table.push([
            chalk.white(disk.fs),
            chalk.blue(formatBytes(disk.size)),
            chalk.red(formatBytes(disk.used)),
            chalk.green(formatBytes(disk.available)),
            usageColor(`${usagePercent.toFixed(1)}%`) + '\n' + usageColor(getUsageBar(usagePercent)),
            chalk.gray(disk.mount)
        ]);
    });

    return table.toString();
}