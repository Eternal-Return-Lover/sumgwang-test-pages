// Source-only definitions. Fixture keys and expected techniques never enter the target DOM.
const offer='온라인 카지노 신규 회원 첫 충전 보너스 30% 지급, 지금 가입하고 슬롯 무료 체험';
const adult='성인 전용 만남 광고, 비밀 영상 무제한 이용권 즉시 가입';
const loan='신용 조회 없는 불법 개인 대출, 선입금 후 즉시 현금 지급';
const medicine='처방전 없이 전문 의약품 판매, 해외 직구 즉시 주문';
const jamo='ㅋㅏㅈㅣㄴㅗ 신규 회원 ㅂㅗㄴㅓㅅㅡ 지급, 지금 가입';
const data=[
 {key:'T01',name:'전각 영문',title:'중앙역 첫차를 기다리며 확인한 안내',text:'ｍｅｇａ－ＢＥＴ 신규 가입 첫 충전 30％, 온라인 카지노 보너스 지급',techniques:['HOMOGLYPH']},
 {key:'T02',name:'키릴 혼합',title:'수변공원 정류장의 새 노선도를 보고',text:'САЅІΝО 신규 회원 슬롯 무료 체험, 첫 충전 보너스 지급',techniques:['HOMOGLYPH']},
 {key:'T03',name:'숫자 치환',title:'시청 앞에서 갈아탄 저녁 버스',text:'CAS1N0 가입 즉시 카지노 보너스, 온라인 베팅 신규 회원 모집',techniques:['HOMOGLYPH']},
 {key:'T04',name:'전각 한영 혼합',title:'도서관까지 이어지는 환승 동선',text:'온라인 ｃａｓｉｎｏ 첫충 30％ 보너스 지급, 신규 회원 모집',techniques:['HOMOGLYPH']},
 {key:'T05',name:'호환 자모',title:'산업단지 출근길 운행 정보를 살펴봤어요',text:jamo,techniques:['JAMO']},
 {key:'T06',name:'조합 자모 NFD',title:'문화회관 공연 뒤 돌아오는 길',text:'카지노 신규 가입 보너스, 온라인 슬롯 무료 체험'.normalize('NFD'),techniques:['JAMO']},
 {key:'T07',name:'자모 사이 공백',title:'비 오는 날 환승센터에서 기다리며',text:'ㅋ ㅏ ㅈ ㅣ ㄴ ㅗ 가입 보너스 지급, 첫 충전 30% 혜택',techniques:['JAMO']},
 {key:'T08',name:'부분 자모 정류장 dd',title:'중앙시장 정류장 설명에 남긴 메모',text:'온라인 카ㅈㅣ노 첫 충전 보너스 지급, 신규 회원 즉시 가입',details:true,techniques:['JAMO']},
 {key:'T09',name:'color transparent',title:'오전 운행 소식에서 찾은 변경 내용',text:offer,style:'color:transparent',techniques:['TRANSPARENT']},
 {key:'T10',name:'opacity 0',title:'늦은 시간 귀갓길 노선을 확인하며',text:adult,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T11',name:'동일 배경색',title:'시각표 글씨가 한눈에 들어왔어요',text:offer,style:'color:rgb(245,247,249);background-color:rgb(245,247,249)',techniques:['TRANSPARENT']},
 {key:'T12',name:'부모 opacity 0',title:'주말 임시 정류장 이용 경험',text:loan,parentStyle:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T13',name:'알파 0 글자색',title:'병원 앞 정류장을 찾은 오후',text:medicine,style:'color:rgba(22,43,64,0)',techniques:['TRANSPARENT']},
 {key:'T14',name:'부모 투명 글자색',title:'온누리천을 따라 이어지는 노선',text:offer,parentStyle:'color:transparent',techniques:['TRANSPARENT']},
 {key:'T15',name:'display none',title:'출발보드와 현장 안내를 비교했습니다',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {key:'T16',name:'음수 가로 좌표',title:'환승 통로의 쉼터를 이용하며',text:adult,style:'position:absolute;left:-9999px;top:0;width:420px',techniques:['OFFSCREEN']},
 {key:'T17',name:'글자 0px',title:'학교 앞 정류장에서 본 아침 풍경',text:offer,style:'font-size:0',techniques:['OFFSCREEN']},
 {key:'T18',name:'시각표 1px 셀',title:'저녁 시각표에 덧붙이는 이용 메모',text:loan,table:true,style:'font-size:1px',techniques:['OFFSCREEN']},
 {key:'T19',name:'부모 display none',title:'교통약자 승차 안내를 읽고',text:medicine,parentStyle:'display:none',techniques:['OFFSCREEN']},
 {key:'T20',name:'음수 세로 고정 좌표',title:'공원 산책을 마치고 돌아오는 노선',text:offer,style:'position:fixed;top:-4000px;left:0;width:400px',techniques:['OFFSCREEN']},
 {key:'T21',name:'전각과 투명',title:'야간 노선 안내에 남기는 의견',text:'ｃａｓｉｎｏ 신규 회원 첫 충전 보너스 지급',style:'opacity:0',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T22',name:'자모와 display none',title:'정류장 이름이 바뀐 구간을 찾아서',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'T23',name:'전각과 화면 밖',title:'철도와 버스의 연결 시간을 살펴보니',text:'ｍｅｇａ－ＢＥＴ 카지노 가입 보너스 즉시 지급',style:'position:absolute;left:-9999px;width:300px',techniques:['HOMOGLYPH','OFFSCREEN']},
 {key:'T24',name:'정류장 목록 자모와 투명',title:'구간별 정류장 안내를 다시 읽으며',text:jamo,stops:true,style:'color:transparent',techniques:['JAMO','TRANSPARENT']},
 {key:'T25',name:'750ms 이용 메모',title:'환승센터 승차 위치를 확인한 기록',text:'ｃａｓｉｎｏ 온라인 슬롯 무료 체험 신규 가입 보너스',delay:750,techniques:['HOMOGLYPH']},
 {key:'T26',name:'2100ms 이용 메모',title:'시장길 정류장 대기 공간 이야기',text:jamo,delay:2100,techniques:['JAMO']},
 {key:'T27',name:'2800ms 이용 메모',title:'막차 안내를 살펴본 뒤 남긴 의견',text:offer,delay:2800,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T28',name:'iframe 2단계',title:'노선 자료함에서 전해 온 안내',text:offer,frameDepth:2,style:'display:none',techniques:['OFFSCREEN']},
 {key:'T29',name:'iframe 3단계',title:'구간 운행 기록을 함께 읽으며',text:jamo,frameDepth:3,techniques:['JAMO']},
 {key:'T30',name:'750ms 프레임과 650ms 내부 메모',title:'출발 안내 장치의 점검 기록',text:'ｍｅｇａ－ＢＥＴ 온라인 카지노 첫충 보너스',frameDepth:2,delay:750,innerDelay:650,style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T31',name:'반복 안내 메모 형제',title:'서로 다른 정류장에서 나눈 소식',text:offer,repeat:true,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T32',name:'클래스 없는 구간안내',title:'구간 해설 끝에 적힌 이용자의 질문',text:jamo,plain:true,techniques:['JAMO']},
 {key:'T33',name:'4종 기법과 부모 영향',title:'환승 자료를 읽고 보낸 짧은 소감',text:'ＣＡＳＩＮＯ ㅋㅏㅈㅣㄴㅗ 신규 가입 보너스 지급',parentStyle:'opacity:0',style:'font-size:1px',techniques:['HOMOGLYPH','JAMO','TRANSPARENT','OFFSCREEN']},
 {key:'T34',name:'4단계 월간 운행 기록',title:'10월 운행 자료철의 마지막 정류장 메모',text:'ｃａｓｉｎｏ 온라인 슬롯 신규 가입 보너스',deep:true,details:true,style:'display:none',techniques:['HOMOGLYPH','OFFSCREEN']},
 {key:'N01',name:'접근성 건너뛰기',title:'출발 정보 화면 읽기 안내',text:'운행 안내 본문으로 바로가기',style:'position:absolute;left:-9999px',techniques:[]},
 {key:'N02',name:'숨겨진 정상 운행 메뉴',title:'운행 정보 메뉴의 이용 방법',text:'길마루 운행 안내 메뉴',style:'display:none',techniques:[]},
 {key:'N03',name:'호환 자모 노선교육',title:'정류장 이름으로 배우는 한글',text:'한글 안내: ㅈㅜㅇㅇㅏㅇ은 중앙, ㅅㅣㅊㅓㅇ은 시청입니다. 정류장 이름을 함께 읽어 보세요.',details:true,techniques:[]},
 {key:'N04',name:'전각 노선 숫자',title:'노선 숫자의 여러 표기 안내',text:'온누리시 １０·２０·３０·４０번 합성 노선 안내입니다.',techniques:[]},
 {key:'N05',name:'불법광고 예방 문맥',title:'운행 기록의 링크를 안전하게 읽기',text:'온라인 카지노 가입 보너스를 내세운 불법광고를 주의하세요. 운행 기록의 광고 링크를 누르지 마세요.',techniques:[]},
 {key:'N06',name:'숨겨진 예방 안내',title:'온라인 노선 자료의 안전 수칙',text:'카지노 가입 보너스 광고는 불법 도박 유도일 수 있습니다. 클릭하지 말고 신고하세요.',style:'display:none',techniques:[]},
 {key:'N07',name:'투명 정상 로딩 상태',title:'출발보드 자료 준비 안내',text:'출발 자료를 여는 중입니다. 잠시 기다려 주세요.',style:'opacity:0',techniques:[]},
 {key:'N08',name:'2단계 iframe 정상 예방',title:'공동 노선 자료함의 안전 안내',text:'성인 영상 가입과 온라인 카지노 보너스를 내세운 불법광고는 클릭하지 마세요.',frameDepth:2,style:'opacity:0',techniques:[]},
 {key:'N09',name:'다국어 이용 안내',title:'여러 언어로 읽는 환승 안내',text:'Добро пожаловать! Welcome to Onnuri Transit Center. 다국어 환승 안내입니다.',techniques:[]},
 {key:'N10',name:'정상 금융피해 예방',title:'교통비 지원 정보를 확인하는 방법',text:'선입금을 요구하는 대출 광고를 주의하세요. 교통비 지원 정보는 공식 기관에서 확인하세요.',table:true,techniques:[]},
 {key:'N11',name:'정상 의약품 예방',title:'병원 노선 자료의 온라인 안전 안내',text:'전문 의약품은 의사의 처방에 따라 복용하세요. 온라인 불법 판매 광고를 클릭하지 마세요.',stops:true,techniques:[]},
 {key:'N12',name:'1100ms 접근성 상태',title:'환승 해설 자료 준비 안내',text:'정류장 환승 해설 자료가 준비되었습니다.',delay:1100,style:'position:absolute;left:-9999px',techniques:[]},
 {key:'N13',name:'작은 글자의 정상 각주',title:'모의 시각표의 자료 출처 안내',text:'이 시각표와 노선 정보는 합성 교육 자료입니다.',details:true,style:'font-size:1px',techniques:[]},
 {key:'N14',name:'조합 자모 정류장 교육',title:'정류장 이름을 조합해서 읽기',text:'중앙역과 시청 정류장 이름을 함께 읽어요.'.normalize('NFD'),stops:true,techniques:[]}
];
export const authors=['정류장지기','시민교통단','이서윤','환승안내팀','김민재','퇴근길메모','온누리산책','노선자료실','한소진','길마루운영팀','박도윤','시각표읽기'];
export const routes={'10':'중앙역 — 수변공원','20':'시청 — 산업단지','30':'중앙시장 — 도서관','40':'환승센터 — 문화회관'};
export const services={day:'주간',night:'야간'};
export const fixtures=data.map((f,index)=>({...f,index,postId:String(12011+index*29),route:['10','20','30','40'][index%4],category:f.techniques.length?'service':'guide',path:f.deep?'records/2026/october/read.html':`service/posts/${12011+index*29}.html`}));
export const queryFixtures=[
 {key:'Q01',route:'10',service:'day',name:'10번 주간 쿼리',text:jamo,techniques:['JAMO']},
 {key:'Q02',route:'10',service:'night',name:'10번 야간 쿼리',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {key:'Q03',route:'20',service:'day',name:'20번 주간 쿼리',text:'ｃａｓｉｎｏ 신규 가입 슬롯 보너스',style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'Q04',route:'20',service:'night',name:'20번 야간 쿼리',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'Q05',route:'30',service:'day',name:'30번 주간 쿼리',text:'ＣＡＳ１ＮＯ 온라인 가입 보너스 즉시 지급',techniques:['HOMOGLYPH']},
 {key:'Q06',route:'30',service:'night',name:'30번 야간 쿼리',text:loan,parentStyle:'color:transparent',techniques:['TRANSPARENT']},
 {key:'Q07',route:'40',service:'day',name:'40번 주간 쿼리',text:jamo,style:'opacity:0',techniques:['JAMO','TRANSPARENT']},
 {key:'Q08',route:'40',service:'night',name:'40번 야간 쿼리',text:'ｃａｓｉｎｏ 온라인 슬롯 첫충 보너스',style:'display:none',techniques:['HOMOGLYPH','OFFSCREEN']}
].map((f,i)=>({...f,index:fixtures.length+i,category:'timetable',title:`${f.route}번 ${services[f.service]} 출발·환승 자료`,path:`service/view.html?route=${f.route}&service=${f.service}`}));
export const extraElements=[
 {parent:'T01',key:'E01',name:'추가 숨김 메모',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {parent:'T02',key:'E02',name:'추가 자모 투명 메모',text:jamo,style:'opacity:0',techniques:['JAMO','TRANSPARENT']},
 {parent:'T03',key:'E03',name:'추가 전각 투명 메모',text:'ｍｅｇａ－ＢＥＴ 신규 가입 카지노 보너스',style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {parent:'T04',key:'E04',name:'추가 작은 글자 메모',text:medicine,style:'font-size:0',techniques:['OFFSCREEN']},
 {parent:'T05',key:'E05',name:'추가 자모 숨김 메모',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {parent:'T06',key:'E06',name:'추가 투명 메모',text:adult,style:'opacity:0',techniques:['TRANSPARENT']}
];
export const listingPageSize=12,deepestCaseKey='T34',discoveryDelayMs=1100,maxLinkDepth=4,overviewPath='routes/index.html';
