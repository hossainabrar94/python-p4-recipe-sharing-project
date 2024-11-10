import React, { useState } from "react";
import { useHistory } from "react-router-dom"; 
import { Button, Error, Input, FormField, Label } from "../styles";

function SignUpForm({ onSignUp }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const history = useHistory()

    function handleSubmit(e){
        e.preventDefault();
        setErrors([]);

        if (password !== passwordConfirmation) {
            setErrors(['Password confirmation did not match'])
            return;
        }

        setIsLoading(true);
        fetch("/signup", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username,
                email,
                password,
                password_confirmation: passwordConfirmation
            })
        })
        .then((r) => {
            setIsLoading(false);
            if (r.ok) {
              r.json().then((user) => onSignUp(user));
              history.push('/')
            } else {
              r.json().then((err) => setErrors(err.errors || ["An error occured with the submission"]));
            }
            
          })
        .catch((error) => {
            setErrors(["An unexpected error occurred. Please try again."]);
            setIsLoading(false);
        });
    }   

    return (
        <form onSubmit={handleSubmit}>
            <FormField>
                <Label htmlFor="username">Username</Label>
                <Input
                    type="text"
                    id="username"
                    autoComplete="off"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </FormField>
            <FormField>
                <Label htmlFor = "email">Email</Label>
                <Input 
                    type = "text"
                    id = "email"
                    autoComplete = "off"
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormField>
            <FormField>
                <Label htmlFor = "password">Password</Label>
                <Input 
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                />
            </FormField>
            <FormField>
                <Label htmlFor = "password_confirmation">Password Confirmation</Label>
                <Input 
                    type="password"
                    id="password_confirmation"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    autoComplete="current-password"
                />
            </FormField>
            <FormField>
                <Button type="submit">{isLoading ? "Loading..." : "Sign Up"}</Button>
            </FormField>
            <FormField>
                {Array.isArray(errors) && errors.map((err) => (
                    <Error key={err}>{err}</Error>
                ))}
            </FormField>
        </form>
    )
}

export default SignUpForm;