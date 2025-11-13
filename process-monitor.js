import si from 'systeminformation';
import chalk from 'chalk';
import Table from 'cli-table2';

export async function monitorProcesses() {
    const processes = await si.processes();

    const table = new Table({
        head: [chalk.red('PID'), chalk.red('Name'), chalk.red('CPU%'), chalk.red('Memory%'), chalk.red('Status')],
        colWidths: [8, 20, 10, 12, 12]
    });

    // Get top 10 processes by CPU usage
    const topProcesses = processes.list
        .sort((a, b) => b.cpu - a.cpu)
        .slice(0, 10);

    topProcesses.forEach(process => {
        let cpuColor = chalk.green;
        if (process.cpu > 50) cpuColor = chalk.red;
        else if (process.cpu > 20) cpuColor = chalk.yellow;

        let memColor = chalk.green;
        if (process.mem > 10) memColor = chalk.red;
        else if (process.mem > 5) memColor = chalk.yellow;

        let statusColor = chalk.green;
        if (process.state !== 'running') statusColor = chalk.gray;

        table.push([
            chalk.white(process.pid),
            chalk.blue(process.name.substring(0, 18)),
            cpuColor(process.cpu.toFixed(1)),
            memColor(process.mem.toFixed(1)),
            statusColor(process.state)
        ]);
    });

    return table.toString();
}