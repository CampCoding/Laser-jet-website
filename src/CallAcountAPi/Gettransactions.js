




export default async function GetTransactionsData(id) {


const res = await fetch(`https://lesarjet.camp-coding.site/api/admin/transactions/list?user_id=225`,)
const data = await res.json();
return data

}