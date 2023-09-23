const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const models = require("./models");
const multer = require("multer");
// multer 사용시 한 번 감싸줘야 함
// 파일을 저장할 위치를 정하고 반한되는 객체를 받아옴
// const upload = multer({ dest: "uploads/" });
// 위와 같이 dest만 정하면 저장할때 파일명이 바뀜
const upload = multer({
  storage: multer.diskStorage({
    // 어이다 저장할건지 (cb를 받아서 두번째 매개변수 디렉토리에 저장하겠다)
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    // 어떤 이름으로 저장할지
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

// express서버에서 json 형식의 데이터를 처리할 수 있도록
app.use(express.json());
// 모든 브라우저에서 이 서버에 요청 가능
app.use(cors());
// get,포스트 등의 처리를 할 때 그 위에 express 관련 설정을 해줌
// 서버에서 파일들을 보여줄때 다른 경로로 보여줘야함 (앞서 설정한 경로로 보여주게 만들기 위해서 하는 과정)
app.use("/uploads", express.static("uploads"));

// 배너 주는 api
app.get("/banners", (req, res) => {
  // 서버에서 가져오기
  models.Banner.findAll({
    // 한 번에 조회할 개수 제한
    limit: 2,
  })
    .then((result) => {
      res.send({
        banners: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생했습니다.");
    });
});

// 람다 함수로
// 첫번째 매개변수의 경로로 get 메소드가 호출 되었을때 두번째 매개변수인 익명함수가 실행된다
app.get("/products", (req, res) => {
  // 주소의 쿼리 보기
  const query = req.query;
  console.log("QUERY:", query);

  // 해당 테이블의 모든걸 가져오는 함수
  models.Product.findAll({
    // 정렬 방법 설정
    order: [["createdAt", "DESC"]],
    // 가져올 속성(컬럼)을 지정
    attributes: [
      "id",
      "name",
      "price",
      "createdAt",
      "seller",
      "imageUrl",
      "soldout",
    ],
    // 조건 (한번에 조회할 개수 제한)
    // limit: 1,
    // 전체 데이터중 조건에 맞는걸 찾으려고 할 때
    // where :{

    // }
  })
    .then((result) => {
      console.log("PRODCUTS : ", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("에러 발생");
    });
  // res.send({
  //   products: [
  //     {
  //       id: 1,
  //       name: "농구공",
  //       price: 100000,
  //       seller: "조던",
  //       imageUrl: "images/products/basketball1.jpeg",
  //     },
  //     {
  //       id: 2,
  //       name: "축구공",
  //       price: 50000,
  //       seller: "메시",
  //       imageUrl: "images/products/soccerball1.jpg",
  //     },
  //     {
  //       id: 3,
  //       name: "키보드",
  //       price: 10000,
  //       seller: "그랩",
  //       imageUrl: "images/products/keyboard1.jpg",
  //     },
  //   ],
  // });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, description, price, seller, imageUrl } = body;
  // 허용되지 않은 Null 값이 들어가는 경우 방지 위해서 (방어코드)
  if (!name || !description || !price || !seller || !imageUrl) {
    // 보내는 스테이터스 코드 변경 (사용자가 잘못했다는 의미의 400번대)
    res.status(400).send("모든 필드를 입력해주세요");
  }
  // 비동기 처리를 한다
  models.Product.create({
    name,
    description,
    price,
    seller,
    imageUrl,
  })
    .then((result) => {
      console.log("상품 생성 결과 :", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 업로드에 문제가 발생했습니다");
    });

  //   es6 문법에서는 키와 밸류의 이름이 같으면 하나만 적으면된다
  // res.send({
  //   // body: body
  //   body,
  // });
});

// 주소에서 파라미터 가져와서 동적으로 경로 관리
// "/products/:id/event/:eventId" 같은 주소도 가능
app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  // 하나의 객체만 가져오기위해 findOne() 복수는 findAll()
  models.Product.findOne({
    // 조건문
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("PRODUCT : ", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 조회에 에러가 발생했습니다");
    });
});

// single() 은 파일 하나만 보낼 때 (매개변수는 키 명칭)
app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    // 파일 정보중에 패스만 가져옴
    imageUrl: file.path,
  });
});

// 결제하기용 api
// 데이터에 변화를 줄 때는 보통 post 요청
app.post("/purchase/:id", (req, res) => {
  // destructuring
  const { id } = req.params;
  // 첫번째 매개변수는 뭘 업데이트 시켜줄 것이냐
  models.Product.update(
    {
      soldout: 1,
    },
    {
      where: {
        // 축약 표현 id: id
        id,
      },
    }
  )
    .then((result) => {
      res.send({
        result: true,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생했습니다.");
    });
});

// listen을 통해 본격적으로 서버가 실행, 두번째 인자에 콜백함수를 넣을 수 있고
// express가 잘 동작하면 해당 함수가 동작
app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다.");
  // ./models의 내용이 구현된 서버와 연동하는 부분
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공!");
    })
    .catch((err) => {
      console.error(err);
      console.log("DB 연결 에러");
      process.exit();
    });
});
