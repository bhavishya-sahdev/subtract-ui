export type TAxiosSuccessResponse<T> = {
  data: T;
  error: null;
};
export type TAxiosErrorResponse<T> = {
  data: null;
  error: T;
};

export type TAxiosUserDetails = {
  uuid: string;
  email: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  isOnboardingComplete: boolean;
  subscriptionCount: number;
};
