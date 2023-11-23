# Readme만들고갈게요

상태: 시작 전

# 🔮GPTI

[Korean](https://github.com/nbsp1221/klas-helper)

openAI를 사용해 MBTI사이의 특정 활동에서 장점, 단점, 주의할 점을 확인합니다.

---

## 안내 사항

'GPTI'는 오직 재미만을 목적으로 제작된 프로그램입니다.

사용자의 질문에 대해 최대한 정확한 답변을 제공하기 위해 노력합니다만, 'GPTI'는 실시간 정보나 신뢰성 있는 소스를 제공하지는 않습니다.

따라서 제공되는 정보를 받아들일 때에는 너무 맹신하거나 절대적인 것으로 받아들이지 않도록 주의하시기 바랍니다.

---

## 기능

- 2명의 MBTI를 입력 받아 직장, 연애, 생활, 식문화 등의 궁합 결과를 AI로 받아 볼 수 있는 프로그램입니다.
- 테스트를 결과로 공통의 관심사를 가진 사람과 대화할 수 있도록 오픈채팅방 기능도 있습니다.
- 오픈카톡목록 보기 버튼을 누르면 등장하는 만족도 조사를 통해 높은 만족도를 받은 답변은 이 후 답변을 생성할 때 참조되어 더욱 발전된 답변을 제공합니다.

---

## 설치

1. [https://github.com/leekiho-powercore/talkative_sheep_warrior](https://github.com/leekiho-powercore/talkative_sheep_warrior) 로 들어가 파일을 다운 받습니다.
2. 프로젝트 최 상단에 .env파일을 추가하여 내용을 작성합니다.(하단 .env양식 참고)

```jsx
DATABASE =
DATABASE_HOST =
DATABASE_USER =
DATABASE_PASSWORD =
DATABASE_PORT =
JWT_SECRET =
JWT_EXPIRES_IN =
JWT_COOKIE_EXPIRES =
OPENAI_API_KEY =
```

1. 터미널을 실행하신 뒤 npm i openai를 입력하여 모듈을 설치합니다.
2. npm start를 하시고 브라우저 검색창에서 localhost:3000을 입력하시면 프로그램을 사용하실 수 있습니다.
3. 위 방법은 local에서 실행하는 방법이며, [gpti.iptime.org](http://gpti.iptime.org/)로 접속하시면 프로젝트를 확인하실 수 있습니다.

---

## 사용방법

- 첫 화면 start버튼을 누릅니다.

[https://lh7-us.googleusercontent.com/U0-svovEYZC4CDMkFhhrKdm5y7LnAvQ-E5vHnXObRElpv5yNrF99wbmtLhgjwjfPCcSpj8156dobITdV1OfwawqRTm10pVoqE6z-QDA2sJ-xhI8P7SBWDh-KcFkrk39SEH1ZMAU3q6rNKhsERCGMueA](https://lh7-us.googleusercontent.com/U0-svovEYZC4CDMkFhhrKdm5y7LnAvQ-E5vHnXObRElpv5yNrF99wbmtLhgjwjfPCcSpj8156dobITdV1OfwawqRTm10pVoqE6z-QDA2sJ-xhI8P7SBWDh-KcFkrk39SEH1ZMAU3q6rNKhsERCGMueA)

- 미 로그인시 로그인 페이지로 이동하며 회원이신 분은 로그인을 진행하시고, 아니라면 회원가입을 진행하신 뒤 로그인하시면 됩니다.

[https://lh7-us.googleusercontent.com/0G6--dfFd_mYiAnyhaNSeCQfXxKqfwx0blHm8gqGQr_KQok99Vr1kRhO2J4nYBT54HjguVp-q1-oGOLsVXMH-5-MMw5uGmQMRv7T3VtfbcZwA4SDEMCphvebeDdMIqtYd07GmZlLATSsk0HhX0gehqY](https://lh7-us.googleusercontent.com/0G6--dfFd_mYiAnyhaNSeCQfXxKqfwx0blHm8gqGQr_KQok99Vr1kRhO2J4nYBT54HjguVp-q1-oGOLsVXMH-5-MMw5uGmQMRv7T3VtfbcZwA4SDEMCphvebeDdMIqtYd07GmZlLATSsk0HhX0gehqY)

- start 버튼을 누르면 궁합 검사 페이지로 들어오게 됩니다. 내 mbti는 회원가입 때 입력한 mbti로 고정되며, 프로필에서 수정 가능힙니다. 이제 궁합을 맞춰볼 상대의 mbti의 버튼을 선택하신 뒤 다음 버튼을 누릅니다.

[https://lh7-us.googleusercontent.com/fXC3do7GYRSB9u4RXoKH2vrg05dsfC-CBndKENhFxDZOVI-J7x02h41mu5qhPv5esZrDpoH3qtbCv2WJDOg5KfyXVNo8AbJtcUkX63VF1qYEt_xsrkAGUnMPIzDulYNJvRvdmLjy8r572MKTZk-fFqU](https://lh7-us.googleusercontent.com/fXC3do7GYRSB9u4RXoKH2vrg05dsfC-CBndKENhFxDZOVI-J7x02h41mu5qhPv5esZrDpoH3qtbCv2WJDOg5KfyXVNo8AbJtcUkX63VF1qYEt_xsrkAGUnMPIzDulYNJvRvdmLjy8r572MKTZk-fFqU)

- 다음 버튼을 누르면 질문할 단어가 나옵니다. 여기서 궁합을 맞춰볼 단어를 선택해 주시고, submit버튼을 누릅니다.

[https://lh7-us.googleusercontent.com/r3dOC8ciYgrEGrQurwCaq2FnC0sGLs9wpQ5r5nWhg5UEl_1PuiADfhKsgnXYuLZpyIERmfZNYP-nQgFQQxcnWUWFT4_PY8hGAXvhpD7Bmdx1ydu7NdDe-G4JQLSlS0vD4XhzeVx2tslEhsGCVVzTnEg](https://lh7-us.googleusercontent.com/r3dOC8ciYgrEGrQurwCaq2FnC0sGLs9wpQ5r5nWhg5UEl_1PuiADfhKsgnXYuLZpyIERmfZNYP-nQgFQQxcnWUWFT4_PY8hGAXvhpD7Bmdx1ydu7NdDe-G4JQLSlS0vD4XhzeVx2tslEhsGCVVzTnEg)

- 로딩이 끝나면, gpt를 통해서 2명의 mbti의 궁합도와 장점, 단점, 조심할 점이 나옵니다.

[https://lh7-us.googleusercontent.com/c0fHgCGuw2U-6S1D7uvxa8gNE_VbjhpUlQYhdEfdn8La5OhugOCZDD-aLp-w57D49ahpXhcV8sBpTtd7_wH7vTVbgyWWk74OhgQOPewjmfjRbwUSJUGPdL76L--oT-9B8Nhck0lhw4sICG_JuoOYM7U](https://lh7-us.googleusercontent.com/c0fHgCGuw2U-6S1D7uvxa8gNE_VbjhpUlQYhdEfdn8La5OhugOCZDD-aLp-w57D49ahpXhcV8sBpTtd7_wH7vTVbgyWWk74OhgQOPewjmfjRbwUSJUGPdL76L--oT-9B8Nhck0lhw4sICG_JuoOYM7U)

- 추가로 궁합 키워드 및 관심사, 궁금한 mbti의 사람들과 대화하고 싶다면 하단 오픈카톡 목록 보기 버튼을 눌러 만족도 조사를 하신 뒤 오픈카톡 목록을 확인하시면 됩니다.

[https://lh7-us.googleusercontent.com/BeaA2xGM5rZ9HRyFNs3G8p1RvNmiGxaFMonzS2bvXOdJwiHBWYf6AQE9eEmsu7vPCvL3ublx2hEJXUo46Q_wU931N5r4WlYb2D9yNij_yryhb8iqokhkF3YnH39ncjM_7kl97rzZkAnpBHN69lDXC0k](https://lh7-us.googleusercontent.com/BeaA2xGM5rZ9HRyFNs3G8p1RvNmiGxaFMonzS2bvXOdJwiHBWYf6AQE9eEmsu7vPCvL3ublx2hEJXUo46Q_wU931N5r4WlYb2D9yNij_yryhb8iqokhkF3YnH39ncjM_7kl97rzZkAnpBHN69lDXC0k)

- 이동한 페이지에서 이전에 만들어 놓은 톡방의 사람들과 대화할 수 있으며, 내 링크 만들기 버튼을 클릭해 자신의 톡방도 등록하여 다른 이들과 대화하실 수 있습니다.

[https://lh7-us.googleusercontent.com/02Aa1HLx9qAFAnYVVUL94lQmTbJfdCPd2Tb3APXjN2PZ9-Q1SvVyBA9si2lGzipyVEiF53WknmpRi_0mW8iyJ9r1HrY-MTQCQoAEQ_XGyoArsawWVPmHhKVbCLNFuKQC7DUeYfQ1Zrtj8h5-8b_hYf8](https://lh7-us.googleusercontent.com/02Aa1HLx9qAFAnYVVUL94lQmTbJfdCPd2Tb3APXjN2PZ9-Q1SvVyBA9si2lGzipyVEiF53WknmpRi_0mW8iyJ9r1HrY-MTQCQoAEQ_XGyoArsawWVPmHhKVbCLNFuKQC7DUeYfQ1Zrtj8h5-8b_hYf8)
