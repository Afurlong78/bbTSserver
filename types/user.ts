export interface UserInterface extends Document {
  email: string;
  password: string;
  activatedUser: boolean;
  id?: any;
}
