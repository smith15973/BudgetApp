
import BudgetCategory from "./BudgetCategory";

export default function BudgetCategories({categories}) {

    



    return (
        <div>
            <h1>CATEGORIES</h1>
            {categories.map(category => {
                return <BudgetCategory key={category.id} category={category} />
            })}
        </div>
    )
}