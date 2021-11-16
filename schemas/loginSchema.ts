
import * as z from "zod";

const PASSWORD_LENGTH = 2;


const password = z.string().min(PASSWORD_LENGTH);

export const LoginSchema = z.object({
  email: z.string().email(),
  password,
});
export const SignUpSchema = z.object({
  email: z.string().email(),
  password,
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty()

});