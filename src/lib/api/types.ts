
// Types pour les entités basés sur les modèles Laravel
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Actif' | 'Inactif';
  lastLogin: string;
  phone?: string;
}

export interface Agent {
  id: number;
  first_name: string;
  last_name: string;
  code: string;
  email: string;
  phone: string;
  type: string; // "enseignant", "surveillant", "sécurité"
  status: 'En service' | 'Hors service' | 'En pause';
  date_naissance?: string;
  sexe?: string;
  ville?: string;
  photo?: string;
  document_type?: string;
  document_numero?: string;
  document_file?: string;
  first_login?: boolean;
  pin_encrypted?: string;
  user_id?: number;
}

export interface ParentUser {
  id: number;
  nom: string;
  prenom: string;
  code: string;
  email: string;
  telephone: string;
  adresse: string;
  children: Child[];
  status: 'Actif' | 'Inactif';
  date_naissance?: string;
  photo?: string;
  sexe?: string;
  ville?: string;
  document_type?: string;
  document_numero?: string;
  document_file?: string;
  first_login?: boolean;
  pin_encrypted?: string;
  user_id?: number;
}

export interface Child {
  id: number;
  parent_id: number;
  first_name: string;
  last_name: string;
  code: string;
  gender: string;
  date_of_birth: string;
  photo?: string;
  class: string;
  enrolled_at?: string;
  status: 'Présent' | 'Absent' | 'Récupéré';
}

export interface Recuperator {
  id: number;
  parent_id: number;
  first_name: string;
  last_name: string;
  code: string;
  phone: string;
  relation_type: string;
  document_type?: string;
  document_file?: string;
  photo?: string;
  is_active: boolean;
  authorizedChildren: number[];
  status: 'Actif' | 'Inactif';
  identity_confirmation_at?: string;
  first_login?: boolean;
  pin_encrypted?: string;
  user_id?: number;
}

export interface ChildEntry {
  id: number;
  child_id: number;
  recuperator_id?: number;
  agent_id: number;
  type: 'entry' | 'exit';
  scanned_at: string;
  user_id?: number;
}

export interface Entry {
  id: number;
  childId: number;
  recuperatorId?: number;
  agentId: number;
  entryTime: string;
  status: 'Entrée' | 'Sortie';
  notes?: string;
}

// Compatibilité avec l'ancien type Parent
export type Parent = ParentUser;
