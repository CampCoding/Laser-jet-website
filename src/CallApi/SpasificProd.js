import GetMytoken from "@/lib/GetuserToken"


export default async function SpasificProd(id) {
const token= await GetMytoken()
    const res = await fetch(`https://lesarjet.camp-coding.site/api/product/list?product_id=${id}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    const data = await res.json()
    return data
}