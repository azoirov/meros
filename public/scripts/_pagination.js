try {
  /* * * * * * * * * * * * * * * * *
   * Pagination
   * javascript page navigation
   * * * * * * * * * * * * * * * * */
  let path = document.querySelector(".path-path-path").textContent;
  var Pagination = {
    code: "",

    // --------------------
    // Utility
    // --------------------

    // converting initialize data
    Extend: function (data) {
      data = data || {};
      Pagination.size = Math.ceil(size / 8) || 31;
      Pagination.page = cPage || 1;
      Pagination.step = data.step || 3;
    },

    // add pages by number (from [s] to [f])
    Add: function (s, f) {
      for (var i = s; i < f; i++) {
        Pagination.code += `<a href="${path}?c_page=${cPage}">${i}</a>`;
      }
    },

    // add last page with separator
    Last: function () {
      Pagination.code += `<i>...</i><a href="${path}?c_page=${cPage}">${Pagination.size}</a>`;
    },

    // add first page with separator
    First: function () {
      Pagination.code += `<a href="${path}?c_page=${cPage}">${1}</a><i>...</i>`;
    },

    // --------------------
    // Handlers
    // --------------------

    // change page
    Click: function () {
      Pagination.page = +this.innerHTML;
      Pagination.Start();
    },

    // previous page
    Prev: function () {
      Pagination.page--;
      if (Pagination.page < 1) {
        Pagination.page = 1;
      }
      Pagination.Start();
    },

    // next page
    Next: function () {
      Pagination.page++;
      if (Pagination.page > Pagination.size) {
        Pagination.page = Pagination.size;
      }
      Pagination.Start();
    },

    // --------------------
    // Script
    // --------------------

    // binding pages
    Bind: function () {
      var a = Pagination.e.getElementsByTagName("a");
      for (var i = 0; i < a.length; i++) {
        if (+a[i].innerHTML === Pagination.page) a[i].className = "current";
        a[i].addEventListener("click", Pagination.Click, false);
      }
    },

    // write pagination
    Finish: function () {
      Pagination.e.innerHTML = Pagination.code;
      Pagination.code = "";
      Pagination.Bind();
    },

    // find pagination type
    Start: function () {
      if (Pagination.size < Pagination.step * 2 + 6) {
        Pagination.Add(1, Pagination.size + 1);
      } else if (Pagination.page < Pagination.step * 2 + 1) {
        Pagination.Add(1, Pagination.step * 2 + 4);
        Pagination.Last();
      } else if (Pagination.page > Pagination.size - Pagination.step * 2) {
        Pagination.First();
        Pagination.Add(
          Pagination.size - Pagination.step * 2 - 2,
          Pagination.size + 1
        );
      } else {
        Pagination.First();
        Pagination.Add(
          Pagination.page - Pagination.step,
          Pagination.page + Pagination.step + 1
        );
        Pagination.Last();
      }
      Pagination.Finish();
    },

    // --------------------
    // Initialization
    // --------------------

    // binding buttons
    Buttons: function (e) {
      var nav = e.getElementsByTagName("a");
      nav[0].addEventListener("click", Pagination.Prev, false);
      nav[1].addEventListener("click", Pagination.Next, false);
    },

    // create skeleton
    Create: function (e) {
      var html = [
        '<a><svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.67519 13.2342L0.325195 6.95416L9.67519 0.767578V13.2342Z" fill="#8D909B"/></svg></a>', // previous button
        "<span></span>", // pagination container
        '<a><svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.324806 13.2342L9.6748 6.95416L0.324806 0.767578V13.2342Z" fill="#8D909B"/></svg></a>', // next button
      ];

      e.innerHTML = html.join("");
      Pagination.e = e.getElementsByTagName("span")[0];
      Pagination.Buttons(e);
    },

    // init
    Init: function (e, data) {
      Pagination.Extend(data);
      Pagination.Create(e);
      Pagination.Start();
    },
  };

  /* * * * * * * * * * * * * * * * *
   * Initialization
   * * * * * * * * * * * * * * * * */

  var init = function () {
    Pagination.Init(document.getElementById("pagination"), {
      size: 30, // pages size
      page: 1, // selected page
      step: 3, // pages before and after current
    });
  };

  document.addEventListener("DOMContentLoaded", init, false);
} catch (e) {}
