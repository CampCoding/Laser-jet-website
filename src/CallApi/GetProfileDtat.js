export default async function GetProfileDtat({ token } = {}) {
  let authToken = token;

  if (!authToken && typeof window === "undefined") {
    const { default: GetMytoken } = await import("@/lib/GetuserToken");
    authToken = await GetMytoken();
  }

  if (!authToken) {
    throw new Error("Missing access token for profile request");
  }

  const res = await fetch(
    `https://lesarjet.camp-coding.site/api/user/profile`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Unable to fetch profile data");
  }

  return res.json();
}