
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { childService, ChildWithRelations } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { ChildrenStats } from "@/components/children/ChildrenStats"
import { ChildrenFilters } from "@/components/children/ChildrenFilters"
import { ChildrenTable } from "@/components/children/ChildrenTable"
import { ChildDetailModal } from "@/components/children/ChildDetailModal"
import { ChildrenPagination } from "@/components/children/ChildrenPagination"

export default function Children() {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [entryFilter, setEntryFilter] = useState<"all" | "entry" | "exit">("all")
  const [genderFilter, setGenderFilter] = useState<"all" | "M" | "F">("all")
  const [classFilter, setClassFilter] = useState("")
  const [selectedChild, setSelectedChild] = useState<ChildWithRelations | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const { toast } = useToast()

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['children-with-relations', page, searchTerm],
    queryFn: () => childService.getAllWithRelations(page, searchTerm),
    staleTime: 0,
    refetchOnMount: true,
  })

  const children = response?.data?.children ?? []
  const pagination = {
    currentPage: response?.data?.current_page ?? 1,
    lastPage: response?.data?.last_page ?? 1,
    perPage: response?.data?.per_page ?? 15,
    total: response?.data?.total ?? 0,
  }

  const filteredChildren = children.filter((child: ChildWithRelations) => {
    // Filter by activity status
    if (entryFilter !== "all") {
      const lastActivity = child.last_activities?.[0]
      if (!lastActivity) return false
      if (lastActivity.type !== entryFilter) return false
    }

    // Filter by gender
    if (genderFilter !== "all" && child.gender !== genderFilter) {
      return false
    }

    // Filter by class
    if (classFilter && child.class && !child.class.toLowerCase().includes(classFilter.toLowerCase())) {
      return false
    }

    return true
  })

  const handleViewDetails = (child: ChildWithRelations) => {
    setSelectedChild(child)
    setIsDetailModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-destructive">Erreur lors du chargement des enfants</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Liste des Enfants</h1>
          <p className="text-muted-foreground">Consultez tous les enfants avec leurs détails</p>
        </div>
      </div>

      {/* Stats Cards */}
      <ChildrenStats children={children} totalCount={pagination.total} />

      {/* Children Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Enfants</CardTitle>
          <CardDescription>
            Consultez tous les enfants avec leurs parents et récupérateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChildrenFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            entryFilter={entryFilter}
            setEntryFilter={setEntryFilter}
            genderFilter={genderFilter}
            setGenderFilter={setGenderFilter}
            classFilter={classFilter}
            setClassFilter={setClassFilter}
          />

          <ChildrenTable
            children={filteredChildren}
            onViewDetails={handleViewDetails}
          />

          <ChildrenPagination
            pagination={pagination}
            onPageChange={setPage}
          />

          {filteredChildren.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun enfant trouvé avec les filtres appliqués</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <ChildDetailModal
        child={selectedChild}
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
      />
    </div>
  )
}
