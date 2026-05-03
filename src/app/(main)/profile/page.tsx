"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, Lock, Camera, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateProfileSchema, changePasswordSchema } from "@/validations/auth.schema";
import type { UpdateProfileInput, ChangePasswordInput } from "@/validations/auth.schema";
import { getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const user = session?.user as { id: string; name: string; email: string; image?: string | null } | undefined;

  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({ name: user.name });
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const onProfileSubmit = async (data: UpdateProfileInput) => {
    setProfileError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      await update({ name: data.name });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordInput) => {
    setPasswordError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      passwordForm.reset();
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Password update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2540] pt-20">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl font-black uppercase text-white">
            Profile
          </h1>
        </motion.div>

        {/* Avatar */}
        <div className="mb-8 flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.image ?? undefined} />
              <AvatarFallback className="bg-[#FDF5AA] text-black text-xl font-bold">
                {user ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6 bg-[#113F67] border border-white/5">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-[#FDF5AA] data-[state=active]:text-black"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="data-[state=active]:bg-[#FDF5AA] data-[state=active]:text-black"
            >
              <Lock className="mr-2 h-4 w-4" />
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="rounded-2xl border border-white/5 bg-[#113F67] p-6">
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div>
                  <Label className="text-slate-300">Full Name</Label>
                  <Input
                    {...profileForm.register("name")}
                    className="mt-1.5 border-white/10 bg-white/5 text-white placeholder-zinc-500 focus:border-[#FDF5AA]/30"
                  />
                  {profileForm.formState.errors.name && (
                    <p className="mt-1 text-xs text-red-400">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-slate-300">Email</Label>
                  <Input
                    value={user?.email ?? ""}
                    disabled
                    className="mt-1.5 border-white/10 bg-white/5 text-slate-400 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-slate-500">Email cannot be changed</p>
                </div>

                <div>
                  <Label className="text-slate-300">Phone (optional)</Label>
                  <Input
                    {...profileForm.register("phone")}
                    placeholder="+1 (555) 000-0000"
                    className="mt-1.5 border-white/10 bg-white/5 text-white placeholder-zinc-500 focus:border-[#FDF5AA]/30"
                  />
                </div>

                {profileError && (
                  <p className="text-sm text-red-400">{profileError}</p>
                )}

                {profileSuccess && (
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Profile updated successfully
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={profileForm.formState.isSubmitting}
                  className="bg-[#FDF5AA] text-black font-bold hover:bg-[#e8e090]"
                >
                  {profileForm.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Changes
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="password">
            <div className="rounded-2xl border border-white/5 bg-[#113F67] p-6">
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div>
                  <Label className="text-slate-300">Current Password</Label>
                  <Input
                    {...passwordForm.register("currentPassword")}
                    type="password"
                    className="mt-1.5 border-white/10 bg-white/5 text-white focus:border-[#FDF5AA]/30"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="mt-1 text-xs text-red-400">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-slate-300">New Password</Label>
                  <Input
                    {...passwordForm.register("newPassword")}
                    type="password"
                    className="mt-1.5 border-white/10 bg-white/5 text-white focus:border-[#FDF5AA]/30"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="mt-1 text-xs text-red-400">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-slate-300">Confirm New Password</Label>
                  <Input
                    {...passwordForm.register("confirmPassword")}
                    type="password"
                    className="mt-1.5 border-white/10 bg-white/5 text-white focus:border-[#FDF5AA]/30"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {passwordError && (
                  <p className="text-sm text-red-400">{passwordError}</p>
                )}

                {passwordSuccess && (
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Password updated successfully
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting}
                  className="bg-[#FDF5AA] text-black font-bold hover:bg-[#e8e090]"
                >
                  {passwordForm.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Update Password
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
