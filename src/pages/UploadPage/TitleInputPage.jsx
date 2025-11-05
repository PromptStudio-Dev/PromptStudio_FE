import styled from "styled-components";
import NextButtonIconImage from "./assets/nextButtonIcon.svg";

export default function TitleInputPage({ onNext, onPrev }) {
  return (
    <TitleInputPageWrapper>
      <TitleSection>
        <Title>프롬프트 제목</Title>
        <TitleInput placeholder="프롬프트 제목을 입력해주세요." />
      </TitleSection>
      <DescriptionSection>
        <Title>프롬프트 설명</Title>
        <TitleInput placeholder="프롬프트의 설명을 입력해주세요." />
      </DescriptionSection>
      <ButtonContainer>
        <PrevButton onClick={onPrev}>
          <PrevButtonIcon src={NextButtonIconImage} />
          <PrevButtonText>이전</PrevButtonText>
        </PrevButton>
        <NextButton onClick={onNext}>
          <NextButtonText>다음</NextButtonText>
          <NextButtonIcon src={NextButtonIconImage} />
        </NextButton>
      </ButtonContainer>
    </TitleInputPageWrapper>
  );
}

const TitleInputPageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TitleSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const DescriptionSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 5.62rem;
`;

const Title = styled.span`
  color: var(--B-Blue-line, #00aeff);
  font-family: Pretendard;
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  margin-bottom: 1.38rem;
  line-height: normal;
  letter-spacing: 0.02rem;
`;

const TitleInput = styled.input`
  border-radius: 1rem;
  border: 2px solid var(--Light-blue, #49d8ff);
  padding: 1.38rem 2.25rem;
  font-size: 1.8125rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: var(--B-A6, #a6a6a6);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const PrevButton = styled.button`
  width: 7.5rem;
  height: 3.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7.5rem;
  background: #f3f3f3;
  padding: 0.72rem 1rem;
  border: none;
`;

const PrevButtonIcon = styled.img`
  width: 1.875rem;
  height: 1.875rem;
  display: block;
  flex-shrink: 0;
  transform: rotate(180deg);
`;

const PrevButtonText = styled.span`
  color: var(--B-T, #454545);
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem;
  letter-spacing: 0.01438rem;
  display: flex;
  align-items: center;
`;

const NextButton = styled.button`
  width: 7.5rem;
  height: 3.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7.5rem;
  background: #f3f3f3;
  padding: 0.72rem 1rem;
  border: none;
`;

const NextButtonText = styled.span`
  color: var(--B-T, #454545);
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 1.4375rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem;
  letter-spacing: 0.01438rem;
  display: flex;
  align-items: center;
`;

const NextButtonIcon = styled.img`
  width: 1.875rem;
  height: 1.875rem;
  display: block;
  flex-shrink: 0;
`;
