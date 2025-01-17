import { useCallback, useEffect, useState } from 'react';

import { useAsync } from './lib';
import type { PaginationProps } from './types';

interface Parameters<T> {
    fetchingFn: (page: number, pageSize: number) => Promise<T[]>;
    initialData: T[];
    pagination: PaginationProps;
}

interface State<T> {
    canLoadMore: boolean;
    currentPage: number;
    data: T[];
    isLoading: boolean;
    loadMore: () => void;
    resetData: () => void;
}

export function useInfiniteLoading<T>({
    fetchingFn,
    initialData,
    pagination,
}: Parameters<T>): State<T> {
    const [data, setData] = useState<T[]>(initialData);
    const [currentPage, setCurrentPage] = useState(pagination.currentPage);

    const { itemsTotal, pageSize, withHighlightedStory } = pagination;
    const adjustedItemsTotal = withHighlightedStory ? itemsTotal - 1 : itemsTotal;
    const pagesTotal = Math.ceil(adjustedItemsTotal / pageSize);
    const canLoadMore = currentPage < pagesTotal;

    const [{ error, status }, { execute: loadMoreFn }] = useAsync(async () => {
        const nextPage = currentPage + 1;
        const newData = await fetchingFn(nextPage, pageSize);
        setCurrentPage(nextPage);
        setData((currentData) => [...currentData, ...newData]);
    });

    const loadMore = useCallback(() => {
        if (canLoadMore) {
            loadMoreFn();
        }
    }, [canLoadMore, loadMoreFn]);

    const resetData = useCallback(() => {
        setData(initialData);
        setCurrentPage(pagination.currentPage);
    }, [pagination.currentPage, initialData]);

    useEffect(() => {
        if (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }, [error]);

    return {
        canLoadMore,
        currentPage,
        data,
        isLoading: status === 'loading',
        loadMore,
        resetData,
    };
}
