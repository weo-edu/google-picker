module.exports = function picker(baseOpts) {
  baseOpts = baseOpts || {};
  gapi.load('picker');
  gapi.load('auth');

  baseOpts.scope = baseOpts.scope || ['https://www.googleapis.com/auth/drive'];
  baseOpts.origin = baseOpts.origin || (window.location.protocol + '//' + window.location.host);
  baseOpts.locale = baseOpts.locale || 'en';

  return function pick(opts, cb) {
    if(arguments.length === 1) {
      cb = opts;
      opts = {};
    }

    opts = opts || {};
    Object.keys(baseOpts).forEach(function(key) {
      if(! opts.hasOwnProperty(key))
        opts[key] = baseOpts[key];
    });

    gapi.load('picker');
    gapi.load('auth', {
      callback: function() {
        var result = gapi.auth.getToken();
        if(result) handleAuth(result);
        else {
          gapi.auth.authorize({
            client_id: opts.clientId,
            scope: opts.scope,
            immediate: false,
            authuser: ''
          }, handleAuth);
        }
      }
    });

    function handleAuth(result) {
      if(! result) return cb(new Error('Google Picker: unable to authorize'));
      if(result.error) cb(result.error);
      openPicker(result.access_token);
    }

    function openPicker(token) {
      var picker = new google.picker.PickerBuilder()
        .setLocale(opts.locale)
        .setDeveloperKey(opts.apiKey)
        .setOAuthToken(token)
        .setCallback(function(data) {
          if(data.action === google.picker.Action.PICKED) {
            cb(null, data.docs, token);
          }
        })
        .setOrigin(opts.origin)
        .addViewGroup( new google.picker.DocsView().setParent('root').setIncludeFolders(true))
      	.addViewGroup( new google.picker.DocsView().setOwnedByMe(false).setIncludeFolders(true))

      picker.build().setVisible(true);
      gapi.auth.setToken(null);
    }
  };
};
