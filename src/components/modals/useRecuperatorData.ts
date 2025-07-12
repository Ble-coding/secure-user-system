
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

  const parents = parentsResponse?.data?.parent || []

  // Pour récupérer tous les enfants, nous devons les récupérer via chaque parent
  const { data: allChildren = [] } = useQuery({
    queryKey: ['children', 'all', parents.map(p => p.id).join(',')],
    queryFn: async () => {
      if (parents.length === 0) return []
      
      const childrenPromises = parents.map(parent => 
        childService.getByParent(parent.code).catch(() => [])
      )
      
      const childrenArrays = await Promise.all(childrenPromises)
      return childrenArrays.flat()
    },
    enabled: parents.length > 0,
  })

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
