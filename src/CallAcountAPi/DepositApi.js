import GetMytoken from "../lib/GetuserToken";

export default async function DepsitEndpoint(payload) {
  const token = await GetMytoken();

  const res = await fetch(
    "https://lesarjet.camp-coding.site/api/admin/transactions/deposite/create",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      // لو عايز دايمًا داتا محدثة في Next.js:
      // cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const data = await res.json();
  return data;
}
