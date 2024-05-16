"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { client } from "@/lib/axiosClient";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { useToast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  email: z.string(),
  password: z.string().min(8, "Should be atleast 8 characters"),
});
export default function LoginForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await client.post(api.auth.signin, data);
      if (res.data.error) {
        if (typeof res.data.error != "string")
          for (const field in FormSchema.shape) {
            if (res.data.error[field])
              form.setError(field as keyof typeof FormSchema.shape, {
                message: res.data.error[field][0],
              });
          }
        else
          toast({
            title: res.data.error,
          });
      }
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "An unknown error occured.",
        description: "Please try again in a bit!",
      });
      console.error(e);
    }
  }
  return (
    <div className="w-full max-w-sm p-4">
      <p className="text-3xl mb-1">Login</p>
      <p className="mb-8">Enter your email below to login to your account.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="block">
          <div className="grid gap-2">
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
          </div>
          <Button type="submit" className="w-full mt-4">
            Sign in
          </Button>
        </form>
      </Form>
      <div className="mx-auto mt-2 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href={routes.auth.signup} className="underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
