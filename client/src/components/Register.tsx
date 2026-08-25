import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

type RegistrationValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const initialValues: RegistrationValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9+()\s-]{7,20}$/, "Enter a valid phone number")
    .required("Phone is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must include an uppercase letter")
    .matches(/[0-9]/, "Password must include a number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

async function registerUser(values: RegistrationValues) {
  const response = await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error("Registration request failed");
  }

  return response.json();
}

function Register() {
  return (
    <section
      className="registration-shell"
      aria-labelledby="registration-title"
    >
      <div className="registration-intro">
        <p className="eyebrow">Expense Tracker</p>
        <h1 id="registration-title">Create your account</h1>
        <p>Register to keep your spending organized in one place.</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setStatus, setSubmitting, resetForm }) => {
          setStatus(undefined);
          try {
            await registerUser(values);
            setStatus({
              type: "success",
              message: "Account registered successfully.",
            });
            resetForm();
          } catch {
            setStatus({
              type: "error",
              message: "We could not complete registration. Please try again.",
            });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="registration-form" noValidate>
            <div className="form-grid">
              <FormField name="firstName" label="First name" type="text" />
              <FormField name="lastName" label="Last name" type="text" />
              <FormField name="email" label="Email" type="email" />
              <FormField name="phone" label="Phone" type="tel" />
              <FormField name="password" label="Password" type="password" />
              <FormField
                name="confirmPassword"
                label="Confirm password"
                type="password"
              />
            </div>

            {status?.message && (
              <p className={`form-status ${status.type}`} role="status">
                {status.message}
              </p>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
}

type FormFieldProps = {
  name: keyof RegistrationValues;
  label: string;
  type: string;
};

function FormField({ name, label, type }: FormFieldProps) {
  return (
    <label className="form-field" htmlFor={name}>
      <span>{label}</span>
      <Field id={name} name={name} type={type} />
      <ErrorMessage name={name} component="span" className="field-error" />
    </label>
  );
}

export default Register;
