const http = require('node:http');
const fs = require('node:fs');

const server = http.createServer(function (req, res) {
  console.log(req.url)
  if (req.url === '/' || req.url === '/index.html') {
    sendFile(res, 'index.html', 'text/html')
  } else if (req.url === '/admin_login') {
    sendFile(res, 'admin_login.html', 'text/html')
  } else if (req.url === '/cart.html') {
    sendFile(res, 'cart.html', 'text/html')
  } else if (req.url === '/cat.html') {
    sendFile(res, 'cat.html', 'text/html')
  } else if (req.url === '/cat2.html') {
    sendFile(res, 'cat2.html', 'text/html')
  } else if (req.url === '/cat3.html') {
    sendFile(res, 'cat3.html', 'text/html')
  } else if (req.url === '/cat4.html') {
    sendFile(res, 'cat4.html', 'text/html')
  } else if (req.url === '/cat5.html') {
    sendFile(res, 'cat5.html', 'text/html')
  } else if (req.url === '/cat6.html') {
    sendFile(res, 'cat6.html', 'text/html')
  } else if (req.url === '/cat7.html') {
    sendFile(res, 'cat7.html', 'text/html')
  } else if (req.url === '/catalog.html') {
    sendFile(res, 'catalog.html', 'text/html')
  } else if (req.url === '/login.html') {
    sendFile(res, 'login.html', 'text/html')
  } else if (req.url === '/orders.html') {
    sendFile(res, 'orders.html', 'text/html')
  } else if (req.url.startsWith('/product_')) {
    sendFile(res, req.url.slice(1), 'text/html')
  } else if (req.url === '/profile.html') {
    sendFile(res, 'profile.html', 'text/html')
  } else if (req.url === '/reg.html') {
    sendFile(res, 'reg.html', 'text/html')
  } else if (req.url.startsWith('/img/') && req.url.endsWith('.webp')) {
    sendFile(res, req.url.slice(1), 'image/webp')
  } else if (req.url.startsWith('/img/') && req.url.endsWith('.jpg')) {
    sendFile(res, req.url.slice(1), 'image/jpg')
  } else if (req.url.startsWith('/img/') && req.url.endsWith('.jpeg')) {
    sendFile(res, req.url.slice(1), 'image/jpeg')
  } else if (req.url === '/css/main.css') {
    sendFile(res, 'css/main.css', 'text/css')
  } else if (req.url === '/css/vendor.css') {
    sendFile(res, 'css/vendor.css', 'text/css')
  } else if (req.url === '/js/main.js') {
    sendFile(res, 'js/main.js', 'application/javascript')
  } else if (req.url === '/admin') {
    fs.readFile('data.json', function (error, data1) {
      const data2 = JSON.parse(data1)
      if (req.headers.cookie === data2.admin.cookie) {
        sendFile(res, 'admin.html', 'text/html')
      } else {
        res.writeHead(301, { 'Location': '/admin_login' });
        res.end();
      }
    })
  } else if (req.url === '/create_user') {
    let data = ''
    req.on('data', function (chunk) {
      data += chunk
    })
    req.on('end', function () {
      fs.readFile('data.json', function (error, data1) {
        let newUser = JSON.parse(data)
        const data2 = JSON.parse(data1)
        const users = data2.users
        for (const user of users) {
          if (user.email === newUser.email || user.phone === newUser.phone) {
            res.writeHead(500);
            res.end();
            return
          }
        }
        newUser = { id: users.length + 1, ...newUser, address: null, cookie: null }
        users.push(newUser)
        fs.writeFile('data.json', JSON.stringify(data2, undefined, 4), function () {
          res.writeHead(200);
          res.end();
        })
      })
    })
  } else if (req.url === '/authenticate_user') {
    let data = ''
    req.on('data', function (chunk) {
      data += chunk
    })
    req.on('end', function () {
      fs.readFile('data.json', function (error, data1) {
        let newUser = JSON.parse(data)
        const data2 = JSON.parse(data1)
        const users = data2.users
        for (const user of users) {
          if (user.email === newUser.email || user.password === newUser.password) {
            const cookie = createCookie()
            user.cookie = cookie
            fs.writeFile('data.json', JSON.stringify(data2, undefined, 4), function () {
              res.writeHead(200, { 'Content-Type': 'application/json', 'Set-Cookie': cookie });
              const result = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                orders: [],
                current_order: []
              }
              res.end(JSON.stringify(result));
            })
            return
          }
        }
        res.writeHead(500);
        res.end();
      })
    })
  } else if (req.url === '/authenticate_admin') {
    let data = ''
    req.on('data', function (chunk) {
      data += chunk
    })
    req.on('end', function () {
      fs.readFile('data.json', function (error, data1) {
        const data2 = JSON.parse(data1)
        if (data === data2.admin.password) {
          const cookie = createCookie()
          data2.admin.cookie = cookie
          fs.writeFile('data.json', JSON.stringify(data2, undefined, 4), function () {
            res.writeHead(200, { 'Content-Type': 'application/json', 'Set-Cookie': cookie });
            const result = {
              users: data2.users,
              orders: data2.orders,
              products: data2.products
            }
            res.end(JSON.stringify(result));
          })
        } else {
          res.writeHead(401);
          res.end();
        }
      })
    })
  } else if (req.url === '/admin_logout') {
    fs.readFile('data.json', function (error, data1) {
      const data2 = JSON.parse(data1)
      if (req.headers.cookie === data2.admin.cookie) {
        data2.admin.cookie = null
        fs.writeFile('data.json', JSON.stringify(data2, undefined, 4), function () {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end();
        })
      } else {
        res.writeHead(401);
        res.end();
      }
    })
  } else if (req.url === '/add_new_product') {
    let data = ''
    req.on('data', function (chunk) {
      data += chunk
    })
    req.on('end', function () {
      fs.readFile('data.json', function (error, data1) {
        const newProduct = JSON.parse(data)
        const data2 = JSON.parse(data1)
        data2.products.push(newProduct)
        data2.admin.cookie = null
        fs.writeFile('data.json', JSON.stringify(data2, undefined, 4), function () {
          res.writeHead(200);
          res.end();
        })
      })
    })
  } else if (req.url === '/update_cart') {
    updateCart(req, res)
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      reason: 'Route does not exist',
      success: false
    }));
  }
});

function updateCart(req, res){
  let data = ''
  req.on('data', function (chunk) {
    data += chunk
  })
  req.on('end', function () {
    fs.readFile('data.json', function (error, data1) {
      const query = JSON.parse(data)
      const data2 = JSON.parse(data1)
      if(query.newOrder){
        const order = {
          id: data2.orders.length + 1,
          user_id: 123,
          items: query.items,
          completed: false
        }
        data2.orders.push(order)
      } else {
        for (const order of data2.orders){
          if (order.id === query.id){
              order.items = query.items
          }
        }
      }
      fs.writeFile('data.json', JSON.stringify(data2, undefined, 4), function () {
        res.writeHead(200);
        res.end();
      })
    })
  })
}

function sendFile(res, filename, contentType) {
  fs.readFile(filename, function (error, data) {
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  })
}

function createCookie() {
  let cookie = ''
  while (cookie.length < 25) {
    cookie += Math.random().toString(36).split('.')[1]
  }
  return cookie
}

server.listen(8000);