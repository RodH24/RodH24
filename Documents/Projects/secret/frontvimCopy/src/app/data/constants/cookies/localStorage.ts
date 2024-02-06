import { environment } from "@env/environment";
const HASH = environment.VIM_COOKIES_HASH;

export const LocalStorage = {
  SESSION_PERMISSIONS: HASH + "_LOCAL_1",
  SESSION_ROLES: HASH + "_LOCAL_2",
  SESSION_VIEWINGDATE: HASH + "_LOCAL_3",
  FILTERS_APOYO: HASH + "_LOCAL4",
};
