import GetMytoken from "@/lib/GetuserToken";

export default async function GetCartData() {
const token = await GetMytoken()
const res=await fetch( `https://lesarjet.camp-coding.site/api/user/cart/list`,{
       headers: {
            
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
           
        },
})
const data = await res.json()
return data


}