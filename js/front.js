$(function() {
  /* =========================================
   * tooltip
   *  =======================================*/

  $(".customer img").tooltip();

  /* =========================================
   * counters
   *  =======================================*/

  $(".counter").counterUp({
    delay: 10,
    time: 1000
  });

  /* =================================================
   * Preventing URL update on navigation link click
   *  ==============================================*/

  $(".link-scroll").on("click", function(e) {
    let anchor = $(this);
    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: $(anchor.attr("href")).offset().top
        },
        1000
      );
    e.preventDefault();
  });

  /* =========================================
   *  Scroll Spy
   *  =======================================*/

  $("body").scrollspy({
    target: "#navbarcollapse",
    offset: 80
  });

  /* =========================================
   * testimonial slider
   *  =======================================*/

  $(".testimonials").owlCarousel({
    nav: false,
    dots: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 3
      },
      1200: {
        items: 4
      }
    }
  });

  /* =========================================
   * Leflet map
   *  =======================================*/
  map();

  /* =========================================
   * parallax
   *  =======================================*/
  $(window).scroll(function() {
    let scroll = $(this).scrollTop();

    if ($(window).width() > 1250) {
      $(".parallax").css({
        "background-position": "left -" + scroll / 8 + "px"
      });
    } else {
      $(".parallax").css({
        "background-position": "center center"
      });
    }
  });

  /* =========================================
   * filter
   *  =======================================*/

  $("#filter a").click(function(e) {
    e.preventDefault();

    $("#filter li").removeClass("active");
    $(this)
      .parent("li")
      .addClass("active");

    let categoryToFilter = $(this).attr("data-filter");

    $(".reference-item").each(function() {
      if (
        $(this).data("category") === categoryToFilter ||
        categoryToFilter === "all"
      ) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  /* =========================================
   * reference functionality
   *  =======================================*/
  $(".reference a").on("click", function(e) {
    e.preventDefault();

    let title = $(this)
        .find(".reference-title")
        .text(),
      description = $(this)
        .siblings(".reference-description")
        .html();

    $("#detail-title").text(title);
    $("#detail-content").html(description);

    let images = $(this)
      .siblings(".reference-description")
      .data("images")
      .split(",");
    if (images.length > 0) {
      sliderContent = "";
      for (let i = 0; i < images.length; ++i) {
        sliderContent =
          sliderContent +
          '<div class="item"><img src=' +
          images[i] +
          ' alt="" class="img-fluid"></div>';
      }
    } else {
      sliderContent = "";
    }

    openReference(sliderContent);
  });

  function openReference(sliderContent) {
    $("#detail").slideDown();
    $("#references-masonry").slideUp();

    if (sliderContent !== "") {
      let slider = $("#detail-slider");

      if (slider.hasClass("owl-loaded")) {
        slider.trigger("replace.owl.carousel", sliderContent);
      } else {
        slider.html(sliderContent);
        slider.owlCarousel({
          nav: false,
          dots: true,
          items: 1
        });
      }
    }
  }

  function closeReference() {
    $("#references-masonry").slideDown();
    $("#detail").slideUp();
  }

  $("#filter button, #detail .close").on("click", function() {
    closeReference();
  });

  /* =========================================
   *  animations
   *  =======================================*/

  delayTime = 0;

  $("[data-animate]").waypoint(
    function(direction) {
      delayTime += 250;

      let element = $(this.element);

      $(this.element)
        .delay(delayTime)
        .queue(function(next) {
          element.toggleClass("animated");
          element.toggleClass(element.data("animate"));
          delayTime = 0;
          next();
        });

      this.destroy();
    },
    {
      offset: "90%"
    }
  );

  $("[data-animate-hover]").hover(
    () => {
      $(this).css({
        opacity: 1
      });
      $(this).addClass("animated");
      $(this).removeClass($(this).data("animate"));
      $(this).addClass($(this).data("animate-hover"));
    },
    () => {
      $(this).removeClass("animated");
      $(this).removeClass($(this).data("animate-hover"));
    }
  );

  /* =========================================
   * for demo purpose
   *  =======================================*/

  let stylesheet = $("link#theme-stylesheet");
  $("<link id='new-stylesheet' rel='stylesheet'>").insertAfter(stylesheet);
  let alternateColour = $("link#new-stylesheet");

  if ($.cookie("theme_csspath")) {
    alternateColour.attr("href", $.cookie("theme_csspath"));
  }

  $("#colour").change(function() {
    if ($(this).val() !== "") {
      let theme_csspath = "css/style." + $(this).val() + ".css";

      alternateColour.attr("href", theme_csspath);

      $.cookie("theme_csspath", theme_csspath, {
        expires: 365,
        path: document.URL.substr(0, document.URL.lastIndexOf("/"))
      });
    }

    return false;
  });
});

/* =========================================
 * styled Leaflet Map
 *  =======================================*/
// ------------------------------------------------------ //
// styled Leaflet  Map
// ------------------------------------------------------ //

function map() {
  let mapId = "map",
    mapCenter = [52.104321, 1.310419],
    mapMarker = true;

  if ($("#" + mapId).length > 0) {
    let icon = L.icon({
      iconUrl: "img/marker.png",
      iconSize: [25, 37.5],
      popupAnchor: [0, -18],
      tooltipAnchor: [0, 19]
    });

    let dragging = false,
      tap = false;

    if ($(window).width() > 700) {
      dragging = true;
      tap = true;
    }

    let map = L.map(mapId, {
      center: mapCenter,
      zoom: 13,
      dragging: dragging,
      tap: tap,
      scrollWheelZoom: false
    });

    let Stamen_TonerLite = L.tileLayer(
      "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}",
      {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: "abcd",
        minZoom: 0,
        maxZoom: 20,
        ext: "png"
      }
    );

    Stamen_TonerLite.addTo(map);

    map.once("focus", function() {
      map.scrollWheelZoom.enable();
    });

    if (mapMarker) {
      let marker = L.marker(mapCenter, {
        icon: icon
      }).addTo(map);

      marker.bindPopup(
        "<div class='p-4'><h5>Adre</h5><p>16 Collingwood Road</p><p>Woodbridge, Suffolk, UK</p><p>IP12 1JL</p></div>",
        {
          minwidth: 200,
          maxWidth: 600,
          className: "map-custom-popup"
        }
      );
    }
  }
}
document.getElementById("submit-button").onclick = function() {
  submit_by_id();
};
// Submit function
function submit_by_id() {
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  var message = document.getElementById("message").value;
  // document.getElementById("contact-form").submit(); //form submission
  // alert(" Name ");
  jQuery.support.cors = true; 
  var url = "https://cors-anywhere.herokuapp.com/https://qms-manager.herokuapp.com/api/contact";
  jQuery.ajax({
    type: "POST",
    url: url,
    crossDomain: true,
    dataType: "JSON",
    contentType: "application/x-www-form-urlencoded",
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      message: message
    }),
    error: function() {
      console.log("error, args:");
      console.log(arguments);
    },
    success: function() {
      alert("Message Sent!");
    }
  });
}
