import { type ActionFunctionArgs, json } from "@remix-run/node";
import * as zod from "zod";
import { useRemixForm, getValidatedFormData } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@remix-run/react";

const schema = zod.object({
  name: zod.string().nonempty(),
  email: zod.string().email().nonempty(),
});

type FormData = zod.infer<typeof schema>;

const resolver = zodResolver(schema);

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) {
    // The keys "errors" and "defaultValue" are picked up automatically by useRemixForm
    return json({ errors, defaultValues });
  }

  // Do something with the data
  return json(data);
};

export default function Index() {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useRemixForm({
    mode: "onSubmit",
    resolver,
  });

  console.log(errors);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <Form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" {...register("name")} />
          {errors.name && <p>{errors.name.message as string}</p>}
        </label>
        <label>
          Email:
          <input type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message as string}</p>}
        </label>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
