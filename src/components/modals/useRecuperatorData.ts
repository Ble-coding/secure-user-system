
import { useQuery } from "@tanstack/react-query"
import { parentService } from "@/lib/api/parents"
import { childService } from "@/lib/api/children"
import { Child } from "@/lib/api/types"

export function useRecuperatorData() {
  // Récupérer la liste des parents
  const { data: parentsResponse } = useQuery({
    queryKey: ['parents', 'all'],
    queryFn: () => parentService.getAll(1, "", ""),
  })

  // Récupérer la liste des enfants
  const { data: childrenResponse } = useQuery({
    queryKey: ['children', 'all'],
    queryFn: () => childService.getAll(),
  })

  const parents = parentsResponse?.data?.parent || []
  const allChildren = childrenResponse || []

  const getAvailableChildren = (selectedParentId: number | null) => {
    return selectedParentId 
      ? allChildren.filter((child: Child) => child.parent_id === selectedParentId)
      : []
  }

  return {
    parents,
    allChildren,
    getAvailableChildren
  }
}
