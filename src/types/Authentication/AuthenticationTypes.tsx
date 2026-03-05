// prettier-ignore
export type AuthenticationWindowType = 'signIn' | 'newUserResetPassword'|'forgotPassword1' | 'ForgotPassword2' | 'expiredTemporaryPassword';

export interface AuthenticationAlert {
  showAlert: boolean;
  severity: string;
  title: string;
  description: string;
}
