$(document).ready(function() {
  var index = Math.floor((Math.random() * 7) + 1);
  var userName = fighters[index] + "_" + generateId();
  gameConfig.user = userName;
  $(".user-name").val(gameConfig.user) && $(".user-name").text(gameConfig.user);
});

$(".start").click(function() {
  gameConfig.pos = "calibrate";
  gameConfig.user = $("input.user-name").val();
  renderUI();
});

$(".continue").click(function() {
  gameConfig.pos = "start";
  renderUI();
});

function renderUI() {
  switch (gameConfig.pos) {
    case "init":
      resetUI();
      $(".welcome").show();
      break;

    case "calibrate":
      resetUI();
      $(".calibrate").show();
      break;

    case "start":
      resetUI();
      $(".fight-area").show();
      break;
  }

  $(".user-name").val(gameConfig.user) && $(".user-name").text(gameConfig.user);
}

function resetUI() {
  $(".page").hide();
}

function generateId()
{
  var str = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 5; i++ )
      str += possible.charAt(Math.floor(Math.random() * possible.length));

  return str;
}