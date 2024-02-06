//import { ApplicationType } from './application.interface';
import { PaginationType } from "./pagination.interface";
import { MiniKpiClassType, SortedStepsType } from "./MiniKpi";
import { User, UserToCreate, newUser, UserRole } from "./user";
import {
  ProgramType,
  NewProgram,
  DocumentType,
  ModalidadType,
  ElegibilidadType,
} from "./programType";
import { CurpType, NewCurp } from "./CurpType";
import { SelectOptionType } from "./selectOptionType";
import { ControlStepperRequestEventType } from "./ControlStepperRequestEventType";
import { Ventanilla, newVentanilla } from "./office.interface";
import { roleType } from "./roleType";
import { ApplicationType } from "./application.interface";
import { Role, RoleRequirement, RoleRequirementsOptions } from "./role.type";
import { DependencyType } from "./dependency.type";
import { PermissionType } from "./PermissionType";
import { MiniKpiDetailModality } from "./MiniKpiDetailModality";
import { DynamicFieldType } from "./dynamicField.interface";
import { DateRangeType, DateType } from "./date.type";

export {
  // ApplicationType,
  PaginationType,
  User,
  ProgramType,
  DocumentType,
  ModalidadType,
  ElegibilidadType,
  CurpType,
  SelectOptionType,
  ControlStepperRequestEventType,
  //DependencyType,
  Ventanilla,
  UserToCreate,
  NewCurp,
  NewProgram,
  newVentanilla,
  newUser,
  roleType,
  ApplicationType,
  SortedStepsType,
  MiniKpiClassType,
  Role,
  RoleRequirement,
  RoleRequirementsOptions,
  DependencyType,
  PermissionType,
  UserRole,
  MiniKpiDetailModality,
  DynamicFieldType,
  DateRangeType,
  DateType,
};
