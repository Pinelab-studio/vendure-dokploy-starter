import {
    HealthIndicatorFunction
} from '@nestjs/terminus';
import { HealthCheckStrategy, Injector } from '@vendure/core';

/**
 * Fetch CPU, disk usage and memory usage from Dokploy API and check if they are within the limits.
 */
export class DokployHealthCheckStrategy implements HealthCheckStrategy {
    constructor(private options: {
        maxDiskPercent: number,
        maxCpuPercent: number,
        maxMemoryPercent: number,
        apiKey: string,
        dokployHost: string,
    }) {
    }

    init(_injector: Injector): void { }

    getHealthIndicator(): HealthIndicatorFunction {

        return async (): Promise<DokployHealth> => {

            const url = new URL(`https://${this.options.dokployHost}/api/application.readAppMonitoring?appName=dokploy`);
            const res = await fetch(url.toString(), {
                headers: {
                    Accept: 'application/json',
                    'x-api-key': this.options.apiKey,
                },
            });
            if (!res.ok) {
                return {
                    cpu: { status: 'down', message: `Failed to fetch Dokploy metrics: ${res.statusText}` },
                }
            }

            const data: DokployMetrics = (await res.json()) as DokployMetrics;

            // Check disk usage
            const diskUsed = data.disk[data.disk.length - 1].value.diskUsedPercentage;
            if (diskUsed > this.options.maxDiskPercent) {
                return {
                    disk: { status: 'down', message: `Disk usage above ${this.options.maxDiskPercent}%` },
                }
            }
            // Check CPU usage
            const cpuUsage = parseFloat(data.cpu[data.cpu.length - 1].value);
            if (cpuUsage > this.options.maxCpuPercent) {
                return {
                    cpu: { status: 'down', message: `CPU usage above ${this.options.maxCpuPercent}%` },
                }
            }
            // Check memory usage
            const { total, used } = data.memory[data.memory.length - 1].value;
            const memUsedPercentage = parseFloat(used) / parseFloat(total) * 100;
            if (memUsedPercentage > this.options.maxMemoryPercent) {
                return {
                    memory: { status: 'down', message: `Memory usage above ${this.options.maxMemoryPercent}% (${used} of ${total})` },
                }
            }

            return { 
                disk: { status: 'up' as const }, 
                cpu: { status: 'up' as const }, 
                memory: { status: 'up' as const } 
            };
        };
    }
}

type DokployHealth = {
    disk?: {
        status: 'up' | 'down';
        message?: string;
    };
    cpu?: {
        status: 'up' | 'down';
        message?: string;
    };
    memory?: {
        status: 'up' | 'down';
        message?: string;
    };
};

export type DokployMetrics = {
    cpu: Array<{
        value: string; // e.g., "2.56%"
        time: string;  // ISO timestamp
    }>;
    memory: Array<{
        value: {
            used: string;  // e.g., "1.57GiB"
            total: string; // e.g., "3.82GiB"
        };
        time: string; // ISO timestamp
    }>;
    disk: Array<{
        value: {
            diskTotal: number;            // e.g., 47.39
            diskUsedPercentage: number;   // e.g., 23.69
            diskUsage: number;            // e.g., 11.23
            diskFree: number;             // e.g., 36.15
        };
        time: string; // ISO timestamp
    }>;
};