import { NextResponse } from 'next/server';
import { atsHistoryService } from '../../../../../lib/ats-history-service';
import winstonLogger from '../../../../../lib/winston-logger';

export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const success = await atsHistoryService.delete(id);

        if (!success) {
            return NextResponse.json({ error: 'History not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        winstonLogger.error('API DELETE History Error', { error: error.message });
        return NextResponse.json({ error: 'Failed to delete history' }, { status: 500 });
    }
}
