import si from 'systeminformation';
import chalk from 'chalk';
import Table from 'cli-table2';

let previousStats = {};

export async function monitorNetwork() {
    const networks = await si.networkStats();
    const currentTime = Date.now();

    const table = new Table({
        head: [chalk.yellow('Interface'), chalk.yellow('Rx Speed'), chalk.yellow('Tx Speed'), chalk.yellow('Total Rx'), chalk.yellow('Total Tx')],
        colWidths: [12, 15, 15, 15, 15]
    });

    function formatSpeed(bytes, previousBytes, timeDiff) {
        if (!previousBytes || !timeDiff) return '0 B/s';
        const bits = (bytes - previousBytes) * 8;
        const speed = bits / (timeDiff / 1000);
        
        const sizes = ['b/s', 'Kb/s', 'Mb/s', 'Gb/s'];
        if (speed === 0) return '0 b/s';
        const i = parseInt(Math.floor(Math.log(speed) / Math.log(1024)));
        return Math.round(speed / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    function formatBytes(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 B';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    networks.forEach(network => {
        const iface = network.iface;
        const previous = previousStats[iface];
        const timeDiff = previous ? currentTime - previous.time : 0;

        const rxSpeed = formatSpeed(network.rx_bytes, previous ? previous.rx_bytes : null, timeDiff);
        const txSpeed = formatSpeed(network.tx_bytes, previous ? previous.tx_bytes : null, timeDiff);

        table.push([
            chalk.white(iface),
            chalk.green(rxSpeed),
            chalk.red(txSpeed),
            chalk.blue(formatBytes(network.rx_bytes)),
            chalk.magenta(formatBytes(network.tx_bytes))
        ]);

        // Store current stats for next calculation
        previousStats[iface] = {
            rx_bytes: network.rx_bytes,
            tx_bytes: network.tx_bytes,
            time: currentTime
        };
    });

    return table.toString();
}