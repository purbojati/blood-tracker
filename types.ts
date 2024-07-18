export type BloodTest = {
  id: number;
  user_id: number;
  test_date: string;
  blood_sugar: number;
  cholesterol: number;
  gout: number;
};

export type UserProfile = {
  id: number;
  email: string;
  name: string;
  age: number;
  gender: string;
  country: string;
  language: string;
};

export type { BloodTest as default, UserProfile as ProfilesForm };