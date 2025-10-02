export interface UserDto {
  username: string;
  email: string;
  userBio: string;
  phoneNumber: string;
}

export interface LoginResponse {
  token: string;
  user: UserDto;
}
