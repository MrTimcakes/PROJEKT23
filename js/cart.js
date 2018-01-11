var cart;
if(localStorage["Cart"]){
  cart = JSON.parse( localStorage.getItem("Cart") );
}else{
  cart = [];
}

displayCart(cart);

function displayCart(cart){
  var root = document.querySelector("#checkout-body");
  var totalCost = 0;

  for( item in cart){
    itemID = item;
    item = JSON.parse(cart[item]);
    totalCost += item.Price;
    var newRow = document.createElement("tr");

    var newItem = document.createElement("td");
    var ItemDetails = document.createTextNode(item.Name + ", Deck: " + item.Deck + ", Wheels: " + item.Wheels);
    newItem.appendChild(ItemDetails);

    var newRemoveButton = document.createElement("span");
    newRemoveButton.appendChild( document.createTextNode('\u274C') )
    newRemoveButton.addEventListener("click", function(){ removeFromCart(itemID); });
    newItem.appendChild(newRemoveButton);

    var newPrice = document.createElement("td");
    var ItemPrice = document.createTextNode(item.Price);
    newPrice.appendChild(ItemPrice);

    newRow.appendChild(newItem);
    newRow.appendChild(newPrice);
    root.appendChild(newRow);
  }

  // Add Total Cost
  var newRow = document.createElement("tr");
  var newItem = document.createElement("td");
  newItem.className = "empty"
  var newPrice = document.createElement("td");
  var totalCost = document.createTextNode(totalCost);
  newPrice.appendChild(totalCost);

  newRow.appendChild(newItem);
  newRow.appendChild(newPrice);
  root.appendChild(newRow);

  // Add Button
  var newRow = document.createElement("tr");
  var newEmpty = document.createElement("td");
  newEmpty.className = "empty";
  var newButtonContainer = document.createElement("td")
  newButtonContainer.className = "empty checkout-btn-box"
  var newButton = document.createElement("a");
  newButton.href = "/Checkout";
  newButton.className = "checkout-btn btn btn--light";
  var btnText = document.createTextNode("Checkout");
  newButton.appendChild(btnText);
  newButtonContainer.appendChild(newButton);
  newRow.appendChild(newEmpty);
  newRow.appendChild(newButtonContainer);
  root.appendChild(newRow);

}


function removeFromCart(id){
  cart = JSON.parse( localStorage.getItem("Cart") );

  cart.splice(id, 1);
localStorage.setItem("Cart", JSON.stringify(cart));

  document.querySelector("#checkout-body").innerHTML = "";
  displayCart(cart);
}
