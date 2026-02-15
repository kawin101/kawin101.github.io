const isServer = typeof window === 'undefined';

const clientLogger = {
    log: async (level, message, meta = {}) => {
        const timestamp = new Date().toISOString();

        // Consistent Console Output
        const styles = {
            info: 'color: #007bff; font-weight: bold;',
            warn: 'color: #ffc107; font-weight: bold;',
            error: 'color: #dc3545; font-weight: bold;'
        };

        if (isServer) {
            // Server-side console (Next.js server logs)
            console.log(`[${level.toUpperCase()}] ${message}`, meta ? JSON.stringify(meta) : '');
        } else {
            // Browser console
            console.log(`%c[${level.toUpperCase()}]`, styles[level] || '', message, meta);

            // Send to Server API
            try {
                await fetch('/api/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ level, message, meta, timestamp }),
                });
            } catch (err) {
                // Fail silently
                console.error('Failed to send log to server:', err);
            }
        }
    },
    info: (message, meta) => clientLogger.log('info', message, meta),
    warn: (message, meta) => clientLogger.log('warn', message, meta),
    error: (message, meta) => clientLogger.log('error', message, meta),
};

export default clientLogger;
