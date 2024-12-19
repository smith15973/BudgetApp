export default function BudgetCategory({ category }) {

    return (
        <div style={{maxWidth:'200px'}}>
            <div style={{ border: "1px solid black" }}>{category.name}</div>
            <div style={{ border: "1px solid black" }}>{category.balance}</div>
            <br></br>
        </div>
    )
}