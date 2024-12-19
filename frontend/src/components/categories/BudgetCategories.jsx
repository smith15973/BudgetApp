import axios from "axios"
import { useState, useEffect } from "react"
import BudgetCategory from "./BudgetCategory";

export default function BudgetCategories() {

    const [categories, setCategories] = useState([]);

    const getBudgetCategories = async () => {
        const response = await axios.get('http://localhost:3000/budget_categories');
        setCategories(response.data)
        console.log(response.data)
    }

    useEffect(() => {
        getBudgetCategories();
    }, [])

    return (
        <div>
            <h1>CATEGORIES</h1>
            {categories.map(category => {
                return <BudgetCategory key={category.id} category={category} />
            })}
        </div>
    )
}