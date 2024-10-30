import HomeTitle from "../components/home/HomeTitle";
import image from "../assets/about.jpg";
import { Row, Col } from "react-bootstrap";

const AboutScreen = () => {
  return (
    <>
      <Row>
        <Col md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }}>
          <img src={image} alt="Về Chúng Tôi" className="w-100 rounded-3 mt-4" />
        </Col>
        <HomeTitle title="Về Chúng Tôi" />
      </Row>
      <Row className="about-content">
        <Col md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }}>
          <p>
            Trang web này là một dự án tôi sử dụng để thực hành lập trình full-stack.
            Tôi chỉ bịa ra nội dung dưới đây để lấp đầy khoảng trống XD.
          </p>
          <h4>Về Chúng Tôi</h4>
          <p>
            Petizen là một công ty đam mê với thú cưng và chủ của chúng.
            Chúng tôi tin rằng thú cưng là một phần của gia đình và xứng đáng nhận được sự chăm sóc tốt nhất.
            Đó là lý do chúng tôi cung cấp một loạt các sản phẩm thú cưng chất lượng cao, từ thức ăn và đồ ăn vặt đến đồ chơi và phụ kiện.
            Chúng tôi cũng cung cấp thông tin và tài nguyên hữu ích để giúp bạn giữ cho thú cưng của mình hạnh phúc và khỏe mạnh.
          </p>
          <h4>Sứ Mệnh Của Chúng Tôi</h4>
          <p>
            Sứ mệnh của chúng tôi là cung cấp cho chủ thú cưng mọi thứ họ cần để
            mang lại cuộc sống tốt nhất cho thú cưng của họ. Chúng tôi nỗ lực cung cấp các sản phẩm
            an toàn, lành mạnh và phải chăng. Chúng tôi cũng muốn trở thành một
            tài nguyên quý giá cho các chủ thú cưng, cung cấp cho họ thông tin và hỗ trợ
            họ cần để chăm sóc thú cưng.
          </p>
          <h4>Giá Trị Của Chúng Tôi</h4>
          <p>Chúng tôi cam kết với các giá trị sau:</p>
          <ul>
            <li>
              Chất lượng: Chúng tôi chỉ cung cấp các sản phẩm chất lượng cao mà chúng tôi tin tưởng.
            </li>
            <li>
              An toàn: Chúng tôi cam kết đảm bảo an toàn cho thú cưng và chủ của chúng.
            </li>
            <li>
              Giá cả phải chăng: Chúng tôi muốn làm cho các sản phẩm của mình trở nên dễ tiếp cận với tất cả các chủ thú cưng.
            </li>
            <li>
              Giáo dục: Chúng tôi tin rằng các chủ thú cưng nên có quyền truy cập vào thông tin họ cần để chăm sóc thú cưng của mình.
            </li>
            <li>
              Cộng đồng: Chúng tôi cam kết xây dựng một cộng đồng mạnh mẽ của các chủ thú cưng.
            </li>
          </ul>
          <h4>Đội Ngũ Của Chúng Tôi</h4>
          <p>
            Đội ngũ yêu thú cưng của chúng tôi cam kết cung cấp cho bạn dịch vụ tốt nhất có thể.
            Chúng tôi có nhiều kiến thức về thú cưng và cách chăm sóc của chúng,
            và luôn sẵn lòng giúp bạn tìm những sản phẩm phù hợp cho thú cưng của mình.
          </p>
          <h4>Cam Kết Của Chúng Tôi Đối Với Bạn</h4>
          <p>
            Chúng tôi cam kết cung cấp cho bạn những sản phẩm, dịch vụ và tài nguyên tốt nhất có thể.
            Chúng tôi muốn giúp bạn mang lại cuộc sống tốt nhất cho thú cưng của mình.
          </p>
          <h4>Gia Nhập Gia Đình</h4>
          <p>
            Chúng tôi mời bạn gia nhập gia đình Petizen.
            Chúng tôi cam kết cung cấp cho bạn mọi thứ bạn cần để mang lại cuộc sống tốt nhất cho thú cưng của mình.
          </p>
        </Col>
      </Row>
    </>
  );
};

export default AboutScreen;
