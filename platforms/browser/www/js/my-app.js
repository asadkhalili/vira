// Initialize app
var myApp = new Framework7({
    smartSelectBackText: 'بازگشت'
});
var webserviceAction = 'http://viraadv.ir/backend/web/peyk/data';
var webserviceData = 'http://viraadv.ir/backend/web/uploads/peyk';

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Loading flag
var loading = false;

// Last loaded index
var firstIndexOrder = 0;
var firstIndexNeed = 0;
var lastIndexOrder = 0;
var lastIndexNeed = 0;
var firstResultOrder = 0;
var firstResultNeed = 0;
var lastResultOrder = 0;
var lastResultNeed = 0;
var type = 'orders';
var page = 'index';


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

var welcomescreen_slides = [
    {
        id: 'slide1',
        picture: '<img src="../images/vira-welcome.png" style="height: 80%;">',
        text: '<a id="tutorial-close-btn" class="button button-round active" href="#">ورود به برنامه</a>'
    }
];

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    var welcomeOptions = {
        'bgcolor': '#1a237e',
        'fontcolor': '#fff',
        'closeButton' : true,
        'closeButtonText' : 'ورود',
        'pagination': false,
        'onClosed': function () {
            $$('.views').show();
            init();
        }
    };
    var welcomescreen = myApp.welcomescreen(welcomescreen_slides, welcomeOptions);
    $$(document).on('click', '#tutorial-close-btn', function () {
        welcomescreen.close();
    });

});



function init() {
    $$.getJSON(webserviceAction + '/orders?id=' + lastIndexOrder, function (data) {
        firstIndexOrder = data.data[0].id;
        $$.each(data.data, function (key, value) {
            var html = htmlOrder(value);
            lastIndexOrder = value.id;
            $$('#getOrders').append(html);
        });
    });
}

function htmlOrder(value) {
    return '<div class="card" data-id="' + value.id + '">' +
        '<a href="details.html?id=' + value.id + '&title=' + value.title + '">' +
        '<div class="card-header">' + value.title + '</div>' +
        '<div class="card-content">' +
        '<img src="' + webserviceData + '/orders/' + value.pic + '" style="width: 100%">' +
        '</div>' +
        '<div class="card-footer">' + value.zone + '</div>' +
        '</a></div>';
}

function htmlNeeds(value) {
    var JDate = require('jdate');
    var jdate = new JDate; // => default to today

    return '<div class="card" data-id="' + value.id + '">' +
        '<a href="details.html?id=' + value.id + '&title=' + value.title + '">' +
        '<div class="row ">' +
        '<div class="col-20">' +
        '<img src="' + webserviceData + '/orders/' + value.pic + '" style="width: 100%">' +
        '</div>' +
        '<div class="col-80">' +
        '<h3>' + value.title + '</h3>' +
        '<span class="color-black">' + value.zone + '</span><br>' +
        '<span class="color-black">' + jdate.format('dddd DD MMMM YYYY') + '</span>' +
        '</div>' +
        '</div></a></div>';
}


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

});

$$('.toolbarLink').on('click', function (e) {

    page = $$(this).attr('data-page');

    $$('.toolbarLink').removeClass('active');
    $$(this).addClass('active');
});

$$('.infinite-scroll-1').on('infinite', function () {

    if (loading) {
        return false;
    }

    loading = true;
    // Emulate 1s loading
    setTimeout(function () {
            // Reset loading flag
            loading = false;
            $$.getJSON(webserviceAction + '/orders', {id: lastIndexOrder}, function (data, status, xhr) {
                if (data.status == 1) {
                    $$.each(data.data, function (key, value) {
                        var html = htmlOrder(value);
                        $$('#getOrders').append(html);
                        lastIndexOrder = value.id;
                    });
                } else {
                    // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                    myApp.detachInfiniteScroll($$('.infinite-scroll'));
                    // Remove preloader
                    $$('.infinite-scroll-preloader').remove();
                    return;
                }
            });
        }
        ,
        500
    );
});


$$('.pull-refresh-1').on('refresh', function (e) {

    setTimeout(function (e) {
        $$.getJSON(webserviceAction + '/orders', {id: firstIndexOrder, update: true}, function (data) {
            firstIndexOrder = data.data[0].id;
            $$.each(data.data, function (key, value) {
                var html = htmlOrder(value);
                $$('#getOrders').prepend(html);
            });
        });

        myApp.pullToRefreshDone($$('.pull-refresh-1'));
    }, 200);
});

$$('.indexTabs').on('click', function (e) {
    type = $$(this).attr('data-type');
});


// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {

    // Get page data from event data
    var page = e.detail.page;

    if (page.name == 'index') {

        lastIndexOrder = 0;
        lastIndexNeed = 0;
        firstIndexOrder = 0;
        firstIndexNeed = 0;
        init();

        $$('.infinite-scroll-1').on('infinite', function () {

            if (loading) {
                return false;
            }

            loading = true;
            // Emulate 1s loading
            setTimeout(function () {
                    // Reset loading flag
                    loading = false;
                    $$.getJSON(webserviceAction + '/orders', {id: lastIndexOrder}, function (data, status, xhr) {
                        if (data.status == 1) {
                            $$.each(data.data, function (key, value) {
                                var html = htmlOrder(value);
                                $$('#getOrders').append(html);
                                lastIndexOrder = value.id;
                            });
                        } else {
                            // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                            myApp.detachInfiniteScroll($$('.infinite-scroll'));
                            // Remove preloader
                            $$('.infinite-scroll-preloader').remove();
                            return;
                        }
                    });
                }
                ,
                500
            );
        });

        $$('.pull-refresh-1').on('refresh', function (e) {

            setTimeout(function (e) {
                $$.getJSON(webserviceAction + '/orders', {id: firstIndexOrder, update: true}, function (data) {
                    firstIndexOrder = data.data[0].id;
                    $$.each(data.data, function (key, value) {
                        var html = htmlOrder(value);
                        $$('#getOrders').prepend(html);
                    });
                });
                myApp.pullToRefreshDone($$('.pull-refresh-1'));
            }, 200);
        });


    }

    if (page.name == 'needs') {


        lastIndexOrder = 0;
        lastIndexNeed = 0;
        firstIndexOrder = 0;
        firstIndexNeed = 0;
        $$.getJSON(webserviceAction + '/needs?id=' + lastIndexNeed, function (data) {
            firstIndexNeed = data.data[0].id;
            $$.each(data.data, function (key, value) {
                var html = htmlNeeds(value);
                lastIndexNeed = value.id;
                $$('#getNeeds').append(html);
            });
        });

        $$('.infinite-scroll-2').on('infinite', function () {

            if (loading) {
                return false;
            }

            loading = true;
            // Emulate 1s loading
            setTimeout(function () {
                    // Reset loading flag
                    loading = false;
                    $$.getJSON(webserviceAction + '/needs', {id: lastIndexNeed}, function (data, status, xhr) {
                        if (data.status == 1) {
                            $$.each(data.data, function (key, value) {
                                var html = htmlNeeds(value);
                                $$('#getNeeds').append(html);
                                lastIndexNeed = value.id;
                            });
                        } else {
                            // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                            myApp.detachInfiniteScroll($$('.infinite-scroll'));
                            // Remove preloader
                            $$('.infinite-scroll-preloader2').remove();
                            return;
                        }
                    });
                }
                ,
                500
            );
        });

        $$('.pull-refresh-2').on('refresh', function (e) {

            setTimeout(function (e) {
                $$.getJSON(webserviceAction + '/needs', {id: firstIndexNeed, update: true}, function (data) {
                    firstIndexNeed = data.data[0].id;
                    $$.each(data.data, function (key, value) {
                        var html = htmlNeeds(value);
                        $$('#getNeeds').prepend(html);
                    });
                });
                myApp.pullToRefreshDone($$('.pull-refresh-2'));
            }, 200);
        });
    }

    if (page.name == 'category') {

        $$.getJSON(webserviceAction + '/categories', function (data) {
            $$.each(data, function (key, value) {
                var html = '<li>' +
                    '<a href="result.html?id=' + value.id + '&title=' + value.name + '" class="item-link item-content">' +
                    '<div class="item-media"><i class="f7-icons">'+ value.pic +'</i></div>' +
                    '<div class="item-inner">' +
                    '<div class="item-title">' + value.name + '</div>' +
                    ' </div></a>' +
                    ' </li>';
                $$('#getCategory').append(html);
            });
        });
    }

    if (page.name == 'result') {
        firstResultOrder = 0;
        lastResultOrder = 0;

        $$('.page-title-cat').text(page.query.title);

        var url_order = $$('.resultOrderLink').attr('href');
        var url_need = $$('.resultNeedLink').attr('href');
        $$('.resultOrderLink').attr('href', url_order + '?id=' + page.query.id + '&title=' + page.query.title);
        $$('.resultNeedLink').attr('href', url_need + '?id=' + page.query.id + '&title=' + page.query.title);

        $$.getJSON(webserviceAction + '/orders', {id: lastResultOrder, cat_id: page.query.id}, function (data) {
            if (data.status == 1) {
                firstResultOrder = data.data[0].id;
                $$.each(data.data, function (key, value) {
                    var html = htmlOrder(value);
                    lastResultOrder = value.id;
                    $$('#getResultOrders').append(html);
                });
            } else {
                $$('.infinite-scroll-preloader').hide();
                $$('#resultEmptyOrder').text('متاسفانه نتیجه ای یافت نشد.');
            }
        });

        $$('.infinite-scroll-3').on('infinite', function () {

            if (loading) {
                return false;
            }

            loading = true;
            // Emulate 1s loading
            setTimeout(function () {
                    // Reset loading flag
                    loading = false;
                    $$.getJSON(webserviceAction + '/orders', {
                        id: lastResultOrder,
                        cat_id: page.query.id
                    }, function (data, status, xhr) {
                        if (data.status == 1) {
                            $$.each(data.data, function (key, value) {
                                var html = htmlOrder(value);
                                $$('#getResultOrders').append(html);
                                lastResultOrder = value.id;
                            });
                        } else {
                            // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                            myApp.detachInfiniteScroll($$('.infinite-scroll'));
                            // Remove preloader
                            $$('.infinite-scroll-preloader').remove();
                            return;
                        }
                    });
                }
                ,
                500
            );
        });

        $$('.pull-refresh-3').on('refresh', function (e) {

            setTimeout(function (e) {
                $$.getJSON(webserviceAction + '/orders', {
                    id: firstResultOrder,
                    update: true,
                    cat_id: page.query.id
                }, function (data) {
                    firstResultOrder = data.data[0].id;
                    $$.each(data.data, function (key, value) {
                        var html = htmlOrder(value);
                        $$('#getResultOrders').prepend(html);
                    });
                });
                myApp.pullToRefreshDone($$('.pull-refresh-3'));
            }, 200);
        });

    }

    if (page.name == 'result_needs') {
        firstResultNeed = 0;
        lastResultNeed = 0;

        $$('.page-title-cat').text(page.query.title);

        var url_order = $$('.resultOrderLink').attr('href');
        var url_need = $$('.resultNeedLink').attr('href');
        $$('.resultOrderLink').attr('href', url_order + '?id=' + page.query.id + '&title=' + page.query.title);
        $$('.resultNeedLink').attr('href', url_need + '?id=' + page.query.id + '&title=' + page.query.title);

        $$.getJSON(webserviceAction + '/needs', {id: lastResultNeed, cat_id: page.query.id}, function (data) {
            if (data.status == 1) {
                firstResultNeed = data.data[0].id;
                $$.each(data.data, function (key, value) {
                    var html = htmlOrder(value);
                    lastResultNeed = value.id;
                    $$('#getResultNeeds').append(html);
                });
            } else {
                $$('.infinite-scroll-preloader').hide();
                $$('#resultEmptyNeed').text('متاسفانه نتیجه ای یافت نشد.');
            }
        });

        $$('.infinite-scroll-4').on('infinite', function () {

            if (loading) {
                return false;
            }

            loading = true;
            // Emulate 1s loading
            setTimeout(function () {
                    // Reset loading flag
                    loading = false;
                    $$.getJSON(webserviceAction + '/needs', {
                        id: lastResultNeed,
                        cat_id: page.query.id
                    }, function (data, status, xhr) {
                        if (data.status == 1) {
                            $$.each(data.data, function (key, value) {
                                var html = htmlOrder(value);
                                $$('#getResultNeeds').append(html);
                                lastResultNeed = value.id;
                            });
                        } else {
                            // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                            myApp.detachInfiniteScroll($$('.infinite-scroll'));
                            // Remove preloader
                            $$('.infinite-scroll-preloader').remove();
                            return;
                        }
                    });
                }
                ,
                500
            );
        });

        $$('.pull-refresh-4').on('refresh', function (e) {

            setTimeout(function (e) {
                $$.getJSON(webserviceAction + '/needs', {
                    id: firstResultNeed,
                    update: true,
                    cat_id: page.query.id
                }, function (data) {
                    firstResultNeed = data.data[0].id;
                    $$.each(data.data, function (key, value) {
                        var html = htmlOrder(value);
                        $$('#getResultNeeds').prepend(html);
                    });
                });
                myApp.pullToRefreshDone($$('.pull-refresh-4'));
            }, 200);
        });
    }

    if (page.name == 'details') {

        $$.getJSON(webserviceAction + '/order', {
            id: page.query.id
        }, function (data) {
            if (data.status == 1) {
                $$('#ad-desc').text(data.order.content);
                $$('#ad-phone').text(data.order.phone);
                $$('#ad-zone').text(data.order.zone);
                $$('#ad-address').text(data.order.address);
                //$$('#ad-image').attr('src', webserviceData + '/orders/' + data.order.pic);

                var pics = '<div class="swiper-slide"><span>' +
                    '<img src="' + webserviceData + '/orders/' + data.order.pic + '" style="width: 100%">' +
                    '</span></div>';

                $$('.swiper-wrapper').html(pics);

                $$.each(data.order.pics, function (index, item) {
                    if (item) {
                        pics = '<div class="swiper-slide"><span>' +
                            '<img src="' + webserviceData + '/orders/' + item.pic + '" style="width: 100%">' +
                            '</span></div>';

                        $$('.swiper-pagination').show();
                    } else {
                        $$('.swiper-pagination').hide();
                    }

                    $$('.swiper-wrapper').append(pics);
                });

                // Init slider and store its instance in mySwiper variable
                var mySwiper = myApp.swiper('.swiper-container', {
                    pagination: '.swiper-pagination'
                });

            }
            console.log(data);
        });


        $$('#ad-title').text(page.query.title);

    }

});


// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    //myApp.alert('Here comes About page');
});