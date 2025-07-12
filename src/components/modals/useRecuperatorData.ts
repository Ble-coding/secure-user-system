
import { useQuery } from "@tanstack/react-query"
import { parentService } from "@/lib/api/parents"
import { childService } from "@/lib/api/children"
import { Child } from "@/lib/api/types"

export function useRecuperatorData() {
  // Récupérer la liste des parents pour le select (plus efficace)
  const { data: parentsResponse } = useQuery({
    queryKey: ['parents', 'select'],
    queryFn: () => parentService.getSelectList("", 1),
  })

  const parents = parentsResponse?.data?.parent || []

  const getAvailableChildren = (selectedParentId: number | null) => {
    // Trouver le parent sélectionné pour obtenir son code
    const selectedParent = parents.find(p => p.id === selectedParentId)
    
    // Hook pour récupérer les enfants du parent sélectionné
    const { data: childrenData = [] } = useQuery({
      queryKey: ['children', 'by-parent', selectedParent?.code],
      queryFn: () => selectedParent ? childService.getByParent(selectedParent.code) : Promise.resolve([]),
      enabled: !!selectedParent,
    })

    return childrenData
  }

  return {
    parents,
    getAvailableChildren
  }
}
