import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';
import { monitorSystem } from './lib/cpu-monitor.js';
import { monitorMemory } from './lib/memory-monitor.js';
import { monitorDisk } from './lib/disk-monitor.js';
import { monitorNetwork } from './lib/network-monitor.js';
import { monitorProcesses } from './lib/process-monitor.js';

class SystemMonitor {
    constructor() {
        this.updateInterval = 2000; // 2 seconds
        this.isRunning = false;
    }

    async initialize() {
        clear();
        this.showBanner();
        await this.startMonitoring();
    }

    showBanner() {
        console.log(
            chalk.blue(
                figlet.textSync('System Monitor', { horizontalLayout: 'full' })
            )
        );
        console.log(chalk.yellow('        Real-time System Performance Monitor\n'));
    }

    async startMonitoring() {
        this.isRunning = true;
        
        while (this.isRunning) {
            try {
                clear();
                this.showBanner();
                
                // Run all monitoring functions in parallel
                await Promise.all([
                    this.displayCpuStats(),
                    this.displayMemoryStats(),
                    this.displayDiskStats(),
                    this.displayNetworkStats(),
                    this.displayProcessStats()
                ]);

                // Show help information
                this.showHelp();

                // Wait before next update
                await new Promise(resolve => setTimeout(resolve, this.updateInterval));
                
            } catch (error) {
                console.error(chalk.red('Monitoring error:'), error);
                break;
            }
        }
    }

    async displayCpuStats() {
        const stats = await monitorSystem();
        console.log(chalk.cyan('\n🖥️  CPU & SYSTEM INFORMATION'));
        console.log(stats);
    }

    async displayMemoryStats() {
        const stats = await monitorMemory();
        console.log(chalk.green('\n💾 MEMORY USAGE'));
        console.log(stats);
    }

    async displayDiskStats() {
        const stats = await monitorDisk();
        console.log(chalk.magenta('\n💿 DISK USAGE'));
        console.log(stats);
    }

    async displayNetworkStats() {
        const stats = await monitorNetwork();
        console.log(chalk.yellow('\n🌐 NETWORK STATISTICS'));
        console.log(stats);
    }

    async displayProcessStats() {
        const stats = await monitorProcesses();
        console.log(chalk.red('\n📊 TOP PROCESSES'));
        console.log(stats);
    }

    showHelp() {
        console.log(chalk.gray('\n──────────────────────────────────────────────────────────'));
        console.log(chalk.white('Press ') + chalk.red('Ctrl+C') + chalk.white(' to exit • Updates every 2 seconds'));
        console.log(chalk.gray('──────────────────────────────────────────────────────────'));
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n\n🛑 System Monitor stopped.'));
    process.exit(0);
});

// Start the application
const monitor = new SystemMonitor();
monitor.initialize().catch(console.error);