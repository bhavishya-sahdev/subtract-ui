import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { routes } from "~/lib/routes";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { client } from "~/lib/axiosClient";
import api from "~/lib/api";
const FormSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(8, "Should be atleast 8 characters"),
});

export default function SignupForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await client.post(api.auth.signup, data);
      if (res.data.error) {
        for (const field in FormSchema.shape) {
          if (res.data.error[field]) {
            form.setError(field as keyof typeof FormSchema.shape, {
              message: res.data.error[field][0],
            });
          }
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
    }
  }

  return (
    <div className="w-full max-w-sm p-4">
      <p className="text-3xl mb-1">Sign up for Subtract</p>
      <p className="mb-8">Get an account going in seconds!</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="block">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Max Dwayne" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-4">
              Create an account
            </Button>
          </div>
          <div className="mx-auto mt-2 text-center text-sm">
            Already have an account?{" "}
            <Link to={routes.auth.login} className="underline">
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
