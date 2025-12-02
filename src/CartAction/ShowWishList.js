import GetMytoken from "@/lib/GetuserToken"


export default async function ShowWishList() {
    const token = await GetMytoken()
const res = await fetch(`https://lesarjet.camp-coding.site/api/user/wishlist/list`,{
    method:"GET",
    headers:{
        "Authorization":`Bearer ${token}`
    }
})
const data = await res.json()
return data 
}