$(document).ready(function () {


    //load products
    function newsLoad(data_button) {
        var url;
        if (data_button === 'design') {
            url = 'design';
        }
        $.ajax({
            url: url + '.php',
            type: 'POST',
            dataType: 'html',
            async: false,
            cache: false,
            global: false,
            error: function (jqXHR, textStatus, errorThrown) {
                $('.modal').remove();
            },
            success: function ($msg) {
                $('body').append($msg);
                $('.modal').show('slow');
            }
        });
    }


    $(document).on('click', '.close', function () {
        $('.modal,.gallery_container').hide('slow', function () {
            //need to destroy slick (preventing zero slick error)
            $('.slider-for').slick('unslick');
            $('.slider-nav').slick('unslick');
            $('.modal').remove();
            $('.gallery_container').remove();

        });
    });

    //galleries
    var xobj = new XMLHttpRequest();
    xobj.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var galleryJson = JSON.parse(this.responseText);
            var totalGallery = Object.keys(galleryJson).length; //get total numbs of galleries
            var galleryDetails = [];//gallery details items;
            var count = 1;
            $('#galleries .wrap').append('<ul class="gallery_list"></ul>');
            // form gellery title page view
            while (count <= totalGallery) {
                var pathToGallery = 'images/photos/gal' + count + '/';
                var pathToGalleryMain = 'images/photos/gal' + count + '/' + galleryJson[count].mainphoto;//path for main file
                //list of gallerues on main page
                $('.gallery_list').append('<li data-galleryItem="' + count + '" class="gallery_item">' +
                    '<a href="rel=[gallery_' + count + ']" style="background:url(' + pathToGalleryMain + ')">' +
                    '<div class="gallery_title">' +
                    '<h3>' + galleryJson[count].title + '</h3>' +
                    '<h4>' + galleryJson[count].subtitle + '</h4>' +
                    '</div>' +
                    '</a>' +
                    '</li>');
                //gallery content
                var galleryDetCount = 0;
                var bigSlide = '', miniSlide = ''; //for create mini and big sledes
                while (galleryDetCount < galleryJson[count].photos.length) {
                    bigSlide += '<li class="big-slide">' +
                        '<div class="img-cont">' +
                        '<img src="' + pathToGallery + galleryJson[count].photos[galleryDetCount].photoname + '" alt=""/>' +
                        '</div>' +
                        '<div class="description-slide">' +
                        '<p class="description">' + galleryJson[count].photos[galleryDetCount].description + '</p>' +
                        '<h4 class="location">' + galleryJson[count].photos[galleryDetCount].sub_description + '</h4>' +
                        '</div>' +
                        '</li>';
                    miniSlide += '<li class="mini-slide">' +
                        '<div class="img-cont">' +
                        '<img src="' + pathToGallery + galleryJson[count].photos[galleryDetCount].photoname + '" alt=""/>' +
                        '</div>' +
                        '</li>';
                    ++galleryDetCount;
                }
                //pushing gallery images to lists
                var galleryDetailsData =
                    '<ul class="slider-for">' + bigSlide + '</ul>' +
                    '<ul class="slider-nav">' + miniSlide + '</ul>';
                // create array of galleries HTML (some small cache)
                galleryDetails.push(galleryDetailsData);
                ++count;
            }
            //work with click on gallery at main page
            $('.gallery_item').click(function () {
                //Let's crating Modal has begin ))
                $('body').append('<div class="gallery_container"></div>');
                $('.gallery_container').append('' +
                    '<div class="wrap">' +
                    '<div class="close">' +
                    '<i class="fa fa-times" aria-hidden="true"></i>' +
                    '</div>' +
                    '<div class="slider-cont">' +
                    '</div>' +
                    '</div>');
                //push data from gallery data array
                $('.slider-cont').append(galleryDetails[$(this).data('galleryitem')]);

                //gallery gallery modal and initialize slick
                $('.gallery_container').show('slow', function () {
                    $('.slider-for').slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: true,
                        fade: true,
                        asNavFor: '.slider-nav',
                        infinite: true

                    });
                    $('.slider-nav').slick({
                        slidesToScroll: 1,
                        asNavFor: '.slider-for',
                        dots: false,
                        arrows: false,
                        variableWidth: true,
                        focusOnSelect: true
                    });
                });


                return false;
            });
        }
    }
    xobj.overrideMimeType("application/json");

    xobj.open('GET', 'gallery.json', true);
    xobj.send();

    //achors clicks
    $(".main-menu a, .click-to-down").click(function () {
        $(".main-menu a").removeClass('active');
        if ($('.main-menu').hasClass('show_menu')) {
            $('.main-menu').removeClass('show_menu');
            $('.main-menu').slideUp('slow');
        }
        $(this).addClass('active');
        elementClick = $(this).attr("href");
        if (elementClick == '#') { //if simple '#' prevent error and scroll to the page block
            $("body,html").animate({scrollTop: 0}, 1000);
        } else {
            destination = $(elementClick).offset().top; // scroll to top of block
            $("body,html").animate({scrollTop: destination}, 1000);
        }
        if (elementClick == '#about') {
            aboutActiveBlock();
        }

    });

})
;

