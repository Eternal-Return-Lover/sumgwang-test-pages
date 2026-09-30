// This source-only manifest is never loaded by the target website.
const offer = '온라인 카지노 신규 회원 첫 충전 보너스 30% 지급, 지금 가입하고 슬롯 무료 체험';
const adult = '성인 전용 만남 광고, 비밀 영상 무제한 이용권 즉시 가입';
const loan = '신용 조회 없는 불법 개인 대출, 선입금 후 즉시 현금 지급';
const medicine = '처방전 없이 전문 의약품 판매, 해외 직구 즉시 주문';
const jamo = 'ㅋㅏㅈㅣㄴㅗ 신규 회원 ㅂㅗㄴㅓㅅㅡ 지급, 지금 가입';
export const fixtures = [
  { key:'T01', name:'전각 영문', text:'ｍｅｇａ－ＢＥＴ 신규 가입 첫 충전 30％, 온라인 카지노 보너스 지급', techniques:['HOMOGLYPH'], category:'free' },
  { key:'T02', name:'키릴 혼합', text:'САЅІΝО 신규 회원 슬롯 무료 체험, 첫 충전 보너스 지급', techniques:['HOMOGLYPH'], category:'free' },
  { key:'T03', name:'숫자 치환', text:'CAS1N0 가입 즉시 카지노 보너스, 온라인 베팅 신규 회원 모집', techniques:['HOMOGLYPH'], category:'life' },
  { key:'T04', name:'전각 한영 혼합', text:'온라인 ｃａｓｉｎｏ 첫충 30％ 보너스 지급, 신규 회원 모집', techniques:['HOMOGLYPH'], category:'free' },
  { key:'T05', name:'호환 자모', text:jamo, techniques:['JAMO'], category:'free' },
  { key:'T06', name:'조합 자모 NFD', text:'카지노 신규 가입 보너스, 온라인 슬롯 무료 체험'.normalize('NFD'), techniques:['JAMO'], category:'life' },
  { key:'T07', name:'자모 사이 공백', text:'ㅋ ㅏ ㅈ ㅣ ㄴ ㅗ 가입 보너스 지급, 첫 충전 30% 혜택', techniques:['JAMO'], category:'free' },
  { key:'T08', name:'일부 음절 자모', text:'온라인 카ㅈㅣ노 첫 충전 보너스 지급, 신규 회원 즉시 가입', techniques:['JAMO'], category:'free' },
  { key:'T09', name:'color:transparent', text:offer, style:'color:transparent', techniques:['TRANSPARENT'], category:'life' },
  { key:'T10', name:'opacity:0', text:adult, style:'opacity:0', techniques:['TRANSPARENT'], category:'free' },
  { key:'T11', name:'동일 배경색', text:offer, style:'color:rgb(255,255,255);background-color:rgb(255,255,255)', techniques:['TRANSPARENT'], category:'free' },
  { key:'T12', name:'부모 opacity:0', text:loan, parentStyle:'opacity:0', techniques:['TRANSPARENT'], category:'life' },
  { key:'T13', name:'알파 0 색상', text:medicine, style:'color:rgba(25,50,70,0)', techniques:['TRANSPARENT'], category:'life' },
  { key:'T14', name:'부모 색상 상속', text:offer, parentStyle:'color:transparent', techniques:['TRANSPARENT'], category:'free' },
  { key:'T15', name:'display:none', text:offer, style:'display:none', techniques:['OFFSCREEN'], category:'free' },
  { key:'T16', name:'음수 좌표', text:adult, style:'position:absolute;left:-9999px;top:0;width:420px', techniques:['OFFSCREEN'], category:'free' },
  { key:'T17', name:'글자 0px', text:offer, style:'font-size:0', techniques:['OFFSCREEN'], category:'life' },
  { key:'T18', name:'글자 1px', text:loan, style:'font-size:1px', techniques:['OFFSCREEN'], category:'free' },
  { key:'T19', name:'부모 display:none', text:medicine, parentStyle:'display:none', techniques:['OFFSCREEN'], category:'life' },
  { key:'T20', name:'상단 음수 고정 좌표', text:offer, style:'position:fixed;top:-4000px;left:0;width:400px', techniques:['OFFSCREEN'], category:'free' },
  { key:'T21', name:'전각 + 투명', text:'ｃａｓｉｎｏ 신규 회원 첫 충전 보너스 지급', style:'opacity:0', techniques:['HOMOGLYPH','TRANSPARENT'], category:'free' },
  { key:'T22', name:'자모 + display:none', text:jamo, style:'display:none', techniques:['JAMO','OFFSCREEN'], category:'life' },
  { key:'T23', name:'전각 + 화면 밖', text:'ｍｅｇａ－ＢＥＴ 카지노 가입 보너스 즉시 지급', style:'position:absolute;left:-9999px;width:300px', techniques:['HOMOGLYPH','OFFSCREEN'], category:'free' },
  { key:'T24', name:'자모 + 투명', text:jamo, style:'color:transparent', techniques:['JAMO','TRANSPARENT'], category:'free' },
  { key:'T25', name:'댓글 650ms 지연', text:'ｃａｓｉｎｏ 온라인 슬롯 무료 체험 신규 가입 보너스', delay:650, techniques:['HOMOGLYPH'], category:'free' },
  { key:'T26', name:'댓글 1600ms 지연', text:jamo, delay:1600, techniques:['JAMO'], category:'life' },
  { key:'T27', name:'댓글 2800ms 지연', text:offer, delay:2800, style:'opacity:0', techniques:['TRANSPARENT'], category:'free' },
  { key:'T28', name:'iframe 1단계', text:offer, frameDepth:1, style:'display:none', techniques:['OFFSCREEN'], category:'free' },
  { key:'T29', name:'iframe 2단계', text:jamo, frameDepth:2, techniques:['JAMO'], category:'life' },
  { key:'T30', name:'지연 iframe 2단계', text:'ｍｅｇａ－ＢＥＴ 온라인 카지노 첫충 보너스', frameDepth:2, delay:1200, style:'color:transparent', techniques:['HOMOGLYPH','TRANSPARENT'], category:'free' },
  { key:'T31', name:'동일 클래스 반복 형제', text:offer, repeat:true, style:'opacity:0', techniques:['TRANSPARENT'], category:'free' },
  { key:'T32', name:'한 요소 같은 기법 반복', text:jamo+' / ㅅㅡㄹㅗㅅㅡ 무료 체험 즉시 가입', techniques:['JAMO'], category:'free' },
  { key:'N01', name:'접근성 건너뛰기', text:'본문으로 바로가기', style:'position:absolute;left:-9999px', techniques:[], category:'notice' },
  { key:'N02', name:'숨겨진 정상 메뉴', text:'시민소통광장 이용 안내 메뉴', style:'display:none', techniques:[], category:'notice' },
  { key:'N03', name:'한글 교육 자료', text:'한글교실: ㅋㅏ는 카, ㄴㅏ는 나로 읽어요.', techniques:[], category:'life' },
  { key:'N04', name:'전각 정상 표기', text:'２０２６ 한빛시 ＢＯＯＫ ＦＡＩＲ 도서관 행사 안내', techniques:[], category:'notice' },
  { key:'N05', name:'예방 안내 문맥', text:'온라인 카지노 가입 보너스를 내세운 불법광고를 주의하세요. 도박 피해 예방 상담을 안내합니다.', techniques:[], category:'notice' },
  { key:'N06', name:'숨겨진 예방 안내', text:'카지노 가입 보너스 광고는 불법 도박 유도일 수 있습니다. 클릭하지 말고 신고하세요.', style:'display:none', techniques:[], category:'notice' },
  { key:'N07', name:'투명 정상 안내', text:'메뉴를 여는 중입니다. 잠시 기다려 주세요.', style:'opacity:0', techniques:[], category:'life' },
  { key:'N08', name:'화면 아래 정상 콘텐츠', text:'페이지 아래에 있는 일반 시민 안내문입니다. 화면 밖에 있어도 은닉 광고가 아닙니다.', parentStyle:'margin-top:1100px', techniques:[], category:'life' },
  { key:'N09', name:'혼합 언어 안내', text:'Добро пожаловать! Welcome to Hanbit. 다문화 가족 생활 안내입니다.', techniques:[], category:'life' },
  { key:'N10', name:'정상 금융 안내', text:'서민금융 상담은 공식 기관을 통해 확인하세요. 선입금을 요구하는 대출은 주의해야 합니다.', techniques:[], category:'notice' },
  { key:'N11', name:'정상 의약품 안내', text:'전문 의약품은 의사의 처방에 따라 복용하세요. 온라인 불법 판매에 주의하세요.', techniques:[], category:'notice' },
  { key:'N12', name:'운동 프로그램', text:'성인 수영교실 신규 회원을 모집합니다. 한빛체육센터에서 건강한 일상을 시작하세요.', techniques:[], category:'life' },
  { key:'T33', name:'5단계 링크 + 지연 발견', text:offer, style:'color:transparent', techniques:['TRANSPARENT'], category:'free', deep:true }
].map((f,i)=>({...f, postId:String(1047+i*37), index:i, path:f.deep?'archive/2026/autumn/read.html':`board/posts/${1047+i*37}.html`}));

export const queryFixtures = [
 { key:'Q01', postId:'1024', path:'board/view.html?id=1024&mode=public', name:'쿼리 분기 A', text:jamo, techniques:['JAMO'] },
 { key:'Q02', postId:'1180', path:'board/view.html?id=1180&mode=public', name:'쿼리 분기 B', text:offer, style:'display:none', techniques:['OFFSCREEN'] }
];

export const titles = ['한빛천 가을 산책길, 함께 걸어요','우리 동네 작은도서관 이용 후기','주말 문화 프로그램 정보를 나눕니다','중앙공원 자전거 거치대 이용 안내','동네에서 만난 작은 변화 이야기','10월 독서모임에 함께하실 분','우리 동네 생활 정보를 공유해요','시민광장 이용 후기를 남깁니다','가족과 함께하는 주말 계획','가을 야외 활동 장소를 추천해요','한빛문화센터 프로그램이 궁금해요','함께 가꾸는 마을 정원 이야기'];
export const authors = ['동네산책','책읽는시민','한빛이웃','파란자전거','일상기록','가을하늘','느린걸음','마을친구'];
