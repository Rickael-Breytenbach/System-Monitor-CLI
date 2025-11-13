import os from 'os';
import si from 'systeminformation';
import chalk from 'chalk';
import Table from 'cli-table2';

export async function monitorMemory() {
    const mem = os.totalmem() - os.freemem();
    const totalMem = os.totalmem();
    const memoryUsage = (mem / totalMem) * 100;

    const memInfo = await si.mem();

    const table = new Table({
        head: [chalk.green('Memory Type'), chalk.green('Total'), chalk.green('Used'), chalk.green('Free'), chalk.green('Usage')],
        colWidths: [15, 15, 15, 15, 20]
    });

    function formatBytes(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 B';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    function getUsageBar(percentage, width = 20) {
        const filled = Math.round((percentage / 100) * width);
        const empty = width - filled;
        return '█'.repeat(filled) + '░'.repeat(empty);
    }

    table.push(
        [
            chalk.white('RAM'),
            chalk.blue(formatBytes(totalMem)),
            chalk.red(formatBytes(mem)),
            chalk.green(formatBytes(os.freemem())),
            chalk.yellow(`${memoryUsage.toFixed(2)}%`) + '\n' + 
            chalk.cyan(getUsageBar(memoryUsage))
        ]
    );

    if (memInfo && memInfo.swaptotal > 0) {
        const swapUsed = memInfo.swapused;
        const swapTotal = memInfo.swaptotal;
        const swapUsage = (swapUsed / swapTotal) * 100;
        
        table.push(
            [
                chalk.white('Swap'),
                chalk.blue(formatBytes(swapTotal)),
                chalk.red(formatBytes(swapUsed)),
                chalk.green(formatBytes(swapTotal - swapUsed)),
                chalk.yellow(`${swapUsage.toFixed(2)}%`) + '\n' + 
                chalk.magenta(getUsageBar(swapUsage))
            ]
        );
    }

    return table.toString();
}