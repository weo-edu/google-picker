# google-picker

Dead simple google picker library.

## Usage

```javascript
var pick = require('google-picker')({
  clientId: <your client id>,
  apiKey: <your developer api key>
});

pick({views: ['DocsView()']}, function(err, files) {
  if(err) throw err;
  // files
});
```

## Config

* `clientId` your application's client id
* `apiKey` your developer key
* `scope` authorization scope.  defaults to 'https://www.googleapis.com/auth/drive' (full access to google drive)
* `origin` the origin of your application.  Defaults to window.location.protocol + '//' + window.location.host
* `locale` defaults to 'en' (english)
* `views` refer to https://developers.google.com/picker/docs/reference
* `features` refer to https://developers.google.com/picker/docs/reference

