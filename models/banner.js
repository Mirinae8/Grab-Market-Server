module.exports = function (sequelize, dataTypes) {
  const banner = sequelize.define("Banner", {
    imageUrl: {
      // 이미지 주소
      type: dataTypes.STRING(300),
      allowNull: false,
    },
    href: {
      // 클릭시 넘어갈 주소
      type: dataTypes.STRING(200),
      allowNull: false,
    },
  });
  return banner;
};
