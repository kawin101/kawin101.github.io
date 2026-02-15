import winston from 'winston';

const winstonLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.errors({ stack: true })
    ),
    defaultMeta: { service: 'ats-optimizer-service' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Add File transport if needed for persistent logs
        new winston.transports.File({ filename: 'ats-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'ats-combined.log' }),
    ],
});

export default winstonLogger;
