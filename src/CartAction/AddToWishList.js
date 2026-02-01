import GetMytoken from "@/lib/GetuserToken"


export default async function AddToWishList(product_id) {
const token = await GetMytoken()
    if (!token) {
        return {
            success: false,
            message: "من فضلك سجل دخول أولاً قبل إضافة المنتجات إلى سلة التسوق",
            requireLogin: true
        }
    }

const res= await fetch(`https://lesarjet.camp-coding.site/api/user/wishlist/create`,{
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({product_id})
})
const data = await res.json()
return data
    
    }