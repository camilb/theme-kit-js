import { assertServerEnv } from '@prezly/theme-kit-core';
import type { NextApiRequest, NextApiResponse } from 'next';

import { getNextPrezlyApi } from '../../data-fetching';

export async function fetchStories(req: NextApiRequest, res: NextApiResponse) {
    assertServerEnv('fetchStories');

    if (req.method !== 'POST') {
        res.status(405);
        return;
    }

    const {
        page,
        pageSize,
        withHighlightedStory,
        category,
        include,
        localeCode,
        pinning,
        filterQuery,
    } = req.body;

    try {
        const api = getNextPrezlyApi(req);

        const { stories, storiesTotal } = await (category
            ? api.getStoriesFromCategory(category, { page, pageSize, include, localeCode })
            : api.getStories({
                  page,
                  pageSize,
                  include,
                  localeCode,
                  withHighlightedStory,
                  pinning,
                  filterQuery,
              }));

        res.status(200).json({ stories, storiesTotal });
    } catch (error) {
        res.status(500).send({
            message: (error as Error).message,
        });
    }
}
