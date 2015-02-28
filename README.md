# koa-dot
doT for koa with pre-processing and layout support

```
npm install koa-dot --save
```

[doT templates](http://olado.github.io/doT/) have compile-time defines that makes using them with existing rendering middlewares difficult. This middleware uses doT.process that pre-compiles all templates in a folder.

It also allows easily replace interpolation symbols (e.g. to use doT templates together with angular) without redefining all interpolation patterns manually.

If you need to compile additional templates in some other folder (e.g., if you need dynamically defined partials), you can use process or compile functions that are exposed as properties (as well as other doT properties):

```
process = require('koa-dot').process;
var subviews = process({ path: './views/subviews' });

// inside middleware
// ...
this.state.subviews = subviews;
yield this.render('view');
// ...
```

#### Middleware

```
var app = require('koa')()
    , dot = require('koa-dot');


app
  .use(dot({
    // other options supported by doT.process can be passed here
    path: './views',
    layout: true, // false by default, can be layout view name
    // body: 'body', // 'body' is default, only used with layout
    interpolation: { start: '<%', end: '%>' } // allows to replace '{{' and '}}'
  }))
  .use(function *() {
    this.state.title = 'Home';
    yield this.render('home');
    // data can be passed as 2nd argument, this.state is used by default
  });
```

#### Templates

layout.dot

```
<!DOCTYPE html>
<html>
<head>
    <title><%= it.title %></title>
</head>
<body>
    <%= it.body %>
</body>
</html>
```

home.dot

```
<div>Hello world!</div>
```
