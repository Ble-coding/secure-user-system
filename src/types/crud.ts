export interface CommonFields {
  first_name: string
  last_name: string
  email?: string
  phone?: string
}

export interface Agent extends CommonFields {
  type: 'enseignant' | 'surveillant' | 'sécurité'
}

export interface Parent extends Omit<CommonFields, 'first_name' | 'last_name'> {
  nom: string
  prenom: string
  telephone: string
  adresse?: string
}

export interface Child extends CommonFields {
  gender: "M" | "F"
  date_of_birth: string
  class?: string
}

export interface Recuperator extends CommonFields {
  relation_type: string
}

export type Entity = 'agent' | 'parent' | 'child' | 'recuperator'

export type EntityTypeMap = {
  agent: Agent
  parent: Parent
  child: Child
  recuperator: Recuperator
}

export type CrudEntityData = Agent | Parent | Child | Recuperator


// === Type guards pour les entités ===

export function isAgent(entity: Entity, data: Partial<CrudEntityData>): data is Agent {
  return entity === 'agent' && 'type' in data
}

export function isParent(entity: Entity, data: Partial<CrudEntityData>): data is Parent {
  return entity === 'parent' && 'prenom' in data
}

export function isChild(entity: Entity, data: Partial<CrudEntityData>): data is Child {
  return entity === 'child' && 'gender' in data
}

export function isRecuperator(entity: Entity, data: Partial<CrudEntityData>): data is Recuperator {
  return entity === 'recuperator' && 'relation_type' in data
}


export interface CommonFields {
  first_name: string
  last_name: string
  email?: string
  phone?: string
}
