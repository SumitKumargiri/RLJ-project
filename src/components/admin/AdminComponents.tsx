import { icon } from "../common/Icon";

export function AdminPageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 border-b border-gray-200 pb-5">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
        Admin dashboard
      </p>
      <h2 className="mt-1 text-2xl font-black font-sans uppercase tracking-tight text-brand-dark">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-600 font-inter">{description}</p>
    </div>
  );
}

export function AdminPagination({
  page,
  pages,
  setPage,
}: {
  page: number;
  pages: number;
  setPage: (page: number) => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-between rounded border border-gray-200 bg-white p-3 text-xs text-gray-500">
      <span>
        Page {page} of {pages}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage(Math.max(1, page - 1))}
          className="rounded border border-gray-300 px-3 py-1.5 font-bold disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page === pages}
          onClick={() => setPage(Math.min(pages, page + 1))}
          className="rounded border border-gray-300 px-3 py-1.5 font-bold disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function AdminEmpty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded border border-gray-200 bg-white p-8 text-center shadow-sm">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-brand-red">
        {icon("fa-magnifying-glass")}
      </span>
      <h3 className="mt-4 font-black uppercase text-brand-dark">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
    </div>
  );
}

export default AdminPageHeader;
