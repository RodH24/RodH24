import { environment } from "@env/environment";
const HASH = environment.VIM_COOKIES_HASH;

export const Cookies = {
  ROLES_NAME: HASH + "_COOKIE_0",
  AUTH_NAME: HASH + "_COOKIE_1",
  SESSION_NAME: HASH + "_COOKIE_2",
  BIGGER_MODE_COOKIE_NAME: HASH + "_COOKIE_4",
  cedulaDataCookie: HASH + "_COOKIE_5",
  programDataCookie: HASH + "_COOKIE_6",
  solicitudDataCookie: HASH + "_COOKIE_7",
  curpDataCookie: HASH + "_COOKIE_8",
  documentsDataCookie: HASH + "_COOKIE_9",
  originalSolicitud: HASH + "_COOKIE_10",
  originalCedula: HASH + "_COOKIE_11",
  originalDocumentos: HASH + "_COOKIE_12",
  editFolio: HASH + "_COOKIE_13",
};
