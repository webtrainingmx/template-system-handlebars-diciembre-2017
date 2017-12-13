(function (Handlebars, axios) {

  var app = (function () {

    function getAjaxData (url) {
      return axios({
        method: 'get',
        url: url,
      });
    }

    // 1. Obtener plantilla
    function getHandlebarsTemplate () {
      return getAjaxData('./templates/polls.hbs');
    }

    function getAjaxDataFromExternalServer () {
      return getAjaxData('http://polls-api.webtraining.zone:3300/api/v1/polls');
    }

    // 2. Compilar platilla
    function compileHandlabarsTemplate (source) {
      return Handlebars.compile(source);
    }

    // 3. Usar la plantilla compilada + datos
    function render (options) {
      var templateFunction = compileHandlabarsTemplate(options.source);
      var generatedHTML = templateFunction(options.data);

      document.querySelector(options.selector).innerHTML = generatedHTML;
    }

    function init () {
      var ajaxCalls = [
        getAjaxDataFromExternalServer(),
        getHandlebarsTemplate()];

      axios.all(ajaxCalls).then(function (response) {

        var polls = response[0].data;
        var templateSource = response[1].data;

        render({
          selector: '#app',
          source: templateSource,
          data: {
            polls: polls,
            title: 'PAngular',
          },
        });

        console.log(response);
      });

      console.log('Init!');
    }

    return {
      init: init,
    };
  })();

  app.init();

})(window.Handlebars, window.axios);