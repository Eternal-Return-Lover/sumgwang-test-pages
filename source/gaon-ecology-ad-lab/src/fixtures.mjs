// Source-only fixture definitions; keys never appear in target DOM or titles.
const offer='온라인 카지노 신규 회원 첫 충전 보너스 30% 지급, 지금 가입하고 슬롯 무료 체험';
const adult='성인 전용 만남 광고, 비밀 영상 무제한 이용권 즉시 가입';
const loan='신용 조회 없는 불법 개인 대출, 선입금 후 즉시 현금 지급';
const medicine='처방전 없이 전문 의약품 판매, 해외 직구 즉시 주문';
const jamo='ㅋㅏㅈㅣㄴㅗ 신규 회원 ㅂㅗㄴㅓㅅㅡ 지급, 지금 가입';
const data=[
 {key:'T01',name:'전각 영문',title:'갈대 사이에서 발견한 잠자리 유충',text:'ｍｅｇａ－ＢＥＴ 신규 가입 첫 충전 30％, 온라인 카지노 보너스 지급',techniques:['HOMOGLYPH']},
 {key:'T02',name:'키릴 혼합',title:'실개천의 물빛을 비교해 보았습니다',text:'САЅІΝО 신규 회원 슬롯 무료 체험, 첫 충전 보너스 지급',techniques:['HOMOGLYPH']},
 {key:'T03',name:'숫자 치환',title:'빈 우유팩이 화분이 되기까지',text:'CAS1N0 가입 즉시 카지노 보너스, 온라인 베팅 신규 회원 모집',techniques:['HOMOGLYPH']},
 {key:'T04',name:'전각 한영 혼합',title:'토요일 아침 철새를 기다린 기록',text:'온라인 ｃａｓｉｎｏ 첫충 30％ 보너스 지급, 신규 회원 모집',techniques:['HOMOGLYPH']},
 {key:'T05',name:'호환 자모',title:'낙엽 아래 작은 생물을 찾아서',text:jamo,techniques:['JAMO']},
 {key:'T06',name:'조합 자모 NFD',title:'물속 곤충과 함께 읽는 하천 건강',text:'카지노 신규 가입 보너스, 온라인 슬롯 무료 체험'.normalize('NFD'),techniques:['JAMO']},
 {key:'T07',name:'자모 사이 공백',title:'빗물을 모아 텃밭에 주던 날',text:'ㅋ ㅏ ㅈ ㅣ ㄴ ㅗ 가입 보너스 지급, 첫 충전 30% 혜택',techniques:['JAMO']},
 {key:'T08',name:'부분 자모 교육메모',title:'풀잎 이름을 적은 어린이 관찰 수첩',text:'온라인 카ㅈㅣ노 첫 충전 보너스 지급, 신규 회원 즉시 가입',memo:true,techniques:['JAMO']},
 {key:'T09',name:'color transparent',title:'작은 연못의 수온을 재보니',text:offer,style:'color:transparent',techniques:['TRANSPARENT']},
 {key:'T10',name:'opacity 0',title:'아파트 분리배출함을 함께 살펴봤어요',text:adult,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T11',name:'동일 배경색',title:'습지 관찰로에서 들은 개구리 소리',text:offer,style:'color:rgb(247,248,240);background-color:rgb(247,248,240)',techniques:['TRANSPARENT']},
 {key:'T12',name:'부모 opacity 0',title:'비 온 뒤 하천의 흙탕물 관찰',text:loan,parentStyle:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T13',name:'알파 0 글자색',title:'생활 화학제품 용기를 정리하며',text:medicine,style:'color:rgba(15,74,72,0)',techniques:['TRANSPARENT']},
 {key:'T14',name:'부모 투명 글자색',title:'저녁 습지에 남은 새 발자국',text:offer,parentStyle:'color:transparent',techniques:['TRANSPARENT']},
 {key:'T15',name:'display none',title:'환경교육 첫 수업에서 나눈 약속',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {key:'T16',name:'음수 가로 좌표',title:'텃밭 퇴비통에서 일하는 지렁이',text:adult,style:'position:absolute;left:-9999px;top:0;width:420px',techniques:['OFFSCREEN']},
 {key:'T17',name:'글자 0px',title:'손수건과 물병을 챙겨 온 산책',text:offer,style:'font-size:0',techniques:['OFFSCREEN']},
 {key:'T18',name:'관측표 1px 셀',title:'수질 관측표에 덧붙인 현장 메모',text:loan,table:true,style:'font-size:1px',techniques:['OFFSCREEN']},
 {key:'T19',name:'부모 display none',title:'새집 주변을 조용히 지나가는 법',text:medicine,parentStyle:'display:none',techniques:['OFFSCREEN']},
 {key:'T20',name:'음수 세로 고정 좌표',title:'자전거로 찾아온 순환마당의 오후',text:offer,style:'position:fixed;top:-4000px;left:0;width:400px',techniques:['OFFSCREEN']},
 {key:'T21',name:'전각과 투명',title:'버려진 천으로 만든 작은 주머니',text:'ｃａｓｉｎｏ 신규 회원 첫 충전 보너스 지급',style:'opacity:0',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T22',name:'자모와 display none',title:'아이들이 찾은 가을 열매 지도',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'T23',name:'전각과 화면 밖',title:'실개천의 돌 틈을 관찰한 날',text:'ｍｅｇａ－ＢＥＴ 카지노 가입 보너스 즉시 지급',style:'position:absolute;left:-9999px;width:300px',techniques:['HOMOGLYPH','OFFSCREEN']},
 {key:'T24',name:'교육메모의 자모와 투명',title:'수생식물 해설 수업의 질문 모음',text:jamo,memo:true,style:'color:transparent',techniques:['JAMO','TRANSPARENT']},
 {key:'T25',name:'400ms 현장 의견',title:'연못 가장자리를 걸으며 남긴 기록',text:'ｃａｓｉｎｏ 온라인 슬롯 무료 체험 신규 가입 보너스',delay:400,techniques:['HOMOGLYPH']},
 {key:'T26',name:'1800ms 현장 의견',title:'플라스틱 종류를 구분하는 연습',text:jamo,delay:1800,techniques:['JAMO']},
 {key:'T27',name:'2800ms 현장 의견',title:'비가 그친 뒤 습지 관측을 마치고',text:offer,delay:2800,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T28',name:'iframe 1단계',title:'시민 관측소에서 전해 온 소식',text:offer,frameDepth:1,style:'display:none',techniques:['OFFSCREEN']},
 {key:'T29',name:'iframe 3단계',title:'해설팀의 하천 현장 자료를 읽으며',text:jamo,frameDepth:3,techniques:['JAMO']},
 {key:'T30',name:'900ms 프레임과 400ms 내부 의견',title:'공동 관측장비의 점검 기록',text:'ｍｅｇａ－ＢＥＴ 온라인 카지노 첫충 보너스',frameDepth:3,delay:900,innerDelay:400,style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T31',name:'같은 observation 형제',title:'관찰 결과를 비교한 모둠 활동',text:offer,repeat:true,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T32',name:'클래스 없는 깊은 자식',title:'어린이 수첩 끝에 남은 한 줄',text:jamo,plain:true,techniques:['JAMO']},
 {key:'T33',name:'4종 기법과 부모 영향',title:'폐휴대전화 분리배출 교육 후기',text:'ＣＡＳＩＮＯ ㅋㅏㅈㅣㄴㅗ 신규 가입 보너스 지급',parentStyle:'opacity:0',style:'font-size:1px',techniques:['HOMOGLYPH','JAMO','TRANSPARENT','OFFSCREEN']},
 {key:'T34',name:'5단계 계절 관측 기록',title:'가을 습지 관측 장부의 마지막 메모',text:'ｃａｓｉｎｏ 온라인 슬롯 신규 가입 보너스',deep:true,table:true,style:'display:none',techniques:['HOMOGLYPH','OFFSCREEN']},
 {key:'N01',name:'접근성 건너뛰기',title:'관측 자료 화면 읽기 안내',text:'생태 관측 본문으로 바로가기',style:'position:absolute;left:-9999px',techniques:[]},
 {key:'N02',name:'숨겨진 정상 메뉴',title:'센터 이용 메뉴의 설명',text:'푸른순환 환경교육 이용 안내 메뉴',style:'display:none',techniques:[]},
 {key:'N03',name:'호환 자모 교육',title:'식물 이름으로 배우는 한글 놀이',text:'한글 놀이: ㅍㅜㄹ은 풀, ㄴㅏㅁㅜ는 나무입니다. 식물 이름을 읽어 보세요.',memo:true,techniques:[]},
 {key:'N04',name:'전각 정상 표기',title:'환경교육 주간 영문 표기 안내',text:'２０２６ ＧＡＯＮ ＥＣＯ ＷＥＥＫ 환경교육 주간 안내',techniques:[]},
 {key:'N05',name:'불법광고 예방 문맥',title:'시민 관측 기록을 안전하게 읽기',text:'온라인 카지노 가입 보너스를 내세운 불법광고를 주의하세요. 생태 관측 자료의 광고 링크를 누르지 마세요.',techniques:[]},
 {key:'N06',name:'숨겨진 예방 안내',title:'온라인 교육 화면의 안전 수칙',text:'카지노 가입 보너스 광고는 불법 도박 유도일 수 있습니다. 클릭하지 말고 신고하세요.',style:'display:none',techniques:[]},
 {key:'N07',name:'투명 정상 상태 안내',title:'관측표 자료 준비 상태 안내',text:'관측표를 여는 중입니다. 잠시 기다려 주세요.',style:'opacity:0',techniques:[]},
 {key:'N08',name:'3단계 iframe 정상 예방',title:'공동 자료함의 온라인 안전 안내',text:'성인 영상 가입과 온라인 카지노 보너스를 내세운 불법광고는 클릭하지 마세요.',frameDepth:3,style:'opacity:0',techniques:[]},
 {key:'N09',name:'다국어 현장 안내',title:'여러 언어로 함께 걷는 생태길',text:'Добро пожаловать! Welcome to Gaon Ecology Center. 다국어 생태길 안내입니다.',techniques:[]},
 {key:'N10',name:'정상 금융 피해 예방',title:'자원순환 활동의 비용 안내',text:'선입금을 요구하는 대출 광고를 주의하세요. 교육비 지원 정보는 공식 기관에서 확인하세요.',table:true,techniques:[]},
 {key:'N11',name:'정상 의약품 교육',title:'폐의약품 수거 교육의 주의사항',text:'전문 의약품은 의사의 처방에 따라 복용하세요. 온라인 불법 판매에 주의하고 폐의약품은 안내된 수거함에 배출하세요.',memo:true,techniques:[]},
 {key:'N12',name:'900ms 접근성 상태',title:'계절별 현장 해설 자료 준비 안내',text:'계절별 생태 해설 자료가 준비되었습니다.',delay:900,style:'position:absolute;left:-9999px',techniques:[]}
];
export const authors=['서지안','생태해설팀','조은솔','물길지기','한정우','시민관측단','박은수','환경교육팀','갈대바람','오수민','순환마당','가온산책'];
export const stations={wetland:'갈대습지',stream:'실개천',garden:'순환정원'};
export const seasons={spring:'봄',autumn:'가을'};
export const fixtures=data.map((f,index)=>({...f,index,postId:String(9207+index*23),zone:['wetland','stream','garden'][index%3],category:f.techniques.length?'field':'education',path:f.deep?'observations/wetland/2026/autumn/read.html':`observations/posts/${9207+index*23}.html`}));
export const queryFixtures=[
 {key:'Q01',station:'wetland',season:'spring',name:'습지 봄 쿼리',text:jamo,techniques:['JAMO']},
 {key:'Q02',station:'stream',season:'spring',name:'실개천 봄 쿼리',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {key:'Q03',station:'garden',season:'spring',name:'정원 봄 쿼리',text:'ｃａｓｉｎｏ 신규 가입 슬롯 보너스',style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'Q04',station:'wetland',season:'autumn',name:'습지 가을 쿼리',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'Q05',station:'stream',season:'autumn',name:'실개천 가을 쿼리',text:'ＣＡＳ１ＮＯ 온라인 가입 보너스 즉시 지급',techniques:['HOMOGLYPH']},
 {key:'Q06',station:'garden',season:'autumn',name:'정원 가을 쿼리',text:loan,parentStyle:'color:transparent',techniques:['TRANSPARENT']}
].map((f,i)=>({...f,index:fixtures.length+i,zone:f.station,category:'season',title:`${stations[f.station]} ${seasons[f.season]} 공동 관측 기록`,path:`observations/view.html?station=${f.station}&season=${f.season}`}));
export const extraElements=[
 {parent:'T01',key:'E01',name:'한 기록의 추가 광고',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {parent:'T02',key:'E02',name:'한 기록의 자모 투명 의견',text:jamo,style:'opacity:0',techniques:['JAMO','TRANSPARENT']},
 {parent:'T03',key:'E03',name:'한 기록의 전각 투명 의견',text:'ｍｅｇａ－ＢＥＴ 신규 가입 카지노 보너스',style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {parent:'T04',key:'E04',name:'한 기록의 작은 글자 의견',text:medicine,style:'font-size:0',techniques:['OFFSCREEN']},
 {parent:'T05',key:'E05',name:'한 기록의 자모 숨김 의견',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {parent:'T06',key:'E06',name:'한 기록의 투명 의견',text:adult,style:'opacity:0',techniques:['TRANSPARENT']}
];
export const listingPageSize=11,deepestCaseKey='T34',discoveryDelayMs=900,maxLinkDepth=5;
