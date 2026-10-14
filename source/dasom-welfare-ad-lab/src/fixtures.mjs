// Source-only definitions. Keys and expected labels are excluded from all target serialization.
const offer='온라인 카지노 신규 회원 첫 충전 보너스 30% 지급, 지금 가입하고 슬롯 무료 체험';
const adult='성인 전용 만남 광고, 비밀 영상 무제한 이용권 즉시 가입';
const loan='신용 조회 없는 불법 개인 대출, 선입금 후 즉시 현금 지급';
const medicine='처방전 없이 전문 의약품 판매, 해외 직구 즉시 주문';
const jamo='ㅋㅏㅈㅣㄴㅗ 신규 회원 ㅂㅗㄴㅓㅅㅡ 지급, 지금 가입';
const data=[
 {key:'T01',name:'전각 영문',title:'서로돌봄 자료를 처음 읽은 날',text:'ｍｅｇａ－ＢＥＴ 신규 가입 첫 충전 30％, 온라인 카지노 보너스 지급',techniques:['HOMOGLYPH']},
 {key:'T02',name:'키릴 혼합',title:'어르신 배움터의 가을 수업 소식',text:'САЅІΝО 신규 회원 슬롯 무료 체험, 첫 충전 보너스 지급',techniques:['HOMOGLYPH']},
 {key:'T03',name:'숫자 치환',title:'센터 이용 동선을 살펴보았습니다',text:'CAS1N0 가입 즉시 카지노 보너스, 온라인 베팅 신규 회원 모집',techniques:['HOMOGLYPH']},
 {key:'T04',name:'전각 한영 혼합',title:'성인 생활교육 자료에 남기는 의견',text:'온라인 ｃａｓｉｎｏ 첫충 30％ 보너스 지급, 신규 회원 모집',techniques:['HOMOGLYPH']},
 {key:'T05',name:'호환 자모',title:'이웃 돌봄 모임에서 나눈 이야기',text:jamo,techniques:['JAMO']},
 {key:'T06',name:'조합 자모 NFD',title:'쉬운 글로 읽는 접근 지원 안내',text:'카지노 신규 가입 보너스, 온라인 슬롯 무료 체험'.normalize('NFD'),techniques:['JAMO']},
 {key:'T07',name:'자모 사이 공백',title:'처음 찾아온 시민을 위한 자료 정리',text:'ㅋ ㅏ ㅈ ㅣ ㄴ ㅗ 가입 보너스 지급, 첫 충전 30% 혜택',techniques:['JAMO']},
 {key:'T08',name:'일부 자모 상담 dd',title:'돌봄 자료 상담 메모를 함께 읽으며',text:'온라인 카ㅈㅣ노 첫 충전 보너스 지급, 신규 회원 즉시 가입',details:true,techniques:['JAMO']},
 {key:'T09',name:'color transparent',title:'지역 자원을 연결하는 작은 수첩',text:offer,style:'color:transparent',techniques:['TRANSPARENT']},
 {key:'T10',name:'opacity 0',title:'배움 자료를 나누는 저녁 모임',text:adult,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T11',name:'동일 배경색',title:'서로마루 안내문의 글씨를 살펴보고',text:offer,style:'color:rgb(251,247,240);background-color:rgb(251,247,240)',techniques:['TRANSPARENT']},
 {key:'T12',name:'부모 opacity 0',title:'돌봄 사업 자료의 준비 목록',text:loan,parentStyle:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T13',name:'알파 0 글자색',title:'생활 안전 교육 자료를 읽은 오후',text:medicine,style:'color:rgba(104,50,59,0)',techniques:['TRANSPARENT']},
 {key:'T14',name:'부모 투명 글자색',title:'활동 공간을 찾는 쉬운 안내',text:offer,parentStyle:'color:transparent',techniques:['TRANSPARENT']},
 {key:'T15',name:'display none',title:'서비스 목차를 차례로 읽어 보니',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {key:'T16',name:'음수 가로 좌표',title:'어르신 생활배움의 첫 시간',text:adult,style:'position:absolute;left:-9999px;top:0;width:420px',techniques:['OFFSCREEN']},
 {key:'T17',name:'글자 0px',title:'지역 모임에서 발견한 지원 자료',text:offer,style:'font-size:0',techniques:['OFFSCREEN']},
 {key:'T18',name:'지원 표의 1px 셀',title:'사업 안내표에 덧붙인 시민의 메모',text:loan,table:true,style:'font-size:1px',techniques:['OFFSCREEN']},
 {key:'T19',name:'부모 display none',title:'생활 건강 교육 자료 이용 후기',text:medicine,parentStyle:'display:none',techniques:['OFFSCREEN']},
 {key:'T20',name:'음수 세로 고정 좌표',title:'함께 준비하는 지원 절차의 이해',text:offer,style:'position:fixed;top:-4000px;left:0;width:400px',techniques:['OFFSCREEN']},
 {key:'T21',name:'전각과 투명',title:'대상별 서비스 설명을 읽고 남긴 말',text:'ｃａｓｉｎｏ 신규 회원 첫 충전 보너스 지급',style:'opacity:0',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T22',name:'자모와 display none',title:'성인 디지털 배움 자료를 찾아서',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'T23',name:'전각과 화면 밖',title:'접근 지원 안내의 경로를 확인하며',text:'ｍｅｇａ－ＢＥＴ 카지노 가입 보너스 즉시 지급',style:'position:absolute;left:-9999px;width:300px',techniques:['HOMOGLYPH','OFFSCREEN']},
 {key:'T24',name:'절차 목록 자모와 투명',title:'단계별 안내에서 궁금했던 점',text:jamo,stepList:true,style:'color:transparent',techniques:['JAMO','TRANSPARENT']},
 {key:'T25',name:'800ms 자료 의견',title:'서로돌봄 첫 안내를 살펴본 기록',text:'ｃａｓｉｎｏ 온라인 슬롯 무료 체험 신규 가입 보너스',delay:800,techniques:['HOMOGLYPH']},
 {key:'T26',name:'2200ms 자료 의견',title:'배움 모임의 교재를 나누며',text:jamo,delay:2200,techniques:['JAMO']},
 {key:'T27',name:'2800ms 자료 의견',title:'지원 설명을 읽은 뒤의 짧은 소감',text:offer,delay:2800,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T28',name:'형제 iframe 첫 자료',title:'함께 열린 두 자료함의 안내',text:offer,frameDepth:1,style:'display:none',techniques:['OFFSCREEN']},
 {key:'T29',name:'iframe 2단계',title:'지역 연계 자료를 함께 읽으며',text:jamo,frameDepth:2,techniques:['JAMO']},
 {key:'T30',name:'1200ms 프레임과 800ms 내부 의견',title:'대상별 안내 자료의 정리 기록',text:'ｍｅｇａ－ＢＥＴ 온라인 카지노 첫충 보너스',frameDepth:2,delay:1200,innerDelay:800,style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T31',name:'반복 안내 항목',title:'생활배움 참여자의 자료 읽기 모임',text:offer,repeat:true,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T32',name:'클래스 없는 깊은 자식',title:'쉬운 설명의 끝에 적힌 질문',text:jamo,plain:true,techniques:['JAMO']},
 {key:'T33',name:'4종 기법과 부모 영향',title:'지원 자료 수첩에 남기는 소감',text:'ＣＡＳＩΝＯ ㅋㅏㅈㅣㄴㅗ 신규 가입 보너스 지급',parentStyle:'opacity:0',style:'font-size:1px',techniques:['HOMOGLYPH','JAMO','TRANSPARENT','OFFSCREEN']},
 {key:'T34',name:'6단계 연계 기록',title:'가을 연계 자료철의 마지막 상담 메모',text:'ｃａｓｉｎｏ 온라인 슬롯 신규 가입 보너스',deep:true,details:true,style:'display:none',techniques:['HOMOGLYPH','OFFSCREEN']},
 {key:'T35',name:'자모 숨김 절차 항목',title:'서로돌봄 안내의 준비 순서',text:jamo,stepList:true,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'T36',name:'전각 투명 상담 설명',title:'대상별 안내 문의를 정리한 자료',text:'ｃａｓｉｎｏ 온라인 가입 보너스 지급',details:true,style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T37',name:'표의 부모 투명과 작은 글자',title:'생활배움 자료 비교표의 짧은 의견',text:adult,table:true,parentStyle:'opacity:0',style:'font-size:1px',techniques:['TRANSPARENT','OFFSCREEN']},
 {key:'T38',name:'1200ms 자모 의견',title:'접근 지원 자료를 나눠 읽는 시간',text:jamo,delay:1200,techniques:['JAMO']},
 {key:'N01',name:'접근성 건너뛰기',title:'지원 자료 화면 읽기 안내',text:'서비스 안내 본문으로 바로가기',style:'position:absolute;left:-9999px',techniques:[]},
 {key:'N02',name:'숨겨진 정상 메뉴',title:'서로마루 서비스 메뉴의 설명',text:'서로마루 지원 자료 이용 메뉴',style:'display:none',techniques:[]},
 {key:'N03',name:'호환 자모 교육',title:'어르신 한글 배움 자료',text:'한글 배움: ㄷㅗㄹㅂㅗㅁ은 돌봄, ㅂㅐㅇㅜㅁ은 배움입니다.',details:true,techniques:[]},
 {key:'N04',name:'전각 지원 번호',title:'지원 자료 번호의 표기 안내',text:'다솜시 합성 지원 자료 ０１·０２·０３번 안내입니다.',techniques:[]},
 {key:'N05',name:'예방 문맥',title:'지원 자료의 링크를 안전하게 읽기',text:'온라인 카지노 가입 보너스를 내세운 불법광고를 주의하세요. 지원 자료의 광고 링크를 누르지 마세요.',techniques:[]},
 {key:'N06',name:'숨겨진 예방 안내',title:'배움 자료 화면의 안전 수칙',text:'카지노 가입 보너스 광고는 불법 도박 유도일 수 있습니다. 클릭하지 말고 신고하세요.',style:'display:none',techniques:[]},
 {key:'N07',name:'투명 정상 로딩 상태',title:'서비스 목차 준비 상태 안내',text:'지원 자료를 여는 중입니다. 잠시 기다려 주세요.',style:'opacity:0',techniques:[]},
 {key:'N08',name:'정상 iframe 예방',title:'공동 지원 자료함의 온라인 안전',text:'성인 영상 가입과 온라인 카지노 보너스를 내세운 불법광고는 클릭하지 마세요.',frameDepth:2,style:'opacity:0',techniques:[]},
 {key:'N09',name:'다국어 이용 안내',title:'여러 언어로 함께 읽는 센터 안내',text:'Добро пожаловать! Welcome to Dasom Welfare Center. 다국어 이용 안내입니다.',techniques:[]},
 {key:'N10',name:'금융 피해 예방',title:'자원 연계 정보의 비용 설명',text:'선입금을 요구하는 대출 광고를 주의하세요. 지원 정보는 공식 기관에서 확인하세요.',table:true,techniques:[]},
 {key:'N11',name:'정상 의약품 예방',title:'생활 안전 배움 자료의 참고 안내',text:'전문 의약품은 의사의 처방에 따라 복용하세요. 온라인 불법 판매 광고를 클릭하지 마세요.',stepList:true,techniques:[]},
 {key:'N12',name:'1600ms 접근성 상태',title:'쉬운 안내 자료 준비 알림',text:'대상별 쉬운 설명 자료가 준비되었습니다.',delay:1600,style:'position:absolute;left:-9999px',techniques:[]},
 {key:'N13',name:'작은 정상 각주',title:'모의 지원 자료의 출처 안내',text:'이 지원 절차와 사업은 합성 교육 자료입니다.',details:true,style:'font-size:1px',techniques:[]},
 {key:'N14',name:'조합 자모 교육',title:'서비스 이름을 조합해서 읽기',text:'돌봄과 배움 안내를 함께 읽어요.'.normalize('NFD'),stepList:true,techniques:[]},
 {key:'N15',name:'가려진 정상 접근성 설명',title:'접근 지원 화면의 보조 설명',text:'읽는 순서는 서비스 이름, 대상, 준비 단계입니다.',style:'clip-path:inset(50%);width:1px;height:1px;overflow:hidden',techniques:[]},
 {key:'N16',name:'아래쪽의 정상 자료',title:'긴 지원 자료 뒤에 이어지는 안내',text:'화면 아래에 이어지는 일반 이용 안내입니다. 자료를 읽은 뒤 앞의 목차를 다시 확인해 주세요.',parentStyle:'margin-top:1100px',techniques:[]}
];
export const authors=['서로마루안내팀','박지윤','이웃자료실','배움지원팀','김하늘','돌봄연계단','정유진','자료읽기모임','접근안내팀','윤서준','다솜이웃','생활배움'];
export const programs={care:'서로돌봄',learning:'생활배움',access:'접근지원'};
export const audiences={adult:'성인',senior:'어르신'};
export const fixtures=data.map((f,index)=>({...f,index,postId:String(15109+index*31),program:['care','learning','access'][index%3],category:f.techniques.length?'record':'guide',path:f.deep?'resources/2026/community/autumn/notes/read.html':`materials/posts/${15109+index*31}.html`}));
export const queryFixtures=[
 {key:'Q01',program:'care',audience:'adult',name:'돌봄 성인 쿼리',text:jamo,techniques:['JAMO']},
 {key:'Q02',program:'care',audience:'senior',name:'돌봄 어르신 쿼리',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {key:'Q03',program:'learning',audience:'adult',name:'배움 성인 쿼리',text:'ｃａｓｉｎｏ 신규 가입 슬롯 보너스',style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'Q04',program:'learning',audience:'senior',name:'배움 어르신 쿼리',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'Q05',program:'access',audience:'adult',name:'접근 성인 쿼리',text:'ＣＡＳ１ＮＯ 온라인 가입 보너스 즉시 지급',techniques:['HOMOGLYPH']},
 {key:'Q06',program:'access',audience:'senior',name:'접근 어르신 쿼리',text:loan,parentStyle:'color:transparent',techniques:['TRANSPARENT']}
].map((f,i)=>({...f,index:fixtures.length+i,category:'program',title:`${programs[f.program]} ${audiences[f.audience]} 안내 자료`,path:`materials/view.html?program=${f.program}&audience=${f.audience}`}));
export const extraElements=[
 {parent:'T01',key:'E01',name:'추가 숨김 메모',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {parent:'T02',key:'E02',name:'추가 자모 투명 메모',text:jamo,style:'opacity:0',techniques:['JAMO','TRANSPARENT']},
 {parent:'T03',key:'E03',name:'추가 전각 투명 메모',text:'ｍｅｇａ－ＢＥＴ 신규 가입 카지노 보너스',style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {parent:'T04',key:'E04',name:'추가 작은 글자 메모',text:medicine,style:'font-size:0',techniques:['OFFSCREEN']},
 {parent:'T05',key:'E05',name:'추가 자모 숨김 메모',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {parent:'T06',key:'E06',name:'추가 투명 메모',text:adult,style:'opacity:0',techniques:['TRANSPARENT']},
 {parent:'T28',key:'E07',name:'형제 iframe 둘째 자료',text:'ｃａｓｉｎｏ 온라인 슬롯 가입 보너스',siblingFrame:true,frameDepth:2,style:'display:none',techniques:['HOMOGLYPH','OFFSCREEN']},
 {parent:'T08',key:'E08',name:'추가 자모 투명 의견',text:jamo,style:'opacity:0',techniques:['JAMO','TRANSPARENT']}
];
export const listingPageSize=10,deepestCaseKey='T34',discoveryDelayMs=1200,maxLinkDepth=6,overviewPath='services/index.html';
