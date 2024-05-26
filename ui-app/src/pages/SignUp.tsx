import { useForm } from "react-hook-form";
import { useAuth } from "../Provider/authProvider";
import { Button, Form } from "react-bootstrap";

export function SignUp()
{

    const { signUp } = useAuth();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormsInputs>({
        defaultValues: {
          userName : "AnaRasta Jane",
          email: 'default@example.com',
          password: 'DefaultPass123!',
          confirmPassword: 'DefaultPass123!',
        }},)

    const validatePassword = (value : string) => {
        const minLength = value.length >= 8;
        const hasLetter = /[a-zA-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        if (!minLength) {
          return 'Password must be at least 8 characters long';
        }
        if (!hasLetter) {
          return 'Password must contain at least one letter';
        }
        if (!hasNumber) {
          return 'Password must contain at least one number';
        }
        if (!hasSpecialChar) {
          return 'Password must contain at least one special character';
        }
        return true;
      };

      const password = watch('password');

      type SignUpFormsInputs = {
        email: string;
        password: string;
        userName: string;
        confirmPassword : string;
        };

    const handleSignUp = (form: SignUpFormsInputs) => {
        signUp(form.email, form.userName, form.password);
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
            {...register('userName', {
              required: 'userName is required',
            })}
            isInvalid={!!errors.userName}
          />
          {errors.userName && (
            <Form.Control.Feedback type="invalid">
              {errors.userName.message}
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

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
        </>
    )
}
