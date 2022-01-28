import { AlgoliaStory } from '@prezly/libs/types';
import type { Story } from '@prezly/sdk';

export function getStoryPublicationDate(story: Story | AlgoliaStory): Date | null {
    const { published_at } = story;

    if (!published_at) {
        return null;
    }

    return typeof published_at === 'string'
        ? new Date(published_at)
        : new Date(published_at * 1000);
}
