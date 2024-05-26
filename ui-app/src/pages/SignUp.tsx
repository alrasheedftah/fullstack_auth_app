import { useForm } from "react-hook-form";
import { useAuth } from "../Context/AuthContext";
import { Button, Form } from "react-bootstrap";
import { UserSignupModel } from "../Models/AuthResponse";
import { validatePassword } from "../Handlers/ValidationHandler";

export function SignUp()
{

    const { signUp, isLoading } = useAuth();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormsInputs>({
        defaultValues: {
          username : "AnaRasta Jane",
          email: 'default@example.com',
          password: 'DefaultPass123!',
          confirmPassword: 'DefaultPass123!',
        }},)

      const password = watch('password');

      type SignUpFormsInputs = UserSignupModel & {
        confirmPassword : string;
        };

    const handleSignUp = (form: SignUpFormsInputs) => {
      signUp(form);
      };

    return (
        <>
      <Form onSubmit={handleSubmit(handleSignUp)}>
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

        <Form.Group controlId="formBasicName">
          <Form.Label>UserName</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter UserName"
            {...register('username', {
              required: 'userName is required',
            })}
            isInvalid={!!errors.username}
          />
          {errors.username && (
            <Form.Control.Feedback type="invalid">
              {errors.username.message}
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

        <Form.Group controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value =>
                value === password || 'The passwords do not match',
            })}
            isInvalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Button className="mt-3" variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? 'Loading…' : 'Sign Up'}
        </Button>
      </Form>
        </>
    )
}
