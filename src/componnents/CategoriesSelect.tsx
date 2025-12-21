import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";


interface CategoryProps{
    value: string,
    onChange: (value: string) => void
}
export default function CategoriesSelect({value,onChange}: CategoryProps){
    const baseUrl = import.meta.env.VITE_API_URL
     const [categories, setCategories] = useState<any[]>([]);
    //  const [selectedCategory, setSelectedCategory] = useState('')
    const fetchCategories = async() => {
        try{
            const res = await axios.get(`${baseUrl}/sap-categories`)
            console.log(res.data)
            setCategories(res.data)

        }
        catch(error: any){
            console.log("error:", error)
        }

    }
    useEffect(() => {
        fetchCategories()

    }, [])
    const categoriesOptions = [{value: '' , label: 'Select Category'} , 
        ...categories.map((category) => ({value: category.code, label: category.description}))
    ]
    
    return (
        <>
        <Select
         options={categoriesOptions}
         value={value ? categoriesOptions.find(c => c.value === value) : null}
         onChange={(option) => onChange(option?.value || '')}
         isSearchable={true}
         placeholder= 'Select Category'
        />
        </>
    )

   


}
