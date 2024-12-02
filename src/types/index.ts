export type ActivityType =
  | "SIGN_UP"
  | "LOGIN"
  | "LOGOUT"
  | "AUTH_WITH_GOOGLE"
  | "AVATAR_UPDATE"
  | "NAME_UPDATE"
  | "PASSWORD_CHANGE";

export interface ActivityDetails {
  [key: string]: any;
}
