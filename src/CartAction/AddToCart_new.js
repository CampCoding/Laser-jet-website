import GetMytoken from "@/lib/GetuserToken"


export default async function AddToCart(product_id) {
    const token = await GetMytoken()


    if (!token) {
        return {
            success: false,
            message: "من فضلك سجل دخول أولاً قبل إضافة المنتجات إلى سلة التسوق",
            requireLogin: true
        }
    }

    const res = await fetch(`https://lesarjet.camp-coding.site/api/user/cart/create`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({product_id, type: "decrement"})
    }
    )
    const data = await res.json()
    return data
}