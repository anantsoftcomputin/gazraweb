import { useCallback, useEffect, useState } from 'react';
import { useFirestore } from './useFirestore';

export const useAdminCollectionPage = (collectionName, pageSize = 25) => {
  const { getDocumentsPage, getCount } = useFirestore(collectionName);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [cursors, setCursors] = useState([null]);

  const loadPage = useCallback(async (pageIndex = 0, cursorList = cursors) => {
    setLoading(true);
    const [result, countResult] = await Promise.all([
      getDocumentsPage({ pageSize, cursor: cursorList[pageIndex] || null }),
      getCount()
    ]);
    if (result.success) {
      setItems(result.data);
      setHasMore(result.hasMore);
      setCursors((current) => {
        const next = [...current];
        if (result.cursor) next[pageIndex + 1] = result.cursor;
        return next;
      });
      setPage(pageIndex + 1);
    }
    if (countResult.success) setTotal(countResult.count);
    setLoading(false);
  }, [getCount, getDocumentsPage, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadPage(0, [null]); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    items, loading, page, total, pageSize, hasMore,
    nextPage: () => hasMore && loadPage(page, cursors),
    previousPage: () => page > 1 && loadPage(page - 2, cursors),
    refresh: () => loadPage(page - 1, cursors)
  };
};
