import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ClearFilterButton from './ClearFilterButton'
import { useNavigate } from 'react-router-dom'

export default function Products() {

    const [filters, setFilters] = useState({ "ASC": false, "DESC": false, "OS": false, "FD": false })
    const [productsFiltered, setProductsFiltered] = useState([])
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const [clear, setClear] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        axios.get('./assets/Data.json')
            .then(resp => {
                setProducts(resp.data)
                setProductsFiltered(resp.data)
            })
            .catch(err => {
                console.log('Error : ', err);
            })
    }, [clear])

    const pushFilters = e => {
        // const fName = e.target.value
        // setChecked(!checked)



        if (e.target.type === "radio") {
            if (e.target.value === "ASC") {
                console.log("DESC")
                setFilters({ ...filters, DESC: false,ASC:true})
            } else {
                console.log("ASC")

                setFilters({ ...filters, ASC: false ,DESC:true})
            }
        } else {

            setFilters({ ...filters, [e.target.value]: !filters[e.target.value] })
        }
        console.log(filters);
        // manageFilter(e)
    }
    useEffect(() => {
        // const filterName = e.target.value
        // setFilters([...filters],filterName)
        // console.log(filters);
        let temp = [...products]
        // console.log(filters);

        if (filters.ASC === true) {
            // setProductsFiltered([...products].sort((a, b) => a.price-b.price))
            temp = temp.sort((a, b) => a.price - b.price)
        } else {
            temp = temp.sort((a, b) => b.price - a.price)

        }
        // if (filters.DESC === true) {
        //     // setProductsFiltered([...products].sort((a, b) => b.price-a.price))
        //     temp = temp.sort((a, b) => b.price - a.price)
        // }
        if (filters.OS === true) {
            // setProductsFiltered(products.filter(product => product.stock === 0))
            temp = temp.filter(product => product.stock === 0)
        }
        if (filters.FD === true) {
            // setProductsFiltered(products.filter(product => product.delivery === 'fast'))
            temp = temp.filter(product => product.delivery === 'Delivery By Tomorrow')
        }
        setProductsFiltered(temp)
    }, [filters])

    // const manageFilter = e => {
    // }

    const manageClear = () => {
        // setFilters(null)
        setProductsFiltered(products)
        setFilters({ "ASC": false, "DESC": false, "OS": false, "FD": false })
        setClear(true)
        // setSearch('')
        // console.log("Filters Cleared");
    }

    const manageClick = e => {
        navigate(`/product/${e}`)
        // console.log(e);
    }

    return (
        <div className='container'>
            <div class="input-group w-25 d-flex justify-content-center input-group-sm mb-3">
                <input type="text" class="form-control" name='search' aria-label="Small" placeholder='Search here...' aria-describedby="inputGroup-sizing-sm" onChange={e =>
                    setSearch(e.target.value)} />
            </div>
            <div className='col-3 sidebar bg-gray'>
                <label>Filter Products</label>
                <form className='col-6'>
                    <label><input type='radio' name='ASC' id='ascending' value='ASC' onChange={pushFilters} checked={filters.ASC} /> Ascending</label>
                    <label><input type='radio' name='ASC' id='descending' value='DESC' onChange={pushFilters} checked={filters.DESC} /> Descending</label>
                    <label><input type='checkbox' name='OS' id='outOfStock' value='OS' onChange={pushFilters} checked={filters.OS} /> Out Of Stock</label>
                    <label><input type='checkbox' name='FD' id='fastDelivery' value='FD' onChange={pushFilters} checked={filters.FD} /> Fast Delivery</label>
                </form>
                <ClearFilterButton manageClear={manageClear} />
            </div>
            <div className='row ml-15 d-flex justify-content-center content'>
                {productsFiltered.filter((val) => {
                    if (search == '') { return val }
                    else if (val.title.toLowerCase().includes(search.toLowerCase())) {
                        return val
                    }
                })
                    .map((p, i) => (
                        <div className='col-3 mb-2 p-2 m-1 border border-dark border-radius-4 text-center' onClick={() => manageClick(p.id)}>
                            <img src={p.image} width='200' height={250} alt='...' />
                            <h6 className='mt-4'>{p.title}</h6>
                            <p>Price : &#36; <del><i>{p.price * 2}</i></del> {p.price}</p>
                            <p>Rating: {p.rating.rate}&#9733; <span>{p.rating.count} ratings</span></p>
                            <button type='button'>Add To Cart</button>
                        </div>
                    ))}
            </div>
        </div>
    )
}
