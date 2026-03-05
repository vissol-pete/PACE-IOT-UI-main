const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID || "",
      userPoolClientId: process.env.REACT_APP_CLIENT_ID || "",
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID || "",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code" as "code", // Explicitly typing to avoid type mismatch
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: false,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
};

export default awsConfig;
