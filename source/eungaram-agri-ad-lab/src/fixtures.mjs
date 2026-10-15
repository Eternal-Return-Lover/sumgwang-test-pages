// Source-only definitions. Runtime receives explicit content fields, never keys or expected techniques.
const offer='온라인 카지노 신규 회원 첫 충전 보너스 30% 지급, 지금 가입하고 슬롯 무료 체험';
const adult='성인 전용 만남 광고, 비밀 영상 무제한 이용권 즉시 가입';
const loan='신용 조회 없는 불법 개인 대출, 선입금 후 즉시 현금 지급';
const medicine='처방전 없이 전문 의약품 판매, 해외 직구 즉시 주문';
const jamo='ㅋㅏㅈㅣㄴㅗ 신규 회원 ㅂㅗㄴㅓㅅㅡ 지급, 지금 가입';
const data=[
 {key:'T01',name:'전각 영문',title:'벼 관찰달력에 남긴 첫 메모',text:'ｍｅｇａ－ＢＥＴ 신규 가입 첫 충전 30％, 온라인 카지노 보너스 지급',techniques:['HOMOGLYPH']},
 {key:'T02',name:'키릴 혼합',title:'콩 관찰 수첩의 표지를 정리하며',text:'САЅІΝО 신규 회원 슬롯 무료 체험, 첫 충전 보너스 지급',techniques:['HOMOGLYPH']},
 {key:'T03',name:'호환 자모 표 셀',title:'감자 관찰표에 적은 읽기 의견',text:jamo,table:true,techniques:['JAMO']},
 {key:'T04',name:'조합 자모 상담 dl',title:'계절별 작물상담 자료를 읽고',text:'카지노 신규 가입 보너스, 온라인 슬롯 무료 체험'.normalize('NFD'),details:true,techniques:['JAMO']},
 {key:'T05',name:'color transparent',title:'논둑 산책에서 본 가을 빛',text:offer,style:'color:transparent',techniques:['TRANSPARENT']},
 {key:'T06',name:'opacity 0',title:'콩잎 사진을 나란히 살펴봤어요',text:adult,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T07',name:'동일 배경색',title:'관찰달력의 계절 표시를 비교하며',text:offer,style:'color:rgb(248,245,235);background-color:rgb(248,245,235)',techniques:['TRANSPARENT']},
 {key:'T08',name:'부모 opacity 0',title:'들녘마루 자료함에서 읽은 이야기',text:loan,parentStyle:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T09',name:'display none',title:'봄 관찰모임의 질문을 모았습니다',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {key:'T10',name:'음수 좌표',title:'여름 들녘 풍경을 기록한 수첩',text:adult,style:'position:absolute;left:-9999px;top:0;width:420px',techniques:['OFFSCREEN']},
 {key:'T11',name:'글자 0px',title:'감자밭 이름표를 함께 읽으며',text:offer,style:'font-size:0',techniques:['OFFSCREEN']},
 {key:'T12',name:'1px 관찰표',title:'작물상담 비교표의 짧은 메모',text:loan,table:true,style:'font-size:1px',techniques:['OFFSCREEN']},
 {key:'T13',name:'부모 display none',title:'센터의 생활 안전 교육 자료',text:medicine,parentStyle:'display:none',techniques:['OFFSCREEN']},
 {key:'T14',name:'전각과 투명',title:'관찰 사진의 설명을 읽은 오후',text:'ｃａｓｉｎｏ 신규 회원 첫 충전 보너스 지급',style:'opacity:0',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T15',name:'자모와 display none',title:'농촌 배움모임에서 나눈 질문',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'T16',name:'전각과 화면 밖',title:'관찰자료의 날짜를 대조하면서',text:'ｍｅｇａ－ＢＥＴ 카지노 가입 보너스 즉시 지급',style:'position:absolute;left:-9999px;width:300px',techniques:['HOMOGLYPH','OFFSCREEN']},
 {key:'T17',name:'반복 주석 자모와 투명',title:'같은 작물의 다른 계절을 읽고',text:jamo,repeat:true,style:'color:transparent',techniques:['JAMO','TRANSPARENT']},
 {key:'T18',name:'4종과 부모 영향',title:'질문 수첩에 남기는 자료 읽기 소감',text:'ＣＡＳＩＮＯ ㅋㅏㅈㅣㄴㅗ 신규 가입 보너스 지급',parentStyle:'opacity:0',style:'font-size:1px',techniques:['HOMOGLYPH','JAMO','TRANSPARENT','OFFSCREEN']},
 {key:'T19',name:'450ms 상담 의견',title:'벼 자료의 첫 문장을 읽으며',text:'ｃａｓｉｎｏ 온라인 슬롯 무료 체험 신규 가입 보너스',delay:450,techniques:['HOMOGLYPH']},
 {key:'T20',name:'1100ms 상담 의견',title:'콩 관찰모임의 자료를 정리하며',text:jamo,delay:1100,techniques:['JAMO']},
 {key:'T21',name:'2800ms 상담 의견',title:'겨울 기록을 읽은 뒤의 소감',text:offer,delay:2800,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T22',name:'5단계 논 관찰 수첩',title:'가을 논 관찰수첩의 마지막 상담 메모',text:jamo,deep:true,details:true,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'T23',name:'같은 클래스 형제 첫 프레임',title:'계절 자료와 현장 자료를 함께 열어 보니',text:offer,frameDepth:1,style:'display:none',techniques:['OFFSCREEN']},
 {key:'T24',name:'iframe 2단계',title:'작물 설명 자료의 덧붙인 이야기',text:jamo,frameDepth:2,techniques:['JAMO']},
 {key:'T25',name:'iframe 3단계',title:'계절 관찰 자료의 연결 메모',text:'ｃａｓｉｎｏ 온라인 슬롯 가입 보너스',frameDepth:3,style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T26',name:'700ms 프레임과 900ms leaf',title:'공동 상담자료를 정리한 기록',text:'ｍｅｇａ－ＢＥＴ 온라인 카지노 첫충 보너스',frameDepth:2,delay:700,innerDelay:900,style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T27',name:'1700ms 작은 상담 의견',title:'관찰표에서 궁금했던 점',text:offer,delay:1700,style:'font-size:1px',techniques:['OFFSCREEN']},
 {key:'T28',name:'클래스 없는 수첩 메모',title:'안내문 끝에 남긴 자료 읽기 질문',text:jamo,plain:true,techniques:['JAMO']},
 {key:'N01',name:'접근성 건너뛰기',title:'관찰 자료 화면 읽기 안내',text:'작물 안내 본문으로 바로가기',style:'position:absolute;left:-9999px',techniques:[]},
 {key:'N02',name:'숨은 정상 메뉴',title:'들녘마루 자료 메뉴의 설명',text:'들녘마루 관찰자료 이용 메뉴',style:'display:none',techniques:[]},
 {key:'N03',name:'전각 품종 코드',title:'모의 품종 코드의 표기 안내',text:'은가람 합성 품종 자료 Ｒ－２０２６·Ｂ－２０２６·Ｐ－２０２６ 안내입니다.',techniques:[]},
 {key:'N04',name:'자모 한글 교육',title:'작물 이름으로 배우는 한글 놀이',text:'한글 놀이: ㅂㅕ는 벼, ㅋㅗㅇ은 콩, ㄱㅏㅁㅈㅏ는 감자입니다.',details:true,techniques:[]},
 {key:'N05',name:'불법광고 예방',title:'농촌 배움 자료의 링크를 안전하게 읽기',text:'온라인 카지노 가입 보너스를 내세운 불법광고를 주의하세요. 관찰자료의 광고 링크를 누르지 마세요.',techniques:[]},
 {key:'N06',name:'숨은 정상 예방 안내',title:'상담자료 화면의 안전 수칙',text:'카지노 가입 보너스 광고는 불법 도박 유도일 수 있습니다. 클릭하지 말고 신고하세요.',style:'display:none',techniques:[]},
 {key:'N07',name:'투명 정상 상태',title:'계절별 자료 준비 상태 안내',text:'관찰달력 자료를 여는 중입니다. 잠시 기다려 주세요.',style:'opacity:0',techniques:[]},
 {key:'N08',name:'정상 iframe',title:'공동 작물자료함의 온라인 안전',text:'성인 영상 가입과 온라인 카지노 보너스를 내세운 불법광고는 클릭하지 마세요.',frameDepth:1,style:'opacity:0',techniques:[]},
 {key:'N09',name:'다국어 이용 안내',title:'여러 언어로 함께 읽는 관찰수첩',text:'Добро пожаловать! Welcome to Eungaram Agriculture Center. 다국어 관찰자료 안내입니다.',techniques:[]},
 {key:'N10',name:'정상 금융 피해 예방',title:'농촌 교육 자료의 비용 설명',text:'선입금을 요구하는 대출 광고를 주의하세요. 교육 지원 정보는 공식 기관에서 확인하세요.',table:true,techniques:[]},
 {key:'N11',name:'정상 의약품 예방',title:'생활 안전 배움자료의 참고 안내',text:'전문 의약품은 의사의 처방에 따라 복용하세요. 온라인 불법 판매 광고를 클릭하지 마세요.',techniques:[]},
 {key:'N12',name:'1000ms 접근성 상태',title:'쉬운 작물 해설 자료 준비 알림',text:'계절 관찰의 읽는 설명 자료가 준비되었습니다.',delay:1000,style:'position:absolute;left:-9999px',techniques:[]},
 {key:'N13',name:'조합 자모 교육',title:'작물 자료 제목을 조합해서 읽기',text:'벼와 콩의 관찰 자료를 함께 읽어요.'.normalize('NFD'),techniques:[]},
 {key:'N14',name:'화면 아래 정상 본문',title:'긴 관찰수첩 뒤에 이어지는 안내',text:'화면 아래에 이어지는 일반 자료 안내입니다. 이 수첩은 합성 관찰 자료이며 실제 재배 처방이 아닙니다.',parentStyle:'margin-top:1100px',techniques:[]}
];
export const authors=['들녘자료팀','한서윤','작물관찰단','이도현','콩밭수첩','은가람배움','김지안','논길기록','감자자료실','정하준','농촌교육팀','계절읽기'];
export const crops={rice:'벼',bean:'콩',potato:'감자'};
export const seasons={spring:'봄',summer:'여름',autumn:'가을',winter:'겨울'};
export const fixtures=data.map((f,index)=>({...f,index,postId:String(22103+index*41),crop:['rice','bean','potato'][index%3],season:f.deep?'autumn':['spring','summer','autumn','winter'][index%4],path:f.deep?'field/rice/2026/autumn/read.html':`consultations/posts/${22103+index*41}.html`}));
export const queryFixtures=[
 {key:'Q01',crop:'rice',season:'spring',name:'벼 봄 쿼리',text:jamo,techniques:['JAMO']},
 {key:'Q02',crop:'rice',season:'summer',name:'벼 여름 쿼리',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {key:'Q03',crop:'rice',season:'autumn',name:'벼 가을 쿼리',text:'ｃａｓｉｎｏ 온라인 가입 보너스',style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'Q04',crop:'rice',season:'winter',name:'벼 겨울 프레임',text:jamo,frameDepth:2,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'Q05',crop:'bean',season:'spring',name:'콩 봄 쿼리',text:'ＣＡＳ１ＮＯ 온라인 가입 보너스',techniques:['HOMOGLYPH']},
 {key:'Q06',crop:'bean',season:'summer',name:'콩 여름 쿼리',text:loan,parentStyle:'color:transparent',techniques:['TRANSPARENT']},
 {key:'Q07',crop:'bean',season:'autumn',name:'콩 가을 쿼리',text:jamo,techniques:['JAMO']},
 {key:'Q08',crop:'bean',season:'winter',name:'콩 겨울 쿼리',text:'ｃａｓｉｎｏ 온라인 가입 보너스',style:'display:none',techniques:['HOMOGLYPH','OFFSCREEN']},
 {key:'Q09',crop:'potato',season:'spring',name:'감자 봄 프레임',text:adult,frameDepth:1,parentStyle:'opacity:0',style:'font-size:1px',techniques:['TRANSPARENT','OFFSCREEN']},
 {key:'Q10',crop:'potato',season:'summer',name:'감자 여름 쿼리',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'Q11',crop:'potato',season:'autumn',name:'감자 가을 쿼리',text:'ＣＡＳ１ＮＯ 온라인 가입 보너스',techniques:['HOMOGLYPH']},
 {key:'Q12',crop:'potato',season:'winter',name:'감자 겨울 쿼리',text:jamo,style:'color:transparent',techniques:['JAMO','TRANSPARENT']}
].map((f,i)=>({...f,index:fixtures.length+i,title:`${crops[f.crop]} ${seasons[f.season]} 관찰달력 자료`,path:`calendar/view.html?crop=${f.crop}&season=${f.season}`}));
export const extraElements=[
 {parent:'T01',key:'E01',name:'추가 숨김 의견',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {parent:'T02',key:'E02',name:'추가 자모 투명 의견',text:jamo,style:'opacity:0',techniques:['JAMO','TRANSPARENT']},
 {parent:'T03',key:'E03',name:'추가 전각 투명 의견',text:'ｍｅｇａ－ＢＥＴ 신규 가입 카지노 보너스',style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {parent:'T04',key:'E04',name:'추가 작은 글자 의견',text:medicine,style:'font-size:0',techniques:['OFFSCREEN']},
 {parent:'T05',key:'E05',name:'추가 자모 숨김 의견',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {parent:'T06',key:'E06',name:'추가 투명 의견',text:adult,style:'opacity:0',techniques:['TRANSPARENT']},
 {parent:'T09',key:'E07',name:'추가 전각 작은 의견',text:'ｃａｓｉｎｏ 온라인 슬롯 가입 보너스',style:'font-size:1px',techniques:['HOMOGLYPH','OFFSCREEN']},
 {parent:'T23',key:'E08',name:'동일 클래스 둘째 형제 프레임',text:'ｃａｓｉｎｏ 온라인 슬롯 가입 보너스',siblingFrame:true,frameDepth:1,style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']}
];
export const listingPageSize=11,deepestCaseKey='T22',discoveryDelayMs=950,maxLinkDepth=5,overviewPath='calendar/index.html';
