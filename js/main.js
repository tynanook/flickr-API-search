// Asynchronous Flickr Search
//
// Flickr reveals a searchable JSON Feed you can access via jQuery's $.getJSON()
// method. Use this to allow users to search for a tag or comma-separated list
// of tags and view the images that are found.
//
// Allow users to click the images to see a larger version with more information.

//DO:
// return multiple pages of images


$(document).on('ready', function () {

    // ============================================================================
    // Get Search String that will be used to search flickr =======================
    // ============================================================================

    var tag_01 = "sulphur" + "+" + "creek";
    var tag_02 = "capitol" + "+" + "reef";
    var tags_all = tag_01 + "%2C" + tag_02;

    // Search field results
    $('button.search').on('click', function (event) {
        event.preventDefault();
        var searchTextInput = $(event.target.parentElement).find('input[name="searchText"]')[0];
        console.log(searchTextInput);
        if (searchTextInput.value) {
            searchImages(searchTextInput.value);
        }
        else {
            alert("Please enter a valid search entry.");
            return false;
        }
    });


    // =====================================================================================
    // Search flickr using jQuery ajax call, put thumbnails on page, setup for modal view
    // =====================================================================================

    var searchImages = function (tags_all) {

        var fkr_http = "https://api.flickr.com/services/rest/";
        //var fkr_http = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=";

        var fkr_method = "flickr.photos.search";
        var fkr_api_key = "4571252a73b8bfc04a74a0e9e68f35e8";
        var fkr_tags = tags_all;
        var fkr_sort = "data_posted_desc";
        //var fkr_bbox = "1";
        var fkr_content_type = "1";
        var fkr_per_page = "500";
        var fkr_page = "1";
        var fkr_format = "json";
        var fkr_nojsoncallback = "1";

        //var care_sulphurCreek_sw_lon = "-111.326038";
        //var care_sulphurCreek_sw_lat = "38.278960";
        //var care_sulphurCreek_ne_lon = "-111.260928";
        //var care_sulphurCreek_ne_lat = "38.333115";

        //fkr_bbox = care_sulphurCreek_sw_lon + "%2C" + care_sulphurCreek_sw_lat + "%2C" + care_sulphurCreek_ne_lon + "%2C" + care_sulphurCreek_ne_lat;
        fkr_method = "?method=" + fkr_method;
        fkr_api_key = "&api_key=" + fkr_api_key;
        fkr_tags = "&tags=" + fkr_tags;
        fkr_sort = "&sort=" + fkr_sort;
        //fkr_bbox = "&bbox=" + fkr_bbox;
        fkr_content_type = "&content_type=" + fkr_content_type;
        fkr_per_page = "&per_page=" + fkr_per_page;
        fkr_page = "&page=" + fkr_page;
        fkr_format = "&format=" + fkr_format;
        fkr_nojsoncallback = "&nojsoncallback=" + fkr_nojsoncallback;

        var fkr_extras = "&extras=description%2Cdate_upload%2Cdate_taken%2Cowner_name%2Clast_update%2Cgeo%2Ctags%2Cmachine_tags%2Cviews%2Cmedia";

        var getJSON_URL = fkr_http + fkr_method + fkr_api_key + fkr_tags + fkr_sort + fkr_content_type + fkr_extras + fkr_per_page + fkr_page + fkr_format + fkr_nojsoncallback;
        //console.log(getJSON_URL);
        //window.prompt("Copy to clipboard", getJSON_URL);

        $.getJSON(getJSON_URL, function (data) {}).done(function (data) {

            $('#images').empty();

            var photosLrg = []; // b, h, k, or o       // 1024 ols, 1600 ols, 2048 ols  o:  jpg|gif|png, base on orig photo
            var photosMed = []; // z or c              //  640 ols or 800 ols     ols = on longest side
            var photosThmb = []; // s, q, or t         // 75sq, 150sq or 100 ols
            var photosOrig = [];

            $.each(data.photos.photo, function (i, val) {
                photosLrg.push("https://farm" + val.farm + ".staticflickr.com/" + val.server + "/" + val.id + "_" + val.secret + "_b.jpg");
                photosMed.push("https://farm" + val.farm + ".staticflickr.com/" + val.server + "/" + val.id + "_" + val.secret + "_c.jpg");
                photosThmb.push("https://farm" + val.farm + ".staticflickr.com/" + val.server + "/" + val.id + "_" + val.secret + "_s.jpg");

                var idx = val.datetaken.indexOf(' ');
                var dateTaken = val.datetaken.substring(0, idx != -1 ? idx : val.datetaken.length);
                var modalDescription = "<a href=\"" + photosLrg[i] + "\">" + "<img src =\"" + photosMed[i] + "\">" + "<\/a>";
                modalDescription = modalDescription+ "<p>" + val.description._content + "</p>" + "<p>" + "Photo taken by " + val.ownername + " on " + dateTaken + "</p>"

                var newListItem = $('<div>')
                $(newListItem).attr({
                    'class': 'thumbnails'
                }).appendTo(newListItem);

                var newButton = $("<a>").attr({
                    'data-title': val.title,
                    'data-toggle': "modal",
                    'data-target': "#infoModal",
                    'data-imgsrc': photosLrg[i],
                    'data-description': modalDescription,
                    'type': "image"
                }).prepend("<img class=\"thumbnail\" src =\"" + photosThmb[i] + "\">").appendTo(newListItem);

                $("#images").append(newListItem);

            });
        });
    }


    // ============================================================================
    // modal view info
    // ============================================================================
    $('#infoModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var title = button.data('title'); // Extract info from data-* attributes
        var imgSrc = button.data('imgsrc');
        var imageDescription = button.data('description');

        // Update the modal's content using jQuery.
        var modal = $(this);
        modal.find('.modal-title').html(title);
        var modalBody = modal.find('.modal-body');
        modalBody.empty();
        var modalDescription = $("<p class='image-description'>").html(imageDescription).appendTo(modalBody);
    });

});