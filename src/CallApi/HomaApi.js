
export default async function HomeApi() {

const res = await fetch("https://lesarjet.camp-coding.site/api/pages/home/list")
const data = await res.json()
return data


}