
import BudgetCategory from "./BudgetCategory";
import NewCategory from "./NewCategory";

export default function BudgetCategories({ categories }) {





    return (
        <div>
            <h1>CATEGORIES</h1>
            <NewCategory />
            {categories.map(category => {
                return <BudgetCategory key={category.id} category={category} />
            })}
        </div>
    )
}