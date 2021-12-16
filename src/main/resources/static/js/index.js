'use strict'

$(function () {

    $("#search-button").click(function () {
        searchBooks();
    });

    function searchBooks() {
        $(".lists__item").remove();
        $(".message").remove();
        
        var searchText = $(".search__text__input").val();
        
        var num = $("#displayed-num option:selected").val();
        var displayedNum = "&maxResults=" + num

        $.ajax({
            url: 'https://www.googleapis.com/books/v1/volumes?q=' + searchText,
            url: 'https://www.googleapis.com/books/v1/volumes?q=' + searchText + displayedNum,
            type: 'GET',
            datatype: 'json',
        })
        .done(function (data) {
            alert('通信成功');
            console.log(data);
            displayBooks(data);
        })
        .fail(function (err) {
            alert('通信失敗');
            displayError(err);
        });
    }

    function displayBooks(data) {
      
        var itemsData = data.items;
        var template = '';
        
        var hitsData = data.totalItems;
        if(hitsData === 0){
          $(".search").after("<p class='message'>検索結果が見つかりませんでした。</br>別のキーワードで検索してください。</p>");
        } else {
          $(".search").after("<p class='message'>合計" + hitsData + "件ヒットしました</p>");
        }

        $.each(itemsData, function (index, el) {
            var bookData = el;

            var titleData = bookData.volumeInfo.title;
            // var authorData = bookData.volumeInfo.authors;
            
            if(bookData.volumeInfo.authors == undefined) {
              var authorData = "不明";
            } else {
              var authorData = bookData.volumeInfo.authors;
            }

            // var publisherNameData = bookData.volumeInfo.publisher;
            
            if(bookData.volumeInfo.publisher == undefined) {
              var publisherNameData = "不明";
            } else {
              var publisherNameData = bookData.volumeInfo.publisher;
            }


            var itemUrl = bookData.volumeInfo.infoLink;

            // var imageData = bookData.volumeInfo.imageLinks.thumbnail;
            
            if(bookData.volumeInfo.imageLinks) {
              var imageData = bookData.volumeInfo.imageLinks.thumbnail;
            } else {
              var imageData = "https://dummyimage.com/600x600/cbcbcb/ffffff&text=NO+IMAGE";
            }

            template += "<li class='lists__item'>" +
                    "<div class='lists__item__inner'>" +
                        "<a href='" + itemUrl + "' class='lists__item__link' target='_blank'>" +
                        "<img src='" + imageData + "' class='lists__item__img' alt=''>" +
                        "<p class='lists__item__detail'>作品名：" + titleData + "</p>" +
                        "<p class='lists__item__detail'>作者　：" + authorData + "</p>" +
                        "<p class='lists__item__detail'>出版社：" + publisherNameData + "</p>" +
                        "</a>" +
                    "</div>" +
                "</li>";

        });
        
        $("ul.lists").prepend(template);
    }
    
    function displayError(err) {
      var error_code = err.status;
      if(error_code === 400) {
        $(".search").after("<p class='message'>キーワードを入力してください</p>");
      }
    }

});

