"use client";

import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import useGetSettings from "../../../hooks/useGetSettings";
import { Spinner } from "../../components/ui/spinner";

const PrivacyAndTerms = () => {
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;

  const { settings, loading, error, fetchSettings, setSettings } =
    useGetSettings(accessToken);

  useEffect(() => {
    if (accessToken) {
      fetchSettings();
    }
  }, [accessToken, fetchSettings]);

  const termsAndConditionsData = settings?.terms_and_conditions;

  if (loading)
    return (
      <p className="flex  justify-center items-center h-screen">
        <Spinner className={"size-8!"} />
      </p>
    );
  if (error) return <p className="text-red-500">خطأ: {error.message}</p>;
  if (!termsAndConditionsData)
    return <p>لا يوجد بيانات للشروط والأحكام</p>;

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
      <div dangerouslySetInnerHTML={{ __html: termsAndConditionsData }} />
    </div>
  );
};

export default PrivacyAndTerms;
