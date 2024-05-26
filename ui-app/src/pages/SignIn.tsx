import { useForm } from "react-hook-form";
import { useAuth } from "../Context/AuthContext";
import { Button, Form } from "react-bootstrap";
import { UserModel } from "../Models/AuthResponse";
import { validatePassword } from "../Handlers/ValidationHandler";

export function SignIn()
{

    const { signIn, isLoading } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormsInputs>({
        defaultValues: {
            email: 'default@example.com',
            password: 'DefaultPass123!',
          }
    })

    type LoginFormsInputs = UserModel;

    const handleLogin = (form: LoginFormsInputs) => {
        signIn(form);
      };

    return (
        <>
      <Form onSubmit={handleSubmit(handleLogin)}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Entered value does not match email format',
              },
            })}
            isInvalid={!!errors.email}
          />
          {errors.email && (
            <Form.Control.Feedback type="invalid">
              {errors.email.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register('password', {
                validate : validatePassword
            })}
            isInvalid={!!errors.password}
          />
          {errors.password && (
            <Form.Control.Feedback type="invalid">
              {errors.password.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          {isLoading ? 'Loading…' : 'Sign In'}
        </Button>
      </Form>
        </>
    )
}