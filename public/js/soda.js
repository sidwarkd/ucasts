var sodaApp = angular.module('sodaApp', []);

sodaApp.factory('SodaList', function(){
  return [ {id: 0, name:"Mt. Dew", cost:.50, image:"/img/soda/dew.jpg"},
    {id: 1, name:"Pepsi", cost:.50, image:"/img/soda/pepsi.jpg"},
    {id: 2, name:"Coca Cola", cost:.50, image:"/img/soda/coke.jpg"},
    {id: 3, name:"Dr. Pepper", cost:.50, image:"/img/soda/dr_pepper.jpg"}
  ]
});

sodaApp.factory('CartService', function(){
  var items = {};
  var itemCount = 0;

  return {

    addItem: function(soda){
      if(items[soda.name] !== undefined){
        items[soda.name].count += 1;
      }
      else{
        items[soda.name] = soda;
        items[soda.name].count = 1;
      }
      itemCount += 1;
    },

    removeItem: function(soda){
      items[soda.name].count -= 1;
      itemCount -= 1;
      if(items[soda.name].count === 0)
        delete items[soda.name];
    },

    getItems: function(){
      return items;
    },

    getItemCount: function(){
      return itemCount;
    },

    getTotal: function(){
      var total = 0;
      angular.forEach(items, function(item){
        total += item.cost * item.count;
      });
      return total;
    }
  }
});

function SodaCtrl($scope, SodaList, CartService) {
  $scope.sodaList = SodaList;

  $scope.addToCart = function(soda){
    CartService.addItem(soda);
  };

}

function CartCtrl($scope, SodaList, CartService) {
  $scope.sodaList = SodaList;

  $scope.items = CartService.getItems();  
  $scope.totalClass = "text-error";

  $scope.total = function(){
    var total = 0;
    angular.forEach($scope.items, function(item){
      total += item.cost * item.count;
    });
    if(total >= 1.00){
      $scope.totalClass = "text-success";
    }
    else{
      $scope.totalClass = "text-error";
    }
    return total;
  };

  $scope.removeOneFromCart = function(soda){
    CartService.removeItem(soda);
  };

  $scope.readyToPay = function(){
    if(CartService.getTotal() >= 1.00){
      return "";
    }
    else {
      return "hidden";
    }
  };

  $scope.ClickedPayNow = function(evnt){
    evnt.preventDefault();
    var token = function(res){
      console.log(res);
      var $input = $('<input type=hidden name=stripeToken />').val(res.id);
      var $description = $('<input type=hidden name=description />').val("Soda");
      var $amount = $('<input type=hidden name=amount />').val(CartService.getTotal() *100);
      $('form').append($input).append($description).append($amount).submit();
    };

    StripeCheckout.open({
      key:         'pk_test_FkqM3Yv0U1Pd8SfXt9kXGcgl',
      address:     false,
      amount:      CartService.getTotal() *100,
      name:        'Mo Bettah Soda',
      description: CartService.getItemCount() + " Soda(s)",
      token:       token
    });

    return false;
  }
}