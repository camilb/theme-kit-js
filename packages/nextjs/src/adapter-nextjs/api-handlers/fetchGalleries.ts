import { assertServerEnv } from '@prezly/theme-kit-core';
import type { NextApiRequest, NextApiResponse } from 'next';

import { getNextPrezlyApi } from '../../data-fetching';

export async function fetchGalleries(req: NextApiRequest, res: NextApiResponse) {
    assertServerEnv('fetchGalleries');

    if (req.method !== 'POST') {
        res.status(405);
        return;
    }

    const { page, pageSize, type } = req.body;

    try {
        const api = getNextPrezlyApi(req);

        const { galleries, pagination } = await api.getGalleries({ page, pageSize, type });

        res.status(200).json({ galleries, galleriesTotal: pagination.matched_records_number });
    } catch (error) {
        res.status(500).send({
            message: (error as Error).message,
        });
    }
}
