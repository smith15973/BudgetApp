export default function Account({ account }) {

    return (
        <div style={{maxWidth:'200px'}}>
            <div style={{ border: "1px solid black" }}>{account.name}</div>
            <div style={{ border: "1px solid black" }}>{account.balance}</div>
            <br></br>
        </div>
    )
}