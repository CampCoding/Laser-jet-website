export default async function SpasificCatg(id) {
    const res = await fetch(`https://lesarjet.camp-coding.site/api/product/list?category_id=${id}`)
    const data = await res.json()
    return data
}