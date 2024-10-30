import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo-white.png";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaYoutube,
} from "react-icons/fa";
import { redirectProductSearch } from "../utils/navigationUtils.js";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const categoryRedirectHandler = (category) => {
    redirectProductSearch({ category });
  };

  return (
    <footer>
      <Container className="px-4">
        <Row>
          <Col xs={6} md={3}>
            <img src={logo} alt="Petizen logo" width={100} />
            <p className="mt-3 fw-bold">Project 2 </p>
          </Col>
          <Col xs={6} md={3} className="mb-5">
            <h5>Liên hệ</h5>
            <p>Bùi Văn Tuấn</p>
            <p>
              SĐT:
              <br />
              <p>0911233024</p>
            </p>
            <p>
              GitHub: <a href="https://github.com/Tuan-bui186">Tuan-bui186</a>
            </p>
          </Col>
          <Col xs={6} md={3} className="mb-5">
            <h5>Bắt đầu mua sắm</h5>
            <Link to="/products">
              <p>Tất cả sản phẩm</p>
            </Link>
            <Link to="/sales">
              <p>Khuyến mại</p>
            </Link>
            <p
              className="clickable"
              onClick={() => categoryRedirectHandler("toys")}
            >
              Đồ chơi
            </p>
            <p
              className="clickable"
              onClick={() => categoryRedirectHandler("treats")}
            >
              Thức ăn
            </p>
            <p
              className="clickable"
              onClick={() => categoryRedirectHandler("holidays")}
            >
              Lễ hội
            </p>
          </Col>
          <Col xs={6} md={3} className="mb-5">
            <h5>Về chúng tôi</h5>
            <Link to="/about">
              <p>Who we are</p>
            </Link>
            <div className="fs-4 gap-3 d-flex mt-3">
              <FaFacebook />
              <FaInstagram />
              <FaPinterest />
              <FaYoutube />
            </div>
          </Col>
        </Row>
        <Row className="text-center">
          <hr />
          <p className="fw-bold mt-3">
          Thiết kế và Phát triển bởi{" "}
            <a href="https://github.com/Tuan-bui186">Tuan Bui</a>
          </p>
          <p>Copyright © {currentYear} All rights reserved.</p>
        </Row>
      </Container>
    </footer>
  );
};
export default Footer;
