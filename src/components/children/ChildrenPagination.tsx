
import { Button } from "@/components/ui/button"

interface PaginationData {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

interface ChildrenPaginationProps {
  pagination: PaginationData
  onPageChange: (page: number) => void
}

export function ChildrenPagination({ pagination, onPageChange }: ChildrenPaginationProps) {
  return (
    <div className="flex justify-between items-center mt-4 p-4">
      <div className="text-sm text-muted-foreground">
        Page {pagination.currentPage} sur {pagination.lastPage} ({pagination.total} enfants)
      </div>
      <div className="flex items-center gap-2">
        {[...Array(pagination.lastPage)].map((_, i) => {
          const pageNumber = i + 1
          return (
            <Button
              key={pageNumber}
              variant={pageNumber === pagination.currentPage ? "default" : "outline"}
              onClick={() => onPageChange(pageNumber)}
              className="px-3 py-1 h-auto text-sm"
            >
              {pageNumber}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
