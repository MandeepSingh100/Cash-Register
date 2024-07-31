let price = 200;
let cid = [
    ["ONE", 22],
    ["FIVE", 20],
    ["TEN", 15],
    ["TWENTY", 11],
    ["FIFTY", 9],
    ["ONE HUNDRED", 7],
    ["TWO HUNDRED", 4],
    ["FIVE HUNDRED", 2],
    ["TWO THOUSAND", 1],
];

const displayChangeDue = document.getElementById("change-due");
const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const priceScreen = document.getElementById("price-screen");
const crashDrawerDisplay = document.getElementById("cash-drawer-display");

const formatResults = (status, change) => {
    displayChangeDue.innerHTML = `<p>Status: ${status}</p>`;
    change.map(
        money => (displayChangeDue.innerHTML  += `<p>${money[0]}: &#8377;${money[1]}</p>`)
    );
    return;
};

const checkCashRegister = () => {
    if(cash.value < price){
        alert("Customer does not have enough money to purchase the item");
        cash.value = "";
        return;
    }
    if(cash.value === price){
        displayChangeDue.innerHTML = 
            `<p>No change due - customer paid with exact cash</p>`;
        cash.value = "";
        return;
    }

    let changeDue = cash.value - price;
    let reversedCid = [...cid].reverse();
    let denominations = [2000, 500, 200, 100, 50, 20, 10, 5, 1];
    let result = { status: "OPEN", change: []};
    let totalCID =
     cid
        .map(total => total[1])
        .reduce((prev, curr) => prev + curr);
    
    if(totalCID < changeDue){
        return (displayChangeDue.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`);
    }
    if(totalCID === changeDue){
        result.status = "CLOSED";
    }
    for(let i = 0; i <= reversedCid.length; i++){
        if(changeDue >= denominations[i] && changeDue > 0){
            let count = 0;
            let total = reversedCid[i][1];
            while(total > 0 && changeDue >= denominations[i]){
                total -= denominations[i];
                changeDue = changeDue -= denominations[i];
                count++;
            }
            if(count > 0){
                result.change.push([reversedCid[i][0], count * denominations[i]]);
            }
        }
    }
    if(changeDue > 0){
        return (displayChangeDue.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`);
    }
    
    formatResults(result.status, result.change);
    updateUI(result.change);
};  

const checkResults = () => {
    if(!cash.value) {
        return;
    }
    checkCashRegister();
};

const updateUI = change => {
    const currencyNameMap = {
      ONE: "Ones",
      FIVE: "Fives",
      TEN: "Tens",
      TWENTY: "Twenties",
      FIFTY: "Fifty",
      "ONE HUNDRED": "One Hundreds",
      "TWO HUNDRED": "Two Hundreds",
      "FIVE HUNDRED": "Five Hundreds",
      "TWO THOUSAND": "Two Thousands"
    };
    if(change) {
        change.forEach(changeArr => {
            const targetArr = cid.find(cidArr => cidArr[0] === changeArr[0]);
            targetArr[1] = targetArr[1] - changeArr[1];
        });
    }
        cash.value = "";
        priceScreen.textContent = `Total: ₹${price}`;
        crashDrawerDisplay.innerHTML = `<p><strong>Change in drawer:</strong></p>
            ${cid
                .map(money => `<p>${currencyNameMap[money[0]]}: &#8377; ${money[1]}</p>`)
                .join("")
            }`;
};

purchaseBtn.addEventListener("click", checkResults);

cash.addEventListener("keydown", e => {
    if(e.key === "Enter"){
        checkResults();
    }
});

updateUI();