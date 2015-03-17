module.exports = function picker(baseOpts) {
  baseOpts = baseOpts || {};
  gapi.load('picker');
  gapi.load('auth');

  baseOpts.origin = baseOpts.origin || window.location.protocol + '//' + window.location.host;

  return function pick(opts, cb) {
    opts = opts || {};
    Object.keys(baseOpts).forEach(function(key) {
      if(! opts.hasOwnProperty(key))
        opts[key] = baseOpts[key];
    });

    var accessToken;

    gapi.load('picker');
    gapi.load('auth', {
      callback: function() {
        var result = gapi.auth.getToken();

        if(result) handleAuth(result);
        else {
          gapi.auth.authorize({
            clientId: opts.clientId,
            scope: opts.scope,
            immediate: false
          }, handleAuth);
        }
      }
    });

    function handleAuth(result) {
      if(! result) return cb(new Error('Google Picker: unable to authorize'));
      if(result.error) cb(result.error);
      openPicker(result.access_token);
    }

    function openPicker(token, cb) {
      var picker = new google.picker.PickerBuilder()
        .setLocale(opts.locale)
        .setDeveloperKey(opts.apiKey)
        .setCalllback(cb)
        .setOrigin(opts.origin);

      if(opts.features && opts.features.length > 0) {
        opts.features.forEach(function(feature) {
          picker.enableFeature(google.picker.Feature[feature]);
        });
      }

      if(opts.views && opts.views.length > 0) {
        opts.views.forEach(function(view) {
          picker.addView(eval('new google.picker.' + view));
        });
      }

      picker.build().setVisible(true);
    }

    function pickerResponse(data) {
      if(data.action === google.picker.Action.PICKED) {
        cb(null, data.docs);
      }
    }
  };
};