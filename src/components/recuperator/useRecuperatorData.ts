import { useQuery } from "@tanstack/react-query"
import { recuperatorService } from "@/lib/api/recuperators"
import { childService } from "@/lib/api/children"
import { useState } from "react"
import { ApiResponse } from "@/types/api"
import { ParentUser } from "@/types/Parent"

export function useRecuperatorData(selectedParentCode?: string | null) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  // 🔍 Liste paginée de parents
  const { data: parentsResponse } = useQuery({
    queryKey: ["parents", "select", search, page],
    queryFn: () => recuperatorService.getParentsSelect(page, search),
    placeholderData: () => ({
      status: true,
      message: "Chargement...",
      data: {
        parents: [],
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0,
        new_this_month: 0,
        total_actifs: 0,
        total_inactifs: 0,
      },
    }),
  })

  const parents = parentsResponse?.data?.parents || []

  // 🟢 Récupérer le parent sélectionné s’il est manquant dans la page
  // const selectedParentInPage = parents.find((p) => p.code === selectedParentCode)
  const selectedParentInPage = parents.find((p) =>
  p.code?.toLowerCase() === selectedParentCode?.toLowerCase()
)
  // const { data: selectedParentData } = useQuery({
  //   queryKey: ["parents", "single", selectedParentCode],
  //   queryFn: () => recuperatorService.getParentByCode(selectedParentCode!),
  //   enabled: !!selectedParentCode && !selectedParentInPage,
  // })

const { data: selectedParentData } = useQuery<ParentUser>({
  queryKey: ["parents", "single", selectedParentCode],
  queryFn: () => recuperatorService.getParentByCode(selectedParentCode!),
  enabled: !!selectedParentCode && !selectedParentInPage,
});


// const { data: selectedParentData } = useQuery<ParentUser>({
//   queryKey: ["parents", "single", selectedParentCode],
//   queryFn: () => recuperatorService.getParentByCode(selectedParentCode!),
//   enabled: !!selectedParentCode && !selectedParentInPage,
// })


// const { data: selectedParentResponse } = useQuery<ApiResponse<ParentUser>>({
//   queryKey: ["parents", "single", selectedParentCode],
//   queryFn: () => recuperatorService.getParentByCode(selectedParentCode!),
//   enabled: !!selectedParentCode && !selectedParentInPage,
// })

// const selectedParentData = selectedParentResponse?.data



  const extraParent = selectedParentData
  const fullParents = extraParent
    ? [extraParent, ...parents.filter((p) => p.code !== extraParent.code)]
    : parents

  // 👶 Enfants d’un parent
  const useAvailableChildren = (parentCode: string | null) => {
    return useQuery({
      queryKey: ["children", "by-parent", parentCode],
      queryFn: () => childService.getAllByParentCode(parentCode!),
      enabled: !!parentCode,
    })
  }

  return {
    parents: fullParents,
    selectedParentData,
    search,
    setSearch,
    setPage,
    useAvailableChildren,
  }
}
