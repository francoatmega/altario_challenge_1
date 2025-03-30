import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import * as os from 'os';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @SkipThrottle({ default: true })
  async check() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercent = (usedMemory / totalMemory) * 100;

    const cpus = os.cpus();
    const cpuUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      const idle = cpu.times.idle;
      return acc + ((total - idle) / total) * 100;
    }, 0) / cpus.length;

    const diskHealth = await this.disk.checkStorage('disk', {
      path: '/', // ou 'C:' no Windows
      thresholdPercent: 0.9, // alerta se passar de 90% de uso
    });

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      system: {
        uptime: os.uptime(),
        platform: os.platform(),
        arch: os.arch(),
      },
      resources: {
        memory: {
          total: totalMemory,
          free: freeMemory,
          used: usedMemory,
          usagePercent: memoryUsagePercent.toFixed(2) + '%',
        },
        cpu: {
          cores: cpus.length,
          model: cpus[0].model,
          speed: cpus[0].speed,
          usagePercent: cpuUsage.toFixed(2) + '%',
        },
      },
      disk: diskHealth,
    };
  }
}
