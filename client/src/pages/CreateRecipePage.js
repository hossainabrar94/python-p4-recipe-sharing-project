import React from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Error, Input, FormField, Label, Textarea } from "../styles";
import styled from "styled-components";

function CreateRecipePage({ user, onAddRecipe }) {
  
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      title: "My Awesome Recipe",
      minutesToComplete: "30",
      instructions: "Here's how you make it.",
      image: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required").max(100, "Must be 100 characters or less"),
      minutesToComplete: Yup.number()
        .required("Minutes to complete is required")
        .positive("Must be a positive number")
        .integer("Must be an integer"),
      instructions: Yup.string()
        .required("Instructions are required")
        .min(50, "Instructions must be at least 50 characters"),
      image: Yup.string().url("Must be a valid URL").required("Image URL is required"),
    }),
    onSubmit: (values, { setSubmitting, setErrors }) => {
      fetch("/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          instructions: values.instructions,
          minutes_to_complete: values.minutesToComplete,
          image: values.image,
        }),
      })
        .then((r) => {
          setSubmitting(false);
          if (r.ok) {
            r.json().then((newRecipe) => {
              onAddRecipe(newRecipe);
              history.push("/");
            });
          } else {
            r.json().then((err) => setErrors({ server: err.errors }));
          }
        })
        .catch((error) => {
          setSubmitting(false);
          setErrors({ server: ["An unexpected error occurred"] });
        });
    },
  });

  return (
    <Wrapper>
      <WrapperChild>
        <h2>Create Recipe</h2>
        <form onSubmit={formik.handleSubmit}>
          <FormField>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.title}
              onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title ? <Error>{formik.errors.title}</Error> : null}
          </FormField>
          <FormField>
            <Label htmlFor="minutesToComplete">Minutes to complete</Label>
            <Input
              id="minutesToComplete"
              name="minutesToComplete"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.minutesToComplete}
              onBlur={formik.handleBlur}
            />
            {formik.touched.minutesToComplete && formik.errors.minutesToComplete ? (
              <Error>{formik.errors.minutesToComplete}</Error>
            ) : null}
          </FormField>
          <FormField>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              name="instructions"
              rows="10"
              onChange={formik.handleChange}
              value={formik.values.instructions}
              onBlur={formik.handleBlur}
            />
            {formik.touched.instructions && formik.errors.instructions ? (
              <Error>{formik.errors.instructions}</Error>
            ) : null}
          </FormField>
          <FormField>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.image}
              onBlur={formik.handleBlur}
            />
            {formik.touched.image && formik.errors.image ? <Error>{formik.errors.image}</Error> : null}
          </FormField>
          <FormField>
            <Button color="primary" type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Loading..." : "Submit Recipe"}
            </Button>
          </FormField>
          <FormField>
            {formik.errors.server && formik.errors.server.map((err) => <Error key={err}>{err}</Error>)}
          </FormField>
        </form>
      </WrapperChild>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  max-width: 1000px;
  margin: 40px auto;
  padding: 16px;
  display: flex;
  gap: 24px;
`;

const WrapperChild = styled.div`
  flex: 1;
`;

export default CreateRecipePage;