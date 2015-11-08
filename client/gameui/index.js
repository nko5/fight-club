var gameConfig = {
  pos: "init",
  user: null
};

var fighters = [
  "Rambo",
  "EthanHunt",
  "JamesBond",
  "Thor",
  "Mr.Been",
  "Kitana",
  "Aashka",
  "Loki"
];

$(".show-rules").click(function() {
  gameConfig.pos = "rules";
  renderUI();
});

$(".fight-now").click(function() {
  var index = Math.floor((Math.random() * 7) + 1);
  var userName = fighters[index] + "_" + generateId();

  gameConfig.pos = "arena";
  renderUI();
  // userName = prompt("Please enter your name", userName);
  window.startGame();

  if(userName) {
    gameConfig.user = userName;
    $(".user-name").val(gameConfig.user) && $(".user-name").text(gameConfig.user);
  }

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
