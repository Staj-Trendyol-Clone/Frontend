// Yanıt Tipi
interface TokenAuthLoginResponse {
  tokenAuth: {
    token: string;
    payload: any;
    refreshExpiresIn?: number;
  };
}
export type { TokenAuthLoginResponse };

