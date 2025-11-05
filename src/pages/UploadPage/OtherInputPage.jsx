/* eslint-disable no-unused-vars */
import styled from "styled-components";

export default function OtherInputPage({ onPrev }) {
  // onPrev는 나중에 이전 버튼 추가 시 사용 예정
  return (
    <OtherInputPageWrapper>
      <Title>기타 입력</Title>
      <Content>기타 입력 페이지</Content>
    </OtherInputPageWrapper>
  );
}

const OtherInputPageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  color: var(--B-Blue-line, #00aeff);
  font-family: Pretendard;
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.32px;
  margin-bottom: 1.5rem;
`;

const Content = styled.div`
  color: var(--B-T, #454545);
  font-family: Pretendard;
  font-size: 23px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.23px;
`;
