export interface IUser { 

  loading: false,
  error: null,
  id: number,
  name: string,
  email: string,
  profile: string | null,
  savedPrompts: number | null,
  createdPrompts: number | null,
  favoritePrompts: number | null,
  purchasedPrompts: number | null,
  subscriptionType: string,
};

