import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdminPager = ({ page, pageSize, total, hasMore, onPrevious, onNext }) => {
  if (total <= pageSize) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
      <span>Showing {start}–{end} of {total}</span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={onPrevious} disabled={page === 1}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        <span className="px-2 font-medium">Page {page}</span>
        <button type="button" onClick={onNext} disabled={!hasMore}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 disabled:opacity-40">
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminPager;
