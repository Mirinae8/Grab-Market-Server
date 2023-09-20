// node는 es6문법을 사용하지 않고 common JS문법이라 모듈 반출,호출시 명령어가 다르다
// React는 node를 쓰지만 변형을해 es6문법 사용 가능

// 변수를 선언해 import
var http = require("http");
var hostname = "127.0.0.1";
var port = 8080;

// 서버 만드는 명령어
// 요청 정보가 req, 응답을 시 정보가 res
const server = http.createServer(function (req, res) {
  //   console.log("REQUEST :", req);
  //   res.end("Hello Client!");
  const path = req.url;
  const method = req.method;
  if (path === "/products") {
    if (method === "GET") {
      // 헤드 부분에 스테이터스 코드 (정상일때 200) 와 객체를 넣어줌 (서버의 응답이 어떤 형식인지 명시)
      res.writeHead(200, { "Content-Type": "application/json" });
      // node.js 의 end 함수 첫번째 인자는 String 형태여야 한다
      // 배열객체를 String 형태로 바꾸기 위해 함수 사용
      const products = JSON.stringify([
        {
          name: "농구공",
          price: 5000,
        },
      ]);
      res.end(products);
    } else if (method === "POST") {
      res.end("생성되었습니다!");
    }
  }
});

server.listen(port, hostname);

console.log("grab market server on!");
