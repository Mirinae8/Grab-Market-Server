const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;

// express서버에서 json 형식의 데이터를 처리할 수 있도록
app.use(express.json());
// 모든 브라우저에서 이 서버에 요청 가능
app.use(cors());

// 람다 함수로
// 첫번째 매개변수의 경로로 get 메소드가 호출 되었을때 두번째 매개변수인 익명함수가 실행된다
app.get("/products", (req, res) => {
  const query = req.query;
  console.log("QUERY:", query);
  res.send({
    products: [
      {
        id: 1,
        name: "농구공",
        price: 100000,
        seller: "조던",
        imageUrl: "images/products/basketball1.jpeg",
      },
      {
        id: 2,
        name: "축구공",
        price: 50000,
        seller: "메시",
        imageUrl: "images/products/soccerball1.jpg",
      },
      {
        id: 3,
        name: "키보드",
        price: 10000,
        seller: "그랩",
        imageUrl: "images/products/keyboard1.jpg",
      },
    ],
  });
});

app.post("/products", (req, res) => {
  const body = req.body;
  //   es6 문법에서는 키와 밸류의 이름이 같으면 하나만 적으면된다
  res.send({
    // body: body
    body,
  });
});

// 주소에서 파라미터 가져와서 동적으로 경로 관리
app.get("/products/:id/event/:eventId", (req, res) => {
  const params = req.params;
  const { id, eventId } = params;
  res.send(`id는 ${id}와 ${eventId} 입니다.`);
});

app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다.");
});
