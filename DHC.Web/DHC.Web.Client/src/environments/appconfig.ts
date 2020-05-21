export interface appconfig {
  /** Is this production? */
  production: boolean;

  /** Root address of API */
  apiEndpoint: string;

  /** URL address modifier for AccessLogs */
  accessEndpoint: string;

  /** URL address modifier for Project/Todos */
  projectEndpoint: string;
}
