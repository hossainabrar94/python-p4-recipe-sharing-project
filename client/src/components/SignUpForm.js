import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Error, Input, FormField, Label } from "../styles";
import { useHistory } from 'react-router-dom';

function SignUpForm({ onSignUp }) {
    
    const history = useHistory();
    
    const formik = useFormik({
        initialValues: {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        },
        validationSchema: Yup.object({
        username: Yup.string().required("Username is required").max(15, "Must be 15 characters or less"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().required("Password is required").min(4, "Must be at least 4 characters"),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Password confirmation is required"),
        }),
        onSubmit: (values, { setSubmitting, setErrors }) => {
        fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password,
            password_confirmation: values.passwordConfirmation,
            }),
        })
            .then((r) => {
            setSubmitting(false);
            if (r.ok) {
                r.json().then((user) => onSignUp(user));
                history.push('/');
            } else {
                r.json().then((err) => setErrors({ server: err.errors || ["An error occurred"] }));
            }
            })
            .catch((error) => {
            setSubmitting(false);
            setErrors({ server: ["An unexpected error occurred. Please try again."] });
            });
        },
    });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormField>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.username}
          onBlur={formik.handleBlur}
        />
        {formik.touched.username && formik.errors.username ? (
          <Error>{formik.errors.username}</Error>
        ) : null}
      </FormField>
      <FormField>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.email}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email ? <Error>{formik.errors.email}</Error> : null}
      </FormField>
      <FormField>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password ? (
          <Error>{formik.errors.password}</Error>
        ) : null}
      </FormField>
      <FormField>
        <Label htmlFor="passwordConfirmation">Password Confirmation</Label>
        <Input
          id="passwordConfirmation"
          name="passwordConfirmation"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.passwordConfirmation}
          onBlur={formik.handleBlur}
        />
        {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation ? (
          <Error>{formik.errors.passwordConfirmation}</Error>
        ) : null}
      </FormField>
      <FormField>
        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Loading..." : "Sign Up"}
        </Button>
      </FormField>
      <FormField>
        {formik.errors.server && formik.errors.server.map((err) => <Error key={err}>{err}</Error>)}
      </FormField>
    </form>
  );
}

export default SignUpForm;