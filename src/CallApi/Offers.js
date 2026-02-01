// lib/getOffers.js
export default async function getOffers({ page = 1, per_page = 10 } = {}) {
  const res = await fetch(
    `https://lesarjet.camp-coding.site/api/product/offers/list?page=${page}&per_page=${per_page}`,
    // { cache: "no-store" }
  );
console.log(`https://lesarjet.camp-coding.site/api/product/offers/list?page=${page}&per_page=${per_page}`)
  if (!res.ok) throw new Error("Failed to fetch data");

  return res.json();
}
