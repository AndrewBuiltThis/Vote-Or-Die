$(document).ready(function() {
  // Check if element is scrolled into view
  function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }
  // If element is scrolled into view, fade it in
  $(window).scroll(function() {
    $('.scroll-animations .animated').each(function() {
      if (isScrolledIntoView(this) === true) {
        $(this).addClass('fadeInLeft');
      }
    });
  });

  // Click Animations
  $('button').on('click', function() {
    /*
    If any input is empty make it's border red and shake it. After the animation is complete, remove the shake and animated classes so that the animation can repeat.
    */
    
    // Check name input
    if ($('#name').val() === '') {
      $('#name').addClass('form-error animated shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $(this).removeClass('animated shake');
      });
    } else {
      $('#name').removeClass('form-error');
    }
    
    // Check email input
    if ($('#email').val() === '') {
      $('#email').addClass('form-error animated shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $(this).removeClass('animated shake');
      });
    } else {
      $('#email').removeClass('form-error');
    }

    // Check message textarea
    if ($('#message').val() === '') {
      $('#message').addClass('form-error animated shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $(this).removeClass('animated shake');
      });
    } else {
      $('#message').removeClass('form-error');
    }

  });
  
  // Activate hinge effect when h4 is click in last section
  $('.funky-animations h4').on('click', function() {
    $(this).addClass('animated hinge').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $(this).removeClass('animated hinge');
      });
  });
});

$('.address').on("change keyup paste",
  function(){
    if($(this).val()){
      $('.icon-paper-plane').addClass("next");
    } else {
      $('.icon-paper-plane').removeClass("next");
    }
  }
);

$('.next-button').hover(
  function(){
    $(this).css('cursor', 'pointer');
  }
);

var validAddressCoordinates;

$('.next-button.validate-address').click(
  function(){
    //console.log("Validating Adress...");
	var singleLineAddress = $('.address').val();
		$.ajax({
			type:"GET",
			url:'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=' + singleLineAddress + '&f=json',
			success: function(data) {
				if (data.candidates.length > 0) {
					validAddressCoordinates = data.candidates[0].location;
					console.log(validAddressCoordinates);
          $('.success p').text("I think I got it. Let's Get You Your Voting Info!");
          $('#location-entry').addClass("animated bounceOutDown d-none");
          $('#voting-dashboard').removeClass("d-none").addClass("animated bounceInUp");
          $.ajax({
            type: "GET",
            url: "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyCdC_WVXwC5CpyDo6czd4smKHYzFO0Cqa4&address=" + singleLineAddress + "&electionId=6000",
            success: function(data) {
              console.log(data);
              for (index in data.offices){
                // For all offices
                for (rep in data.offices[index].officialIndices){
                  data.officials[(data.offices[index].officialIndices[rep])]["title"] = data.offices[index].name;
                }
              }
              for (official in data.officials) {
                if (data.officials[official].title) {
                  var officialTitle = data.officials[official].title;
                }
                else {
                  var officialTitle = "Elected Official"
                }
                if (data.officials[official].name) {
                  var officialName = data.officials[official].name;
                }
                else {
                  var officialName = "Name Unknown"
                }
                if (data.officials[official].party) {
                  var officialParty = data.officials[official].party;
                }
                else {
                  var officialParty = "Unkown Affiliation"
                }
                if (data.officials[official].phones) {
                  var officialPhone = data.officials[official].phones[0];
                }
                else {
                  var officialPhone = "No Phone Number"
                }
                if (data.officials[official].address) {
                  var officialAddress = data.officials[official].address[0].line1;
                }
                else {
                  var officialAddress = "Work Location"
                }
                if (data.officials[official].address) {
                  var officialCity = data.officials[official].address[0].city;
                }
                else {
                  var officialCity = "Unknown City"
                }
                if (data.officials[official].address) {
                  var officialState = data.officials[official].address[0].state;
                }
                else {
                  var officialState = "Unknown State"
                }
                if (data.officials[official].address) {
                  var officialZIP = data.officials[official].address[0].zip;
                }
                else {
                  var officialZIP = "Unknown ZIP"
                }
                if (data.officials[official].urls) {
                  var officialURL = data.officials[official].urls[0];
                }
                else {
                  var officialURL = "No Website Provided"
                }

                var officialModalID = official + "_" + data.officials[official].title;
                //console.log(data.officials);
                if (data.officials[official].party === 'Republican'){
                  var officialClass = "text-white bg-danger"
                }
                else if (data.officials[official].party === 'Democratic') {
                  var officialClass = "text-white bg-info"
                }
                else {
                  var officialClass = "bg-light"
                }

                $('#officialDetails').append(
                  `<div class="card mb-4 ${officialClass}"><div class="card-body"><h4 class="card-title">${officialTitle}</h4><p class="card-text">${officialName}</p><p class="card-text text-center"><button type="button" class="btn btn-info btn-small" data-toggle="modal" data-target="#${officialModalID}">More Info</button></p></div></div>`
                  );
                $('body').append(
                  `<div class="modal fade" id="${officialModalID}" tabindex="-1" role="dialog" aria-labelledby="${officialModalID}Label" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="${officialModalID}Label"><b>${officialTitle}</b> : ${officialName}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <p>
                          ${officialName} is a ${officialParty} ${officialTitle}.
                          <br />
                          <br />
                          They are accessable via ${officialPhone} and work at ${officialAddress} , ${officialCity} , ${officialState}  ${officialZIP}.
                          <br />
                          <br />
                          You can follow their activity via their <a href="${officialURL}" target="_blank">official website</a>.
                        </p>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-info" data-dismiss="modal">Cool, Thanks!</button>
                      </div>
                    </div>
                  </div>
                </div>`
                );
              }
              
            },
            error: function(jqXHR, exception) {
              console.log("Nothing on the Civic Info")
            }, 
            dataType: "json"
          });
          $.ajax({
            type: "GET",
            url: "https://www.googleapis.com/civicinfo/v2/voterinfo?key=AIzaSyCdC_WVXwC5CpyDo6czd4smKHYzFO0Cqa4&address=" + singleLineAddress + "&electionId=6000",
            success: function(data) {
              //console.log(data);
              if (data.election.name) {
                var electionName = data.election.name;
              }
              else {
                var electionName = "Election / Vote"
              }

              if (data.election.electionDay) {
                var electionDay = data.election.electionDay;
              }
              else {
                var electionDay = "Election Date Unknown"
              }

              if(data.pollingLocations){
                if (data.pollingLocations[0]){
                  if (data.pollingLocations[0].address) {
                    if (data.pollingLocations[0].address.locationName) {
                      var votingLocation = data.pollingLocations[0].address.locationName;
                    }
                    else {
                      var votingLocation = "Voting Location Unknown"
                    }
                    if (data.pollingLocations[0].address.line1){
                      var votingAddress = data.pollingLocations[0].address.line1;
                    }
                    else {
                      var votingAddress = "No Address Found"
                    }
                    if (data.pollingLocations[0].address.city){
                      var votingCity = data.pollingLocations[0].address.city;
                    }
                    else {
                      var votingCity = "City Unknown"
                    }
                    if (data.pollingLocations[0].address.state){
                      var votingState = data.pollingLocations[0].address.state;
                    }
                    else {
                      var votingState = "State Unknown"
                    }
                  }
                  else {
                    var votingLocation = "Voting Location Unknown";
                    var votingAddress = "No Address Found";
                    var votingCity = "City Unknown";
                    var votingState = "State Unknown";
                  }
                  if (data.pollingLocations[0].startDate) {
                    var voteStartDate = data.pollingLocations[0].startDate;
                  }
                  else {
                    var voteStartDate = "Start Date Unknown";
                  }
                  if (data.pollingLocations[0].endDate) {
                    var voteEndDate = data.pollingLocations[0].endDate;
                  }
                  else {
                    var voteEndDate = "End Date Unknown";
                  }
                  if (data.pollingLocations[0].pollingHours) {
                    var votingHours = data.pollingLocations[0].pollingHours;
                  }
                  else {
                    var votingHours = "Voting Hours Unknown";
                  }
                  if (data.pollingLocations[0].notes){
                    var votingNotes = data.pollingLocations[0].notes;
                  }
                  else {
                    var votingNotes = "No Additional Information Provided";
                  }
                }
                else {
                  var votingLocation = "Could Not Locate Nearest Voting Location";
                  var votingAddress = "NA";
                  var votingCity = "NA";
                  var votingState = "NA";
                  var voteStartDate = "Start Date Unknown";
                  var voteEndDate = "End Date Unknown";
                  var votingHours = "Voting Hours Unknown";
                  var votingNotes = "No Additional Information Provided";
                }
              }
              else {
                var votingLocation = "Could Not Locate Nearest Voting Location";
                var votingAddress = "NA";
                var votingCity = "NA";
                var votingState = "NA";
                var voteStartDate = "NA";
                var voteEndDate = "NA";
                var votingHours = "NA";
                var votingNotes = "NA";
              }

              $('#upcomingElection').append(electionName + " on ");
              $('#upcomingElection').append(electionDay + "<br />");
              $('#votingLocation').append(votingLocation + " located at ");
              $('#votingLocation').append(votingAddress + ", ");
              $('#votingLocation').append(votingCity + ", ");
              $('#votingLocation').append(votingState + ". <br/>");
              $('#votingWindow').append(voteStartDate + "and ends on");
              $('#votingWindow').append(voteEndDate + ". Voting will take place on ");
              $('#votingWindow').append(votingHours + ". <br /> <br /> Additional Info: ");
              $('#votingWindow').append(votingNotes + ".");
              //$('#votingDetails').append((data.state[0].electionAdministrationBody) + "<br />");
              //$('#votingDetails').append((data.state[0].local_jurisdiction) + "<br />");
              for (contest in data.contests) {
                var candidateSummary = "";
                var electionID = contest + "_" + data.contests[contest].district.scope + data.contests[contest].type;
                if (data.contests[contest].type) {
                  var voteType = data.contests[contest].type;
                }
                else {
                  var voteType = "Vote";
                }
                if (data.contests[contest].district.scope) {
                  var voteScope = data.contests[contest].district.scope;
                }
                else {
                  var voteScope = "Local - National";
                }
                if (data.contests[contest].district.name) {
                  var voteDistrict = data.contests[contest].district.name;
                }
                else {
                  var voteDistrict = "Your District";
                }
                if (data.contests[contest].candidates === undefined || data.contests[contest].candidates.length == 0) {
                  var candidateCount = 0;
                }
                else {
                  var candidateCount = data.contests[contest].candidates.length;
                  for (candidate in data.contests[contest].candidates) {
                    var candidateName = data.contests[contest].candidates[candidate].name;
                    if (data.contests[contest].candidates[candidate].party){
                      var candidateParty = data.contests[contest].candidates[candidate].party
                    }
                    else {
                      var candidateParty = 'No Party Specified'
                    }
                    var candidateString = `<p> ${candidateName} (${candidateParty}) is running for this position. Recent news on this candidate can be found <a href="https://news.google.com/search?q=${candidateName}&hl=en-US&gl=US&ceid=US%3Aen" target="_blank">here. </a></p>`
                    candidateSummary = candidateSummary + candidateString;
                  }
                }
                if (data.contests[contest].office === undefined) {
                  var officeType = 'Local Vote'
                }
                else {
                  var officeType = data.contests[contest].office
                }
                if (data.contests[contest].referendumTitle) {
                  var referendumTitle = data.contests[contest].referendumTitle;
                }
                else {
                  var referendumTitle = "";
                }
                if (data.contests[contest].referendumText) {
                  var referendumText = data.contests[contest].referendumText;
                }
                else {
                  var referendumText = "";
                }
                $('#ballotDetails').append(
                  `<div class="card mb-4"><div class="card-body"><h4 class="card-title">${voteType}</h4><p class="card-text">${officeType}</p><p class="card-text text-center"><button type="button" class="btn btn-info btn-small" data-toggle="modal" data-target="#${electionID}">More Info</button></p></div></div>`
                  );

                  $('body').append(
                    `<div class="modal fade" id="${electionID}" tabindex="-1" role="dialog" aria-labelledby="${electionID}Label" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="${electionID}Label"><b>${voteType}</b> Vote for  ${officeType}</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <p>
                            This vote is ${voteScope} in ${voteDistrict}.
                            <br />
                            <br />
                            There are ${candidateCount} candidates involved in this event.
                            <br />
                            ${candidateSummary}
                            <br />
                            <b>${referendumTitle}</b>
                            <br />
                            <i>${referendumText}</i>
                          </p>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-info" data-dismiss="modal">Cool, Thanks!</button>
                        </div>
                      </div>
                    </div>
                  </div>`
                  );
              }
              //$('#votingDetails').append((JSON.stringify(data.contests)) + "<br />");
            },
            error: function(jqXHR, exception) {
              console.log("Nothing for Voter Info");
            }, 
            dataType: "json"
          });
				}
				else {
					$('.success p').text("Oh no, I don't know where that is! Try using the suggested addresses!");
					console.log('Oh No!');
				}
			},
			dataType: 'json',
		});
    $('.repeat-password-section').addClass("fold-up");
    $('.success').css("marginTop", 0);
    return validAddressCoordinates;
  }
);
