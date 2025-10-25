import React, { useState } from "react";
import styled from "styled-components";

function PromptTitleInput() {
  const [title, setTitle] = useState("");

  return (
    <TitleInputWrapper>
      <TitleInput
        type="text"
        placeholder="프롬프트 제목을 입력하세요."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Underline />
    </TitleInputWrapper>
  );
}

export default PromptTitleInput;

const TitleInputWrapper = styled.div`
  width: 100%;
  max-width: 401px;
  position: relative;
`;

const TitleInput = styled.input`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 2.25rem;
  font-weight: 600;
  color: #848484;
  background: transparent;
  border: none;
  outline: none;
  padding: 0.5rem 0;

  &::placeholder {
    color: #e1e1e0;
  }

  &:focus {
    color: #454545;
  }
`;

const Underline = styled.div`
  width: 22.5vw;
  height: 2px;
  background-color: #f2f2f2;
  margin-top: 0.5vh;
`;
