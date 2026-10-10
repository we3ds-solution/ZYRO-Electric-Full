export interface BranchServiceOption {
  id: string;
  name: string;
  icon: string;
}

export interface BranchHours {
  day: string;
  hours: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  address: string;
  zipCode: string;
  phone: string;
  email: string;
  isOpenNow: boolean;
  openingHours: BranchHours[];
  services: string[];
  manager: string;
  image: string;
  isMainBranch?: boolean;
}
