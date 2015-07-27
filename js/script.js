function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $street = $("input#street").val();
    var $city = $("input#city").val();
    
    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var value = $street + ',' +  $city;
    var streetUrl = '<img class="bgimg" src="https://maps.googleapis.com/maps/api/streetview?size=600x400&location='
    $body.append(streetUrl + value + '">');
    
    // NEW YORK TIME STUFF
    var nytimesURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +  value + '&sort=newest&api-key=f51ecbb0c36e0b5c12cbf10edfcc8172:5:72370571'
    
    $.getJSON(nytimesURL, function (data) {

      $nytHeaderElem.text('New York Times Article About ' + value);

      var articles = data.response.docs;
      for (var i = 0; i < articles.length; i++) {
        var article = articles[i];
        $nytElem.append('<li class="article">' + '<a href="' + article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
      };

    }).error(function () {
      $nytHeaderElem.text('New York Times CAN NOT BE LOADED ERROROROROROROR HODOR! ');
    });
      
    // WIKIPEDIA STUFF
    var wikiRequestTimeout = setTimeout(function () {
      $wikiElem.text("failed to get wikipedia resources");
    }, 8000);
    
    var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + value + '&format=json&callback=wikiCallback';
    $.ajax(wikiURL,{
      dataType: "jsonp",
      //jsonp: "callback",
      success: function (response) {
        var articleList = response[1];

        for (var i = 0; i < articleList.length; i++) {
          var articleString = articleList[i];
          var url = 'http://en.wikipedia.org/wiki/' + articleString;
          $wikiElem.append('<li><a href="' + url + '">' + articleString + '</a></li>');

        };
        clearTimeout(wikiRequestTimeout);
      }
    });
    
    return false;
};

$('#form-container').submit(loadData);

  