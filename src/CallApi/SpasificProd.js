

export default async function SpasificProd(id) {

    const res = await fetch(`https://lesarjet.camp-coding.site/api/product/list?product_id=${id}`)
    const data = await res.json()
    return data
}