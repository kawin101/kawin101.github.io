import { NextResponse } from 'next/server';
import { atsHistoryService } from '../../../../lib/ats-history-service';
import winstonLogger from '../../../../lib/winston-logger';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const history = await atsHistoryService.getAll();
        return NextResponse.json(history);
    } catch (error) {
        winstonLogger.error('API GET History Error', { error: error.message });
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        // Validate basic requirements
        if (!body.analysis || typeof body.score !== 'number') {
            return NextResponse.json({ error: 'Invalid analysis data' }, { status: 400 });
        }

        const savedRecord = await atsHistoryService.save(body);
        return NextResponse.json(savedRecord);
    } catch (error) {
        winstonLogger.error('API POST History Error', { error: error.message });
        return NextResponse.json({ error: 'Failed to save history' }, { status: 500 });
    }
}
