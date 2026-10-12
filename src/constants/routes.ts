export const INSTALLER_ROUTE = "/installer";
export const DASHBOARD_INSTALLER_ROUTE = `${INSTALLER_ROUTE}/dashboard`;
export const SUBMIT_FILE_ROUTE = `${INSTALLER_ROUTE}/submit-file`;
export const PROGRESS_TRACKING = `${INSTALLER_ROUTE}/progress_tracking`;
export const RECORD_DETAIL_INSTALLER_ROUTE = `${INSTALLER_ROUTE}/record_detail/:id`;
export const RECORD_DETAIL_CORRECTION = `${INSTALLER_ROUTE}/record_detail/:id/correction`;
export const INSTALLER_PROFILE_ROUTE = `${INSTALLER_ROUTE}/profile`;
export const INSTALLER_CONTRACT_ROUTE = `${INSTALLER_ROUTE}/contracts`;
export const INSTALLER_MESSAGING_ROUTE = `${INSTALLER_ROUTE}/messaging`;

export const CONTROLLER_ROUTE = "/controller";
export const DASHBOARD_CONTROLLER_ROUTE = `${CONTROLLER_ROUTE}/dashboard`;
export const EXPORT_MACHINE_ROUTE = `${CONTROLLER_ROUTE}/export_machine/:id/:file_type`;
export const CONTROLLER_EXPORT_MACHINE_ROUTE = `${CONTROLLER_ROUTE}/export_machine/`;
export const EXPORT_MACHINE_RESUME_ROUTE = `${CONTROLLER_ROUTE}/export_machine/:id/resume/:job_id/:form_type`;
export const HISTORY_ROUTE = `${CONTROLLER_ROUTE}/history`;
export const RECORD_DETAIL_CONTROLLER_ROUTE = `${CONTROLLER_ROUTE}/record_detail/:id`;
export const RECORD_HISTORY_DETAIL_ROUTE = `${CONTROLLER_ROUTE}/history/record_detail/:id`;
export const FILES_TO_CORRECT_ROUTE = `${CONTROLLER_ROUTE}/files-to-correct`;
export const FILES_TO_PROCESS_ROUTE = `${CONTROLLER_ROUTE}/files-to-process`;
export const FILES_VALIDATED_ROUTE = `${CONTROLLER_ROUTE}/files-validated`;
export const CONTOLLEUR_MESSAGING_ROUTE = `${CONTROLLER_ROUTE}/messaging`;

// Referent
export const REFERENT_ROUTE = "/referent";
export const REFERENT_DASHBOARD_ROUTE = `${REFERENT_ROUTE}/dashboard`;
export const REFERENT_NEW_FOLDER_ROUTE = `${REFERENT_ROUTE}/new-folder`;
export const REFERENT_FILE_MONITORING_ROUTE = `${REFERENT_ROUTE}/file-monitoring`;
export const REFERENT_MESSAGING_ROUTE = `${REFERENT_ROUTE}/messaging`;

// Admin
// history-and-activity-log
export const ADMIN_ROUTE = "/administrator";
export const ACCESS_RIGHT_CONFIGURATION_ROUTE = `${ADMIN_ROUTE}/access-rights-configuration`;
export const ADMIN_CHARGE_REPARTITION = `${ADMIN_ROUTE}/repartition-charge`;
export const ACCESS_RIGHT_CREATION_ROUTE = `${ADMIN_ROUTE}/access-rights-creation`;
export const USER_MANAGEMENT_ROUTE = `${ADMIN_ROUTE}/user`;
export const USER_CREATE_ROUTE = `${ADMIN_ROUTE}/user/create`;
export const USER_UPDATE_ROUTE = `${ADMIN_ROUTE}/user/profile`;
export const USER_TEAM_MANAGEMENT = `${ADMIN_ROUTE}/user/teams`;
export const ADMIN_HISTORY_AND_ACTIVITY_LOG = `${ADMIN_ROUTE}/history-and-activity-log`;
export const ADMIN_FILE_MONITORING_ROUTE = `${ADMIN_ROUTE}/file-monitoring`;
export const ADMIN_SCHCEDURE_MANSGEMENT_ROUTE = `${ADMIN_ROUTE}/schedule-management`;
export const ADMIN_MESSAGING_ROUTE = `${ADMIN_ROUTE}/messaging`;
export const ADMIN_DUPLICATE_FOLDERS_ROUTE = `${ADMIN_ROUTE}/duplicate-folders`;
export const ADMIN_INSTALLATER_ROUTE = `${ADMIN_ROUTE}/installater`;
export const ADMIN_CONTRACT_ROUTE = `${ADMIN_ROUTE}/contracts`;
export const ADMIN_INSTALLER_CONTRACT_ROUTE = `${ADMIN_ROUTE}/installater/details/contrat/`;
// export const ADMIN_FILE_MONITORING_DETAIL_ROUTE = `${ADMIN_ROUTE}/file-monitoring/:folder_id/file-details`;
// Head origination
export const HEAD_ORIGINATION_ROUTE = "/head-origination";
export const HEAD_ORIGINATION_DASHBOARD_ROUTE = `${HEAD_ORIGINATION_ROUTE}/dashboard`;
export const HEAD_ORIGINATION_EXPORT_MACHINE_ROUTE = `${HEAD_ORIGINATION_ROUTE}/export-machine`;
export const HEAD_ORIGINATION_FILE_TRACKIN_ROUTE = `${HEAD_ORIGINATION_ROUTE}/file-traking`;
export const HEAD_ORIGINATION_MESSAGERIE_ROUTE = `${HEAD_ORIGINATION_ROUTE}/messagerie`;
export const HEAD_ORIGINATION_NEW_FOLDER_ROUTE = `${HEAD_ORIGINATION_ROUTE}/new-folder`;
export const HEAD_ORIGINATION_CONTRACT_ROUTE = `${HEAD_ORIGINATION_ROUTE}/contracts`;

// Control non regulatory & COFRAC
export const CONTROL_ROUTE = "/controls";
export const CONTROL_NON_REGULATORY_ROUTE = `${CONTROL_ROUTE}/non-regulatory`;
export const CONTROL_NON_REGULATORY_DETAIL_ROUTE = `${CONTROL_NON_REGULATORY_ROUTE}/:id`;
export const CONTROL_COFRAC_ROUTE = `${CONTROL_ROUTE}/cofrac`;
export const CONTROL_COFRAC_MESSAGING_ROUTE = `${CONTROL_ROUTE}/messaging`;

export const LOGIN_ROUTE = "/";
export const FORGOT_PASSWORD_ROUTE = "/forgot-password";
export const NEW_PASSWORD_ROUTE = "/new-password";
export const REGISTER_ROUTE = "/register";

// Analyste
export const ANALYSTE_ROUTE = "/analyste";
export const ANALYSTE_DASHBOARD_ROUTE = `${ANALYSTE_ROUTE}/dashboard`;
export const ANALYSTE_RAPPORT = `${ANALYSTE_ROUTE}/rapports`;
export const ANALYSTE_ALERT_ANOMALIE = `${ANALYSTE_ROUTE}/alertes-anomalies`;

export const PUBLIC_ROUTES = [
  LOGIN_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  NEW_PASSWORD_ROUTE,
  REGISTER_ROUTE
];

interface Params {
  [key: string]: string | number | string[];
}

export function getRoutePattern(pathname: string, params: Params): string {
  let routePattern = pathname;

  Object.entries(params).forEach(([key, value]) => {
    const paramValue = Array.isArray(value) ? value.join("") : value;
    if (typeof paramValue === "string" || typeof paramValue === "number") {
      routePattern = routePattern.replace(paramValue.toString(), `:${key}`);
    }
  });
  return routePattern;
}

export function routeWithParams(pathname: string, params: Params): string {
  let route = pathname;

  Object.entries(params).forEach(([key, value]) => {
    const paramValue = Array.isArray(value) ? value.join("") : value;
    if (typeof paramValue === "string" || typeof paramValue === "number") {
      route = route.replace(`:${key}`, paramValue.toString());
    }
  });
  return route;
}
