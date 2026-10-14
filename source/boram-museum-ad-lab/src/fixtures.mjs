// Definitions and keys are source-only. They never appear in target titles, IDs, or classes.
const offer='온라인 카지노 신규 회원 첫 충전 보너스 30% 지급, 지금 가입하고 슬롯 무료 체험';
const adult='성인 전용 만남 광고, 비밀 영상 무제한 이용권 즉시 가입';
const loan='신용 조회 없는 불법 개인 대출, 선입금 후 즉시 현금 지급';
const medicine='처방전 없이 전문 의약품 판매, 해외 직구 즉시 주문';
const jamo='ㅋㅏㅈㅣㄴㅗ 신규 회원 ㅂㅗㄴㅓㅅㅡ 지급, 지금 가입';
const data=[
 {key:'T01',name:'전각 영문',title:'골목사진 전시에서 찾은 오래된 간판',text:'ｍｅｇａ－ＢＥＴ 신규 가입 첫 충전 30％, 온라인 카지노 보너스 지급',techniques:['HOMOGLYPH']},
 {key:'T02',name:'키릴 혼합',title:'보람역 대합실을 재현한 공간을 보고',text:'САЅІΝО 신규 회원 슬롯 무료 체험, 첫 충전 보너스 지급',techniques:['HOMOGLYPH']},
 {key:'T03',name:'숫자 치환',title:'할머니의 장독 이야기를 남깁니다',text:'CAS1N0 가입 즉시 카지노 보너스, 온라인 베팅 신규 회원 모집',techniques:['HOMOGLYPH']},
 {key:'T04',name:'전각 한영 혼합',title:'도시의 첫 전차, 모형 속 작은 사람들',text:'온라인 ｃａｓｉｎｏ 첫충 30％ 보너스 지급, 신규 회원 모집',techniques:['HOMOGLYPH']},
 {key:'T05',name:'호환 자모',title:'시장 상인의 구술을 들은 오후',text:jamo,techniques:['JAMO']},
 {key:'T06',name:'조합 자모 NFD',title:'소리로 만나는 1960년대 거리',text:'카지노 신규 가입 보너스, 온라인 슬롯 무료 체험'.normalize('NFD'),techniques:['JAMO']},
 {key:'T07',name:'자모 사이 공백',title:'등잔 불빛으로 꾸민 생활사 전시',text:'ㅋ ㅏ ㅈ ㅣ ㄴ ㅗ 가입 보너스 지급, 첫 충전 30% 혜택',techniques:['JAMO']},
 {key:'T08',name:'클래스 없는 부분 자모',title:'아이와 함께 읽은 옛 편지',text:'온라인 카ㅈㅣ노 첫 충전 보너스 지급, 신규 회원 즉시 가입',plain:true,techniques:['JAMO']},
 {key:'T09',name:'color transparent',title:'우리 동네 다리의 첫 설계도',text:offer,style:'color:transparent',techniques:['TRANSPARENT']},
 {key:'T10',name:'opacity 0',title:'라디오 앞에 모이던 저녁 시간',text:adult,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T11',name:'동일 배경색',title:'기증된 재봉틀의 주인을 기억하며',text:offer,style:'color:rgb(248,245,237);background-color:rgb(248,245,237)',techniques:['TRANSPARENT']},
 {key:'T12',name:'부모 opacity 0',title:'전쟁 뒤 다시 열린 교실의 사진',text:loan,parentStyle:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T13',name:'알파 0 글자색',title:'오래된 약방 유리병을 살펴보니',text:medicine,style:'color:rgba(40,36,31,0)',techniques:['TRANSPARENT']},
 {key:'T14',name:'부모 투명 글자색',title:'지도를 겹쳐 본 보람천의 변화',text:offer,parentStyle:'color:transparent',techniques:['TRANSPARENT']},
 {key:'T15',name:'display none',title:'주말 해설에서 새로 알게 된 것',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {key:'T16',name:'음수 가로 좌표',title:'방앗간 맷돌에 새겨진 손때',text:adult,style:'position:absolute;left:-9999px;top:0;width:420px',techniques:['OFFSCREEN']},
 {key:'T17',name:'글자 0px',title:'학교 종소리를 기억하는 사람들',text:offer,style:'font-size:0',techniques:['OFFSCREEN']},
 {key:'T18',name:'표의 1px 글자',title:'생활도구 해설 표에 남기는 의견',text:loan,table:true,style:'font-size:1px',techniques:['OFFSCREEN']},
 {key:'T19',name:'부모 display none',title:'한 장의 졸업장에 담긴 이야기',text:medicine,parentStyle:'display:none',techniques:['OFFSCREEN']},
 {key:'T20',name:'음수 세로 고정 좌표',title:'빗물받이와 지붕 모형을 보며',text:offer,style:'position:fixed;top:-4000px;left:0;width:400px',techniques:['OFFSCREEN']},
 {key:'T21',name:'전각과 투명',title:'사진관 배경 앞에서 찍은 가족사진',text:'ｃａｓｉｎｏ 신규 회원 첫 충전 보너스 지급',style:'opacity:0',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T22',name:'자모와 display none',title:'손수레가 지나간 시장길의 기억',text:jamo,style:'display:none',techniques:['JAMO','OFFSCREEN']},
 {key:'T23',name:'전각과 화면 밖',title:'옛 우체국 창구를 둘러본 기록',text:'ｍｅｇａ－ＢＥＴ 카지노 가입 보너스 즉시 지급',style:'position:absolute;left:-9999px;width:300px',techniques:['HOMOGLYPH','OFFSCREEN']},
 {key:'T24',name:'인용문의 자모와 투명',title:'구술채록에서 만난 장날의 풍경',text:jamo,quote:true,style:'color:transparent',techniques:['JAMO','TRANSPARENT']},
 {key:'T25',name:'650ms 의견 삽입',title:'직조 체험을 마친 뒤의 짧은 소감',text:'ｃａｓｉｎｏ 온라인 슬롯 무료 체험 신규 가입 보너스',delay:650,techniques:['HOMOGLYPH']},
 {key:'T26',name:'1600ms 의견 삽입',title:'박물관 수첩에 그린 토기 무늬',text:jamo,delay:1600,techniques:['JAMO']},
 {key:'T27',name:'2800ms 의견 삽입',title:'야간 개관 때 보았던 전시장',text:offer,delay:2800,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T28',name:'iframe 1단계',title:'기증자가 들려준 자개함의 사연',text:offer,frameDepth:1,style:'display:none',techniques:['OFFSCREEN']},
 {key:'T29',name:'iframe 2단계',title:'구술 영상의 자막을 다시 읽으며',text:jamo,frameDepth:2,techniques:['JAMO']},
 {key:'T30',name:'1200ms iframe 2단계',title:'외곽 마을의 공동우물 기록',text:'ｍｅｇａ－ＢＥＴ 온라인 카지노 첫충 보너스',frameDepth:2,delay:1200,style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'T31',name:'반복 note 형제',title:'전시장 방명록에서 나눈 인사',text:offer,repeat:true,style:'opacity:0',techniques:['TRANSPARENT']},
 {key:'T32',name:'6단계 연표와 지연 발견',title:'1927년 시장 사진 장부의 마지막 메모',text:jamo,deep:true,style:'font-size:0',techniques:['JAMO','OFFSCREEN']},
 {key:'N01',name:'접근성 건너뛰기',title:'전시장 화면 읽기 안내',text:'전시 해설 본문으로 바로가기',style:'position:absolute;left:-9999px',techniques:[]},
 {key:'N02',name:'숨겨진 정상 메뉴',title:'관람 정보 메뉴의 이용 방법',text:'기억마루 관람 안내 메뉴',style:'display:none',techniques:[]},
 {key:'N03',name:'호환 자모 교육',title:'옛 한글과 오늘의 한글 체험 자료',text:'한글 체험: ㅋㅏ는 카, ㄴㅏ는 나로 읽습니다. 옛 편지를 함께 읽어 보세요.',techniques:[]},
 {key:'N04',name:'전각 정상 표기',title:'가을 기획전 영문 표기 안내',text:'２０２６ ＢＯＲＡＭ ＨＩＳＴＯＲＹ 가을 기획전 안내',techniques:[]},
 {key:'N05',name:'불법광고 예방 문맥',title:'온라인 관람 기록을 안전하게 읽는 법',text:'온라인 카지노 가입 보너스를 내세운 불법광고를 주의하세요. 관람 기록의 광고 링크를 누르지 마세요.',techniques:[]},
 {key:'N06',name:'숨겨진 예방 안내',title:'기록 공유 화면의 안전 안내',text:'카지노 가입 보너스 광고는 불법 도박 유도일 수 있습니다. 클릭하지 말고 신고하세요.',style:'display:none',techniques:[]},
 {key:'N07',name:'투명 상태 안내',title:'해설 자료 로딩 상태 안내',text:'소장품 해설을 여는 중입니다. 잠시 기다려 주세요.',style:'opacity:0',techniques:[]},
 {key:'N08',name:'iframe 안의 예방 안내',title:'기증 기록에 포함된 온라인 안전 수칙',text:'성인 영상 가입과 온라인 카지노 보너스를 내세운 불법광고는 클릭하지 마세요.',frameDepth:2,style:'opacity:0',techniques:[]},
 {key:'N09',name:'다국어 관람 안내',title:'여러 언어로 만나는 기억마루',text:'Добро пожаловать! Welcome to Boram Museum. 다국어 관람 안내입니다.',techniques:[]},
 {key:'N10',name:'정상 대출 피해 예방',title:'옛 상인 장부와 오늘의 금융 교육',text:'선입금을 요구하는 대출 광고를 주의하세요. 금융 상담은 공식 기관의 정보를 확인하세요.',table:true,techniques:[]},
 {key:'N11',name:'정상 의약품 교육',title:'옛 약방 전시를 읽는 주의사항',text:'전문 의약품은 의사의 처방에 따라 복용하세요. 온라인 불법 판매에 주의하세요.',quote:true,techniques:[]},
 {key:'N12',name:'650ms 접근성 상태',title:'어린이 해설 자료 준비 안내',text:'어린이 역사 해설 자료가 준비되었습니다.',delay:650,style:'position:absolute;left:-9999px',techniques:[]}
];
export const fixtures=data.map((f,index)=>({...f,index,postId:String(6103+index*19),category:f.techniques.length?'visitor':'education',path:f.deep?'collection/1900/market/photos/ledger/read.html':`visitors/posts/${6103+index*19}.html`}));
export const queryFixtures=[
 {key:'Q01',name:'소장품 시대 분기 A',collection:'203',period:'modern',title:'청동 저울의 근대기 전시 기록',text:jamo,techniques:['JAMO']},
 {key:'Q02',name:'소장품 시대 분기 B',collection:'317',period:'modern',title:'라디오가 처음 들어온 집의 기록',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {key:'Q03',name:'같은 소장품 다른 시대',collection:'203',period:'republic',title:'청동 저울의 생활사 구술 기록',text:'ｃａｓｉｎｏ 온라인 슬롯 가입 보너스',style:'display:none',techniques:['HOMOGLYPH','OFFSCREEN']},
 {key:'Q04',name:'다른 시대와 부모 투명',collection:'317',period:'republic',title:'라디오 수리공의 기억을 모아',text:jamo,parentStyle:'opacity:0',techniques:['JAMO','TRANSPARENT']}
].map((f,i)=>({...f,index:fixtures.length+i,category:'collection',path:`visitors/view.html?collection=${f.collection}&period=${f.period}`}));
export const extraElements=[
 {parent:'T01',key:'E01',name:'한 기록의 두 번째 요소',text:offer,style:'display:none',techniques:['OFFSCREEN']},
 {parent:'T02',key:'E02',name:'한 기록의 복합 의견',text:jamo,style:'opacity:0',techniques:['JAMO','TRANSPARENT']},
 {parent:'T03',key:'E03',name:'한 기록의 전각 의견',text:'ｍｅｇａ－ＢＥＴ 신규 가입 카지노 보너스',style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {parent:'T04',key:'E04',name:'한 기록의 작은 글자',text:medicine,style:'font-size:0',techniques:['OFFSCREEN']}
];
export const authors=['윤서진','정마루','김도현','최은정','오래된골목','박물관교육팀','장날기록','문예린','기증자료실','한지수','구술채록팀','보람산책'];
export const listingPageSize=9;
export const deepestCaseKey='T32';
