import { NextResponse } from 'next/server';
import winstonLogger from '../../../lib/winston-logger';

export async function POST(request) {
    try {
        const body = await request.json();
        const { level, message, meta, timestamp } = body;

        // Log using server-side Winston instance
        // We add 'source: client' to distinguish from server-generated logs
        winstonLogger.log({
            level: level || 'info',
            message: message || 'No message provided',
            meta: { ...meta, source: 'client_browser', originalTimestamp: timestamp }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing client log:', error);
        return NextResponse.json({ success: false, error: 'Failed to process log' }, { status: 500 });
    }
}
