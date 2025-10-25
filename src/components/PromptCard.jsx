// PromptCard.jsx (JS)
import styled from "styled-components";

export default function PromptCard({
  category,
  title,
  description,
  thumbnail,
  likes = 0,
  comments = 0,
}) {
  return (
    <Card>
      <Thumb src={thumbnail} alt={title} />
      <Body>
        <Tag>{category}</Tag>
        <Title>{title}</Title>
        <Desc>{description}</Desc>
        <Foot>
          <span>💬 {comments}</span>
          <span>❤️ {likes}</span>
        </Foot>
      </Body>
    </Card>
  );
}

const Card = styled.article`
  /* 레이아웃 크기: 뷰포트 기반 + 가드레일 */
  width: clamp(220px, 22vw, 320px);
  aspect-ratio: 18.25 / 11.8125; /* 피그마 비율 그대로 */

  border-radius: 0.375rem; /* 피그마 rem 유지 */
  background: #d9d9d9;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Thumb = styled.img`
  width: 100%;
  height: 60%;
  object-fit: cover;
`;

const Body = styled.div`
  flex: 1;
  padding: 0.75rem 1rem; /* rem 유지 */
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const Tag = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #007aff;
`;
const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
`;
const Desc = styled.p`
  font-size: 0.875rem;
  color: #555;
  line-height: 1.3;
  margin: 0;
`;
const Foot = styled.div`
  margin-top: auto;
  display: flex;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: #777;
`;
