export interface BabyWeight {
  birth: number;
  current: number;
}

export interface BabyHeight {
  birth: number;
  current: number;
}

export interface BabyProfile {
  id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  weight: BabyWeight;
  height: BabyHeight;
  notes?: string;
  photoUrl?: string;
} 