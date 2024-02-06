export type Role = {
    _id: string,
    name: string,
    description: string,
    key:string,
    roleActions?: Array<string>,
    requirements?: Array<RoleRequirement>
}

export type RoleRequirement = { name: RoleRequirementsOptions, description: string, isMultiple: boolean }

export type RoleRequirementsOptions = 'dependencias' | 'clavesQ' | 'modalidades' | 'regiones' | 'apoyos'