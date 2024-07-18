export interface BloodTest {
    id: number
    user_id: string
    blood_sugar: number | null
    cholesterol: number | null
    gout: number | null
    test_date: string
  }
  
  export interface UserProfile {
    id: string
    name: string
    age: number
    gender: string
    country: string
    language: string
  }
  