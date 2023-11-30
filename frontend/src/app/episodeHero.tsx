import { SubscriptionDetail } from "@/types";
import { Col, Row, Image } from "antd";
import { Typography } from "antd";
const { Paragraph } = Typography;

export default function PodcastHero(hero: SubscriptionDetail) {
  return (
    <div>
      <h1>{hero.text}</h1>
      <Row gutter={[20, 8]}>
        <Col span={5}>
          {" "}
          <Image src={hero.image} />
        </Col>
        <Col span={15}>
          <Paragraph>{hero.description}</Paragraph>
        </Col>
      </Row>
    </div>
  );
}
