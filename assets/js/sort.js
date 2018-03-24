$( document ).ready(function() {

  var gridMembers = document.getElementById('grid-members');
  var btnSort = document.getElementById('btn-sort');
  var timesToSort = null;
  var participants = [];
  var totalParticipants = 0;
  var winners = [];
  var sorting = null;
  var sortedMemberId = null;

  function setup() {
    bindBtnClick();
    getMembers();
  }

  function bindBtnClick() {
    $(btnSort).on('click', function() {
      getNumberOfTimes();
      sortMember();
      $(this).attr('disabled', true).text('Sorteando...');
    });
  }

  function getMembers() {
    $.getJSON("members.json", function(members) {
      var items = [];

      totalParticipants = members.length;

      $.each(members, function(id, nome) {
        participants.push(nome);
        items.push('<div class="member"><span class="member-name">' + nome + '</span></div>');
      });

      $(gridMembers).html(items);
    });
  }

  function getNumberOfTimes() {
    timesToSort = Math.floor((Math.random() * 7) + 1);
    timesToSort = (timesToSort < 4) ? 4 : timesToSort;
  }

  function sortMember() {
    clearInterval(sorting);
    sorting = setInterval(getRandomMember, 1000);
  }

  function getRandomMember() {
    var memberId = Math.floor((Math.random() * totalParticipants) + 1) - 1;
    console.log(memberId);

    while (memberId == sortedMemberId) {
      memberId = Math.floor((Math.random() * totalParticipants) + 1) - 1;
    }

    sortedMemberId = memberId;
    setMemberActive(memberId);
  }

  function setMemberActive(memberId) {
    $('.member.active').removeClass('active');
    $('.member').eq(memberId).addClass('active');
    scrollToMember(memberId);

    timesToSort = timesToSort - 1;

    if (timesToSort > 0) {
      sortMember();
    } else {
      clearInterval(sorting);
      setWinner(memberId);
    }
  }


  function defineMember() {
    var memberId = Math.floor((Math.random() * totalParticipants) + 1) - 1;

    while (memberId == sortedMemberId) {
      memberId = Math.floor((Math.random() * totalParticipants) + 1) - 1;
    }
    sortedMemberId = memberId;

    $('.member.active').removeClass('active');
    $('.member').eq(memberId).addClass('active');
    scrollToMember(memberId);

    timesToSort = timesToSort - 1;

    if (timesToSort > 0) {
      sortMember();
    } else {
      clearInterval(sorting);
      setWinner(memberId);
    }
  }


  function setWinner(memberId) {
    if (winners.indexOf(memberId) > -1) {
      sortMember();
    } else {
      var member = $('.member').eq(memberId);
      $('.member.current-winner').removeClass('current-winner');
      member.removeClass('active').addClass(['winner', 'current-winner']);
      $(btnSort).attr('disabled', false).text('Sortear novamente');
      scrollToMember(memberId);
      winners.push(memberId);
    }
  }

  function scrollToMember(memberId) {
    var member = $('.member').eq(memberId);
    $('html, body').animate({
      scrollTop: member.offset().top - 50
    });
  }

  setup();

});
