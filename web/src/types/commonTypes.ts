export interface ImageInput {
  url: string;
  name?: string;
  size: number;
  type?: string;
}
export interface IImage extends ImageInput {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITokens {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}
