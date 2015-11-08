$(document).ready(function() {
  var index = Math.floor((Math.random() * 7) + 1);
  var userName = fighters[index] + "_" + generateId();
  gameConfig.user = userName;
  $(".user-name").val(gameConfig.user) && $(".user-name").text(gameConfig.user);
});

$(".show-rules").click(function() {
  gameConfig.pos = "rules";
  renderUI();
});

$(".fight-now").click(function() {
  gameConfig.pos = "arena";
  renderUI();
});

$(".back-home").click(function() {
  gameConfig.pos = "init";
  renderUI();
});

$(".tweet").click(function() {
  var tweet = "https://twitter.com/home?status=Join%20the%20%23FightClub%20%23NodeKnowckout%20http%3A//kadira.2015.nodeknockout.com/";
  window.open(tweet,"","toolbar=no,status=no,menubar=no,location=center,scrollbars=no,resizable=no,height=500,width=657");
});

function renderUI() {
  switch (gameConfig.pos) {
    case "init":
      resetUI();
      $(".welcome").show();
      break;

    case "rules":
      resetUI();
      $(".rules").show();
      // $(".rules").height($(window).height());
      $(".rules").css("min-height", $(window).height());
      break;

    case "arena":
      resetUI();
      $(".arena").show();
      break;
  }
}

// $(".start").click(function() {
//   gameConfig.pos = "calibrate";
//   gameConfig.user = $("input.user-name").val();
//   renderUI();
// });

// $(".continue").click(function() {
//   gameConfig.pos = "start";
//   renderUI();
// });

// function renderUI() {
//   switch (gameConfig.pos) {
//     case "init":
//       resetUI();
//       $(".welcome").show();
//       break;

//     case "calibrate":
//       resetUI();
//       $(".calibrate").show();
//       break;

//     case "start":
//       resetUI();
//       $(".fight-area").show();
//       break;
//   }

//   $(".user-name").val(gameConfig.user) && $(".user-name").text(gameConfig.user);
// }

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