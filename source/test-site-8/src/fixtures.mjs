// Source-only definitions; runtime serialization excludes keys and techniques.
const offer='온라인 카지노 신규 회원 첫 충전 보너스 30% 지급, 지금 가입하고 슬롯 무료 체험';
const adult='성인 전용 만남 광고, 비밀 영상 무제한 이용권 즉시 가입';
const loan='신용 조회 없는 불법 개인 대출, 선입금 후 즉시 현금 지급';
const medicine='처방전 없이 전문 의약품 판매, 해외 직구 즉시 주문';
const jamo='ㅋㅏㅈㅣㄴㅗ 신규 회원 ㅂㅗㄴㅓㅅㅡ 지급, 지금 가입';
const data=[
 {key:'T01',name:'전각 영문',title:'가을 시민회의록의 등록 메모',text:'ｍｅｇａ－ＢＥＴ 신규 가입 첫 충전 30％, 온라인 카지노 보너스 지급',techniques:['HOMOGLYPH']},
 {key:'T02',name:'키릴 혼합',title:'별빛천 정비 기록의 판본을 살펴보며',text:'САЅІΝО 신규 회원 슬롯 무료 체험, 첫 충전 보너스 지급',techniques:['HOMOGLYPH']},
 {key:'T03',name:'숫자 치환',title:'생활사 자료에서 찾은 작은 주석',text:'CAS1N0 가입 즉시 카지노 보너스, 온라인 베팅 신규 회원 모집',techniques:['HOMOGLYPH']},
 {key:'T04',name:'전각 한영 혼합',title:'공공시설 이용 자료의 정리 기록',text:'온라인 ｃａｓｉｎｏ 첫충 30％ 보너스 지급, 신규 회원 모집',techniques:['HOMOGLYPH']},
 {key:'T05',name:'호환 자모',title:'문서 목차를 대조한 열람 수첩',text:jamo,techniques:['JAMO']},
 {key:'T06',name:'조합 자모 NFD',title:'수질 관측 보고서의 초안과 공개본',text:'카지노 신규 가입 보너스, 온라인 슬롯 무료 체험'.normalize('NFD'),techniques:['JAMO']},
 {key:'T07',name:'자모 사이 공백',title:'동네 골목 기록의 첫 번째 판본',text:'ㅋ ㅏ ㅈ ㅣ ㄴ ㅗ 가입 보너스 지급, 첫 충전 30% 혜택',techniques:['JAMO']},
 {key:'T08',name:'부분 자모 등록 dl',title:'자료 등록 설명에 남긴 질문',text:'온라인 카ㅈㅣ노 첫 충전 보너스 지급, 신규 회원 즉시 가입',details:true,techniques:['JAMO']},
 {key:'T09',name:'color transparent',title:'공개 문서의 목록을 정리한 날',text:offer,style:'color:transparent',techniques:['TRANSPARENT']},
 {key:'T10',name:'opacity 0',title:'환경 기록 미리보기의 읽기 메모',text:adult,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T11',name:'동일 배경색',title:'기록 분류표의 글씨를 살펴보고',text:offer,style:'color:rgb(246,247,251);background-color:rgb(246,247,251)',techniques:['TRANSPARENT']},
 {key:'T12',name:'부모 opacity 0',title:'시설 보수 기록의 첨부 설명',text:loan,parentStyle:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T13',name:'알파 0 글자색',title:'생활 안전 자료의 문헌 주석',text:medicine,style:'color:rgba(75,57,113,0)',techniques:['TRANSPARENT']},
 {key:'T14',name:'부모 투명 글자색',title:'별빛시 행정 기록의 읽기 안내',text:offer,parentStyle:'color:transparent',techniques:['TRANSPARENT']},
 {key:'T15',name:'display none',title:'검색 결과에서 확인한 판본 목록',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {key:'T16',name:'음수 가로 좌표',title:'열람실 생활사 수첩의 짧은 메모',text:adult,style:'position:absolute;left:-9999px;top:0;width:420px',techniques:['OFFSCREEN']},
 {key:'T17',name:'글자 0px',title:'오래된 문서 표지를 대조했습니다',text:offer,style:'font-size:0',techniques:['OFFSCREEN']},
 {key:'T18',name:'메타데이터 1px 셀',title:'기록 메타데이터 표의 등록 의견',text:loan,table:true,style:'font-size:1px',techniques:['OFFSCREEN']},
 {key:'T19',name:'부모 display none',title:'공개 자료의 출처를 확인하며',text:medicine,parentStyle:'display:none',techniques:['OFFSCREEN']},
 {key:'T20',name:'음수 세로 고정 좌표',title:'자료철 순서를 다시 읽은 기록',text:offer,style:'position:fixed;top:-4000px;left:0;width:400px',techniques:['OFFSCREEN']},
 {key:'T21',name:'전각과 투명',title:'행정 문서 수정본의 대조 메모',text:'ｃａｓｉｎｏ 신규 회원 첫 충전 보너스 지급',style:'opacity:0',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T22',name:'자모와 display none',title:'습지 자료의 문헌 제목을 읽고',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'T23',name:'전각과 화면 밖',title:'시민 기록에 추가된 설명을 살펴보니',text:'ｍｅｇａ－ＢＥＴ 카지노 가입 보너스 즉시 지급',style:'position:absolute;left:-9999px;width:300px',techniques:['HOMOGLYPH','OFFSCREEN']},
 {key:'T24',name:'판본 주석 자모와 투명',title:'판본별 주석의 차이를 읽으며',text:jamo,annotations:true,style:'color:transparent',techniques:['JAMO','TRANSPARENT']},
 {key:'T25',name:'500ms 열람 의견',title:'공개 목록에서 처음 만난 기록',text:'ｃａｓｉｎｏ 온라인 슬롯 무료 체험 신규 가입 보너스',delay:500,techniques:['HOMOGLYPH']},
 {key:'T26',name:'1900ms 열람 의견',title:'환경 자료의 등록 과정을 살펴보며',text:jamo,delay:1900,techniques:['JAMO']},
 {key:'T27',name:'2800ms 열람 의견',title:'문서 미리보기를 읽은 뒤의 소감',text:offer,delay:2800,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T28',name:'iframe 1단계',title:'문서 자료함에서 전해 온 주석',text:offer,frameDepth:1,style:'display:none',techniques:['OFFSCREEN']},
 {key:'T29',name:'iframe 3단계',title:'원문과 해설을 함께 읽는 자료',text:jamo,frameDepth:3,techniques:['JAMO']},
 {key:'T30',name:'1000ms 프레임과 600ms 주석',title:'공개 자료 미리보기의 정리 기록',text:'ｍｅｇａ－ＢＥＴ 온라인 카지노 첫충 보너스',frameDepth:2,delay:1000,innerDelay:600,style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T31',name:'반복 검색 메모',title:'서로 다른 검색 결과를 비교하며',text:offer,repeat:true,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T32',name:'클래스 없는 문서 주석',title:'문헌 설명의 끝에 적힌 질문',text:jamo,plain:true,techniques:['JAMO']},
 {key:'T33',name:'4종 기법과 부모 영향',title:'판본 대조 수첩에 남긴 소감',text:'ＣＡＳＩΝＯ ㅋㅏㅈㅣㄴㅗ 신규 가입 보너스 지급',parentStyle:'opacity:0',style:'font-size:1px',techniques:['HOMOGLYPH','JAMO','TRANSPARENT','OFFSCREEN']},
 {key:'T34',name:'7단계 자료철',title:'가을 검토 자료철의 마지막 등록 메모',text:'ｃａｓｉｎｏ 온라인 슬롯 신규 가입 보너스',deep:true,details:true,style:'display:none',techniques:['HOMOGLYPH','OFFSCREEN']},
 {key:'T35',name:'자모 숨김 주석 항목',title:'회의록 초안에서 수정된 문장',text:jamo,annotations:true,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'T36',name:'전각 투명 등록 설명',title:'시설 기록의 등록 설명을 읽으며',text:'ｃａｓｉｎｏ 온라인 가입 보너스 지급',details:true,style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T37',name:'표의 부모 투명과 작은 글자',title:'생활 자료 비교표의 짧은 의견',text:adult,table:true,parentStyle:'opacity:0',style:'font-size:1px',techniques:['TRANSPARENT','OFFSCREEN']},
 {key:'T38',name:'1000ms 자모 의견',title:'분류 목록을 함께 읽는 시간',text:jamo,delay:1000,techniques:['JAMO']},
 {key:'N01',name:'접근성 건너뛰기',title:'공개 기록 화면 읽기 안내',text:'기록 설명 본문으로 바로가기',style:'position:absolute;left:-9999px',techniques:[]},
 {key:'N02',name:'숨은 정상 필터',title:'기록 검색 필터 이용 안내',text:'기록빛 분류 필터 메뉴',style:'display:none',techniques:[]},
 {key:'N03',name:'호환 자모 문헌 교육',title:'옛 문헌 제목으로 배우는 한글',text:'한글 배움: ㄱㅣㄹㅗㄱ은 기록, ㅁㅜㄴㅎㅓㄴ은 문헌입니다.',details:true,techniques:[]},
 {key:'N04',name:'전각 문헌 코드',title:'문헌 코드의 여러 표기 안내',text:'별빛시 합성 문헌 ＢＬ－２０２６－０１·０２ 안내입니다.',techniques:[]},
 {key:'N05',name:'위조광고 예방',title:'원문 링크를 안전하게 확인하는 방법',text:'온라인 카지노 가입 보너스를 내세운 불법광고를 주의하세요. 공개 기록의 광고 링크를 누르지 마세요.',techniques:[]},
 {key:'N06',name:'숨긴 정상 예방 안내',title:'자료 검색 화면의 안전 수칙',text:'카지노 가입 보너스 광고는 불법 도박 유도일 수 있습니다. 클릭하지 말고 신고하세요.',style:'display:none',techniques:[]},
 {key:'N07',name:'투명 정상 상태',title:'문서 목록 준비 상태 안내',text:'기록 목록을 여는 중입니다. 잠시 기다려 주세요.',style:'opacity:0',techniques:[]},
 {key:'N08',name:'정상 iframe 예방',title:'공동 문헌 자료함의 온라인 안전',text:'성인 영상 가입과 온라인 카지노 보너스를 내세운 불법광고는 클릭하지 마세요.',frameDepth:2,style:'opacity:0',techniques:[]},
 {key:'N09',name:'다국어 열람 안내',title:'여러 언어로 함께 읽는 기록빛',text:'Добро пожаловать! Welcome to Byeolbit Archives. 다국어 열람 안내입니다.',techniques:[]},
 {key:'N10',name:'정상 금융피해 예방',title:'공개 자료 이용의 비용 설명',text:'선입금을 요구하는 대출 광고를 주의하세요. 공공 자료 이용 정보는 공식 기관에서 확인하세요.',table:true,techniques:[]},
 {key:'N11',name:'정상 의약품 예방',title:'생활 안전 문헌의 참고 안내',text:'전문 의약품은 의사의 처방에 따라 복용하세요. 온라인 불법 판매 광고를 클릭하지 마세요.',annotations:true,techniques:[]},
 {key:'N12',name:'1200ms 접근성 상태',title:'문헌 해설 자료 준비 알림',text:'기록의 읽는 설명 자료가 준비되었습니다.',delay:1200,style:'position:absolute;left:-9999px',techniques:[]},
 {key:'N13',name:'작은 정상 각주',title:'모의 기록 자료의 출처 안내',text:'이 문서와 등록 정보는 합성 교육 자료입니다.',details:true,style:'font-size:1px',techniques:[]},
 {key:'N14',name:'조합 자모 문헌 교육',title:'문헌 분류 이름을 조합해서 읽기',text:'행정과 환경 기록을 함께 읽어요.'.normalize('NFD'),annotations:true,techniques:[]},
 {key:'N15',name:'정상 접근성 설명',title:'문서 미리보기의 보조 설명',text:'읽는 순서는 제목, 분류, 판본, 등록일입니다.',style:'clip-path:inset(50%);width:1px;height:1px;overflow:hidden',techniques:[]},
 {key:'N16',name:'화면 아래 정상 주석',title:'긴 문헌 뒤에 이어지는 출처 주석',text:'화면 아래에 이어지는 일반 문헌 안내입니다. 원문과 주석의 출처를 함께 확인해 주세요.',parentStyle:'margin-top:1100px',techniques:[]},
 {key:'N17',name:'작은 정상 판본 주석',title:'판본 표기의 읽기 참고',text:'초안·공개본·수정본 표기는 합성 기록의 구분입니다.',style:'font-size:1px',techniques:[]},
 {key:'N18',name:'정상 iframe 접근성 설명',title:'문서 자료함의 읽는 설명',text:'문서 미리보기의 설명이 준비되었습니다.',frameDepth:1,style:'position:absolute;left:-9999px',techniques:[]}
];
export const authors=['기록정리팀','김서현','문헌자료실','정유나','시민기록단','원문읽기','박지훈','판본대조팀','별빛자료실','이하린','시설기록팀','환경기록단'];
export const collections={administration:'행정 기록',environment:'환경 기록',community:'생활 기록',facilities:'시설 기록'};
export const editions={draft:'초안',published:'공개본',revised:'수정본'};
export const fixtures=data.map((f,index)=>({...f,index,postId:String(18017+index*37),collection:['administration','environment','community','facilities'][index%4],edition:['draft','published','revised'][index%3],category:f.techniques.length?'note':'guide',path:f.deep?'archive/council/2026/autumn/review/notes/read.html':`records/posts/${18017+index*37}.html`}));
export const queryFixtures=[
 {key:'Q01',collection:'administration',edition:'draft',name:'행정 초안 쿼리',text:jamo,techniques:['JAMO']},
 {key:'Q02',collection:'administration',edition:'published',name:'행정 공개본 쿼리',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {key:'Q03',collection:'administration',edition:'revised',name:'행정 수정본 프레임',text:'ｃａｓｉｎｏ 신규 가입 슬롯 보너스',frameDepth:1,style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'Q04',collection:'environment',edition:'draft',name:'환경 초안 쿼리',text:'ＣＡＳ１ＮＯ 온라인 가입 보너스',techniques:['HOMOGLYPH']},
 {key:'Q05',collection:'environment',edition:'published',name:'환경 공개본 쿼리',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'Q06',collection:'environment',edition:'revised',name:'환경 수정본 쿼리',text:loan,parentStyle:'color:transparent',techniques:['TRANSPARENT']},
 {key:'Q07',collection:'community',edition:'draft',name:'생활 초안 쿼리',text:jamo,techniques:['JAMO']},
 {key:'Q08',collection:'community',edition:'published',name:'생활 공개본 쿼리',text:'ｃａｓｉｎｏ 온라인 가입 보너스',style:'display:none',techniques:['HOMOGLYPH','OFFSCREEN']},
 {key:'Q09',collection:'community',edition:'revised',name:'생활 수정본 쿼리',text:adult,parentStyle:'opacity:0',style:'font-size:1px',techniques:['TRANSPARENT','OFFSCREEN']},
 {key:'Q10',collection:'facilities',edition:'draft',name:'시설 초안 프레임',text:jamo,frameDepth:2,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'Q11',collection:'facilities',edition:'published',name:'시설 공개본 쿼리',text:'ＣＡＳ１ＮＯ 온라인 가입 보너스',techniques:['HOMOGLYPH']},
 {key:'Q12',collection:'facilities',edition:'revised',name:'시설 수정본 쿼리',text:jamo,style:'color:transparent',techniques:['JAMO','TRANSPARENT']}
].map((f,i)=>({...f,index:fixtures.length+i,category:'edition',title:`${collections[f.collection]} ${editions[f.edition]} 판본 대조`,path:`records/view.html?collection=${f.collection}&edition=${f.edition}`}));
export const extraElements=[
 {parent:'T01',key:'E01',name:'추가 숨김 주석',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {parent:'T02',key:'E02',name:'추가 자모 투명 주석',text:jamo,style:'opacity:0',techniques:['JAMO','TRANSPARENT']},
 {parent:'T03',key:'E03',name:'추가 전각 투명 주석',text:'ｍｅｇａ－ＢＥＴ 신규 가입 카지노 보너스',style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {parent:'T04',key:'E04',name:'추가 작은 글자 주석',text:medicine,style:'font-size:0',techniques:['OFFSCREEN']},
 {parent:'T05',key:'E05',name:'추가 자모 숨김 의견',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {parent:'T06',key:'E06',name:'추가 투명 의견',text:adult,style:'opacity:0',techniques:['TRANSPARENT']},
 {parent:'T09',key:'E07',name:'추가 전각 작은 주석',text:'ｃａｓｉｎｏ 온라인 슬롯 가입 보너스',style:'font-size:1px',techniques:['HOMOGLYPH','OFFSCREEN']},
 {parent:'T08',key:'E08',name:'추가 자모 투명 의견',text:jamo,style:'opacity:0',techniques:['JAMO','TRANSPARENT']}
];
export const listingPageSize=14,deepestCaseKey='T34',discoveryDelayMs=1000,maxLinkDepth=7,overviewPath='catalogue/index.html';
