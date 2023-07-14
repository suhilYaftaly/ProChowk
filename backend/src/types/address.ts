export interface AddressSearchInput {
  value: string;
  lat: number;
  lng: number;
  limit?: number;
  source?: "MapQuest";
}

export interface Address {
  id: string;
  street: string;
  city: string;
  county: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  source: any;
}
