import { SubscriptionDetail } from "@/types";
import { Col, Row, Image } from "antd";
import Paragraph from "antd/es/typography/Paragraph";

export default function PodcastHero(hero: SubscriptionDetail) {
  return (
    <div>
      <h1>{hero.text}</h1>
      <Row gutter={[1, 1]}>
        <Col span={3}>
          {" "}
          <Image src={hero.image} />
        </Col>
        <Col span={10}>
          <Paragraph>{hero.description}</Paragraph>
        </Col>
      </Row>
    </div>
  );
}
