
function ajaxImageLoader(postSlug){
    var container = jQuery('.grid');
    var pictureUrl = "/wp-json/wp/v2/media?include=";
    var pageParam = '&per_page=15';
    var pageCounter = 2;
    var imagesList;
    var firedBool = false;
    var imagesLeft = true;
    jQuery(function() {



        // Ajax call to the slug page to gather the image id's
        jQuery.ajax({
            url: "/wp-json/wp/v2/posts?slug=" + postSlug,
            dataType: 'json',
            success: function (result) {

                // Parse image ID's from JSON response
                matchedExp = result[0]["content"]["rendered"].match(/images=&#8221\s?.+?&/);
                imagesList = matchedExp[0].slice(14, -1);

                // Ajax call for image urls starting at page 1
                jQuery.ajax({
                    url: pictureUrl + imagesList + pageParam,
                    dataType: 'json',
                    success: function (data) {
                        for (var i in data) {

                            // Parse response for srcset url
                            var matchedExp = data[i]["description"]["rendered"].match(/<img\s?.+?>/);
                            var imageLink = data[i]["guid"]["rendered"];
                            var linkEl = '<a href="'+imageParent+'" class="prettyphoto"></a>';

                            // Decidng factor on which image's are larger, or smaller
                            if (i % 6 != 0) {
                                var imageParent = jQuery("<div>").addClass('item-div-small').addClass('item').append(matchedExp[0]);
                                jQuery(".grid").append(jQuery(linkEl).append(imageParent));

                            } else {
                                var imageParent = jQuery("<div>").addClass('item-div-large').addClass('item').append(matchedExp[0]);
                                jQuery(".grid").append(jQuery(linkEl).append(imageParent));
                            }
                        }

                        // Hides initial content
                        var initialItems = jQuery(container).find('.item').hide();

                        // Masonry's Initial settings
                        // Gutter control's right margin of tiles
                        jQuery(container).masonry({
                            itemSelector: 'none',
                            columnWidth: '.grid-sizer',
                            gutter: 17,
                            percentPosition: true,
                            horizontalOrder: true
                        })

                        // set option later on to allow appending of items later on
                            .masonry('option', {itemSelector: '.item'})
                            .masonryImagesReveal(jQuery(initialItems));


                    }
                });
            }
        });


    });

// jQuery Prototype worker function to append to Masonry Instance
    jQuery.fn.masonryImagesReveal = function (items) {
        var msnry = jQuery(this).data('masonry');
        var itemSelector = msnry.options.itemSelector;
        items.hide();
        this.append(jQuery(items));

        // Makes sure images are loaded first before appending
        items.imagesLoaded().progress(function (imgLoad, image) {
            var item = jQuery(image.img).parents(itemSelector);
            item.show();
            jQuery('.ajax-loader-div').hide();
            msnry.appended(item);

            // Timer function to prevent ajax propagation
            window.setTimeout(function () {
                firedBool = false;
            }, 2000)
        });

        // Return window object with new prototype method
        return this;
    };


// Function to detect if element is in view
    function isScrolledIntoView(elem) {
        var docViewTop = jQuery(window).scrollTop();
        var docViewBottom = docViewTop + jQuery(window).height();
        var elemTop = jQuery(elem).offset().top;
        var elemBottom = elemTop + jQuery(elem).height();
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

// On scroll fire
    jQuery(window).scroll(function (event) {

        // If firedBool false and last item in view
        if (isScrolledIntoView(jQuery('.item:last'))) {
            var imageObj = '';

            // Repeat of function above with addition of page counter
            if (!firedBool && imagesLeft) {
                firedBool = true;
                jQuery('.ajax-loader-div').show();

                jQuery.ajax({
                    url: "/wp-json/wp/v2/media?include=" + imagesList + '&per_page=15&page=' + pageCounter,
                    dataType: 'json',
                    success: function (secondPage) {
                        pageCounter++;
                        for (var i in secondPage) {

                            var matchedExp = secondPage[i]["description"]["rendered"].match(/<img\s?.+?>/);
                            var imageLink = secondPage[i]["guid"]["rendered"];


                            if (i % 6 != 0) {
                                var imageCon = '<a href="' + imageLink + '" class="prettyphoto"><div class="item-div-small item">' + matchedExp[0] + '</div></a>';
                                imageObj += imageCon;
                            } else {
                                var imageCon = '<a href="' + imageLink + '" class="prettyphoto"><div class="item-div-large item">' + matchedExp[0] + '</div></a>';
                                imageObj += imageCon;
                            }
                        }
                        container.masonryImagesReveal(jQuery(imageObj));
                    },
                    error: function () {
                        imagesLeft = false;
                        jQuery(".ajax-loader-div").hide();
                        console.log("No more images left!");
                    }
                });
            }
        }
    });
}


