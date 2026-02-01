import GetMytoken from "../lib/GetuserToken";

export default async function GetTransactionsData(userId) {
  const token = await GetMytoken();

  const res = await fetch(
    `https://lesarjet.camp-coding.site/api/admin/transactions/list?user_id=${225}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // لو Next.js 13+ وعايز دايمًا داتا محدثة:
      // cache: "no-store",
    }
  );

  if (!res.ok) {
    // تقدر تحسن الهاندلينج هنا حسب مشروعك
    throw new Error("Failed to fetch transactions");
  }

  const data = await res.json();
  return data;
}
