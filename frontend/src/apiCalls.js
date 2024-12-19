import axios from "axios";

export async function getAccounts() {
    return await axios.get("http://localhost:3000/accounts");
}

export async function getCategories() {
    return await axios.get("http://localhost:3000/budget_categories");
}