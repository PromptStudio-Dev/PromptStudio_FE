import styled from "styled-components";
import NextButtonIconImage from "./assets/nextButtonIcon.svg";

export default function UploadTemplate({ onNext }) {
  return (
    <UploadTemplateWrapper>
      <Title>프롬프트 템플릿</Title>
      <Explain>
        [주제], [자기소개서 초안] 처럼 다른 사용자들에게 입력 받고 싶은 항목을
        대괄호로 감싸주세요.
      </Explain>
      <ContentInput placeholder="프롬프트 템플릿을 입력해주세요." />
      <NextButton onClick={onNext}>
        <NextButtonText>다음</NextButtonText>
        <NextButtonIcon src={NextButtonIconImage} />
      </NextButton>
    </UploadTemplateWrapper>
  );
}

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
  align-self: flex-end;
  margin-top: 1rem;
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
  margin-right: 0.2rem;
`;

const NextButtonIcon = styled.img`
  width: 1.875rem;
  height: 1.875rem;
  display: block;
  flex-shrink: 0;
`;

const UploadTemplateWrapper = styled.div`
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

const Explain = styled.span`
  color: var(--B-T, #454545);
  font-family: Pretendard;
  font-size: 23px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.23px;
  margin-left: 1rem;
  margin-bottom: 1.5rem;
`;

const ContentInput = styled.input`
  width: 100%;
  height: 35vh;
  border-radius: 16px;
  margin-bottom: 5.06rem;
  border: 2px solid var(--Light-blue, #49d8ff);
`;
