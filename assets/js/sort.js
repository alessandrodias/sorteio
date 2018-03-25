$( document ).ready(function() {

  var participantsGrid = document.getElementById('participants-grid');
  var raffleBtn = document.getElementById('sort-btn');

  var timesToSort = 3;
  var totalParticipants = 0;

  var sorting = null;
  var lastParticipantSortered = null;
  var sortedParticipant = null;

  var participants = [];
  var winners = [];
  var sortereds = [];

  function setup() {
    bindBtnClick();
    getMembers();
  }

  function bindBtnClick() {
    $(raffleBtn).on('click', function() {
      sortParticipant();
      toggleRaffleButtonStatus(true, 'Raffling...');
    });
  }

  function getMembers() {
    $.getJSON("participants.json", function(members) {
      var items = [];
      totalParticipants = members.length;

      $.each(members, function(id, nome) {
        participants.push(nome);
        items.push('<div class="participant"><span class="participant-name">' + nome + '</span></div>');
      });

      $(participantsGrid).html(items);
    });
  }

  function sortParticipant() {
    clearInterval(sorting);
    sorting = setInterval(getRandomParticipant, 700);
  }

  function getRandomParticipant() {
    var memberId = Math.floor((Math.random() * totalParticipants) + 1) - 1;

    while (winners.indexOf(memberId) > -1) {
      getRandomParticipant();
      return;
    }

    while (lastParticipantSortered == memberId) {
      getRandomParticipant();
      return;
    }

    sortedParticipant = $('.participant').eq(memberId);
    lastParticipantSortered = memberId;
    sortereds.push(memberId);
    setMemberActive(memberId);
  }

  function setMemberActive(memberId) {
    $('.participant.active').removeClass('active');
    sortedParticipant.addClass('active');
    scrollToMember();

    timesToSort = timesToSort - 1;
    if (timesToSort > 0) {
      sortParticipant();
    } else {
      clearInterval(sorting);
      setWinner(memberId);
    }
  }

  function setWinner(memberId) {
    winners.push(memberId);
    toggleRaffleButtonStatus(false, 'Raffle again');
    $('.participant.current-winner').removeClass('current-winner');
    sortedParticipant.removeClass('active').addClass(['winner', 'current-winner']);
    scrollToMember(memberId);
    resetRaffle();
  }

  function toggleRaffleButtonStatus(status, text) {
    $(raffleBtn).attr('disabled', status).text(text);
  }

  function scrollToMember(memberId) {
    $('html, body').animate({
      scrollTop: sortedParticipant.offset().top - 50
    });
  }

  function resetRaffle() {
    timesToSort = 3;
    sortereds = [];
  }

  setup();

});
