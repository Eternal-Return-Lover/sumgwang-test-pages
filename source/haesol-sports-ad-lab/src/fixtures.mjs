// Source-only definitions. The public site never loads this file or case IDs.
const casino='온라인 카지노 신규 가입 첫 충전 보너스 지급, 슬롯 무료 체험 즉시 신청';
const adult='성인 전용 비밀 영상 무제한 이용권, 신규 가입 회원 모집';
const loan='신용 조회 없는 불법 개인 대출, 선입금 후 즉시 현금 지급';
const medicine='처방전 없이 전문 의약품 판매, 해외 직구 즉시 주문';
const jamo='ㅋㅏㅈㅣㄴㅗ 신규 회원 ㅂㅗㄴㅓㅅㅡ 지급, 지금 가입';
const full='ｓｐｏｒｔ－ＢＥＴ 온라인 카지노 첫 충전 보너스 지급';
const positives=[
 {name:'전각 영문',text:full,techniques:['HOMOGLYPH']},
 {name:'키릴 혼합',text:'САЅІΝО 신규 가입 보너스, 온라인 슬롯 무료 체험',techniques:['HOMOGLYPH']},
 {name:'숫자 치환',text:'CAS1N0 카지노 신규 회원 첫 충전 보너스 지급',techniques:['HOMOGLYPH']},
 {name:'전각 한영 혼합',text:'온라인 ｂｅｔｔｉｎｇ 카지노 신규 가입 혜택',techniques:['HOMOGLYPH']},
 {name:'호환 자모',text:jamo,techniques:['JAMO']},
 {name:'조합 자모 NFD',text:casino.normalize('NFD'),techniques:['JAMO']},
 {name:'자모 사이 공백',text:'ㅋ ㅏ ㅈ ㅣ ㄴ ㅗ 신규 가입 보너스 즉시 지급',techniques:['JAMO']},
 {name:'부분 음절 분해',text:'온라인 카ㅈㅣ노 신규 회원 보너스 지급',techniques:['JAMO']},
 {name:'투명 색상',text:casino,style:'color:transparent',techniques:['TRANSPARENT']},
 {name:'불투명도 0',text:adult,style:'opacity:0',techniques:['TRANSPARENT']},
 {name:'배경색과 같은 글자',text:loan,style:'color:rgb(255,255,255);background-color:rgb(255,255,255)',techniques:['TRANSPARENT']},
 {name:'부모 불투명도',text:medicine,parentStyle:'opacity:0',techniques:['TRANSPARENT']},
 {name:'알파 0 색상',text:casino,style:'color:rgba(40,60,80,0)',techniques:['TRANSPARENT']},
 {name:'부모 투명 색상 상속',text:adult,parentStyle:'color:transparent',techniques:['TRANSPARENT']},
 {name:'display:none',text:casino,style:'display:none',techniques:['OFFSCREEN']},
 {name:'왼쪽 음수 좌표',text:adult,style:'position:absolute;left:-9000px;top:0;width:320px',techniques:['OFFSCREEN']},
 {name:'글자 크기 0',text:loan,style:'font-size:0',techniques:['OFFSCREEN']},
 {name:'글자 크기 1',text:medicine,style:'font-size:1px',techniques:['OFFSCREEN']},
 {name:'부모 display:none',text:casino,parentStyle:'display:none',techniques:['OFFSCREEN']},
 {name:'상단 음수 좌표',text:adult,style:'position:fixed;top:-5000px;left:0;width:300px',techniques:['OFFSCREEN']},
 {name:'전각과 투명',text:full,style:'opacity:0',techniques:['HOMOGLYPH','TRANSPARENT']},
 {name:'자모와 부모 은닉',text:jamo,parentStyle:'display:none',techniques:['JAMO','OFFSCREEN']},
 {name:'전각과 음수 위치',text:full,style:'position:absolute;left:-8000px;width:320px',techniques:['HOMOGLYPH','OFFSCREEN']},
 {name:'자모와 투명',text:jamo,style:'color:transparent',techniques:['JAMO','TRANSPARENT']},
 {name:'650ms 댓글',text:full,delay:650,techniques:['HOMOGLYPH']},
 {name:'1600ms 댓글',text:jamo,delay:1600,techniques:['JAMO']},
 {name:'2800ms 투명 댓글',text:casino,delay:2800,style:'opacity:0',techniques:['TRANSPARENT']},
 {name:'1단계 프레임',text:medicine,frameDepth:1,style:'display:none',techniques:['OFFSCREEN']},
 {name:'2단계 프레임',text:jamo,frameDepth:2,techniques:['JAMO']},
 {name:'1200ms 지연 프레임',text:full,frameDepth:2,delay:1200,style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {name:'같은 클래스의 세 번째 형제',text:casino,repeat:true,style:'opacity:0',techniques:['TRANSPARENT']},
 {name:'클래스 없는 리스트 자식',text:jamo,plain:true,techniques:['JAMO']},
 {name:'3종 복합 부모 은닉',text:'ｃａｓｉｎｏ ㅋㅏㅈㅣㄴㅗ 신규 가입 보너스',parentStyle:'display:none',techniques:['HOMOGLYPH','JAMO','OFFSCREEN']},
 {name:'부모 투명과 작은 글자',text:adult,parentStyle:'opacity:0',style:'font-size:1px',techniques:['TRANSPARENT','OFFSCREEN']},
 {name:'프레임과 내부 지연',text:jamo,frameDepth:2,delay:650,innerDelay:1600,techniques:['JAMO']},
 {name:'3단계 프레임의 부모 은닉',text:medicine,frameDepth:3,parentStyle:'display:none',techniques:['OFFSCREEN']},
 {name:'활동 표의 투명 부모',text:loan,table:true,parentStyle:'color:transparent',techniques:['TRANSPARENT']},
 {name:'활동 표의 전각 은닉',text:full,table:true,parentStyle:'display:none',techniques:['HOMOGLYPH','OFFSCREEN']},
 {name:'인용 영역의 투명 광고',text:casino,quote:true,style:'color:transparent',techniques:['TRANSPARENT']},
 {name:'화면 위 인용문',text:adult,quote:true,style:'position:absolute;top:-9000px;width:300px',techniques:['OFFSCREEN']},
 {name:'자모가 반복되는 한 요소',text:jamo+' / ㅅㅡㄹㅗㅅㅡ 무료 체험',techniques:['JAMO']},
 {name:'6단계 활동 기록',text:casino,deep:true,style:'color:transparent',techniques:['TRANSPARENT']},
 {name:'지연 링크 끝 전각 기록',text:full,deep:true,style:'opacity:0',techniques:['HOMOGLYPH','TRANSPARENT']},
 {name:'3단계 프레임 복합 기법',text:full,frameDepth:3,style:'font-size:1px;color:transparent',techniques:['HOMOGLYPH','TRANSPARENT','OFFSCREEN']}
].map((f,i)=>({...f,key:'T'+String(i+1).padStart(2,'0')}));
const normals=[
 {name:'접근성 숨김 안내',text:'운동 시설 안내 본문으로 바로가기',style:'position:absolute;left:-9999px'},
 {name:'접힌 정상 메뉴',text:'수영장·체육관 이용 안내 메뉴',style:'display:none'},
 {name:'한글 교육',text:'어린이 운동교실 언어 놀이: ㅋㅏ는 카, ㄴㅏ는 나로 읽어요.'},
 {name:'전각 행사 표기',text:'２０２６ ＨＡＥＳＯＬ ＳＰＯＲＴＳ ＤＡＹ 시민 체육 행사'},
 {name:'도박 예방 문맥',text:'스포츠를 즐기는 마음을 온라인 카지노 가입 보너스 광고에 이용하지 못하도록 주의하세요.'},
 {name:'숨겨진 예방 안내',text:'카지노 신규 가입 광고를 클릭하지 말고 불법 도박 유도 문구를 신고하세요.',style:'display:none'},
 {name:'투명 로딩 안내',text:'운동 프로그램 정보를 불러오는 중입니다.',style:'opacity:0'},
 {name:'아래쪽 일반 안내',text:'페이지 아래의 시설 이용 예절입니다. 운동 기구 사용 후 제자리에 정리하세요.',parentStyle:'margin-top:1100px'},
 {name:'다국어 운동 안내',text:'Добро пожаловать! Welcome to Haesol. 시민 생활체육 안내입니다.'},
 {name:'성인 프로그램 모집',text:'성인 수영교실 신규 회원을 모집합니다. 운동 강습과 체육시설 이용 안내입니다.'},
 {name:'의약품 예방 문맥',text:'전문 의약품은 처방에 따라 복용하세요. 운동 보조제를 내세운 불법 판매에 주의하세요.'},
 {name:'금융 피해 예방',text:'선입금을 요구하는 대출 광고를 경계하고 공식 상담 기관을 확인하세요.'},
 {name:'NFD 교육 문장',text:'어린이 교실에서 한글과 운동을 함께 배워요.'.normalize('NFD')},
 {name:'프레임 안 예방 안내',text:'성인 영상 가입과 카지노 보너스를 광고하는 글은 클릭하지 마세요.',frameDepth:2,style:'opacity:0'},
 {name:'지연 접근성 안내',text:'동호회 활동 기록을 모두 불러왔습니다.',delay:1600,style:'position:absolute;left:-9999px'},
 {name:'작은 정상 사진 각주',text:'체육 행사 사진은 참여자의 동의를 받아 게시합니다.',style:'font-size:1px'}
].map((f,i)=>({...f,key:'N'+String(i+1).padStart(2,'0'),techniques:[]}));

export const fixtures=[...positives,...normals].map((f,i)=>({...f,index:i,postId:String(7301+i*17),category:f.techniques.length?'club':'notice',path:f.deep?`records/2026/autumn/weekend/${f.key==='T42'?'walks':'teams'}/read.html`:`community/posts/${7301+i*17}.html`}));
export const queryFixtures=[
 {key:'Q01',name:'같은 ID 수영장 본문',postId:'901',venue:'pool',text:jamo,techniques:['JAMO']},
 {key:'Q02',name:'같은 ID 체육관 본문',postId:'901',venue:'gym',text:full,style:'display:none',techniques:['HOMOGLYPH','OFFSCREEN']},
 {key:'Q03',name:'다른 ID 수영장 본문',postId:'902',venue:'pool',text:casino,parentStyle:'opacity:0',techniques:['TRANSPARENT']},
 {key:'Q04',name:'다른 ID 체육관 본문',postId:'902',venue:'gym',text:jamo,style:'font-size:0',techniques:['JAMO','OFFSCREEN']}
].map((f,i)=>({...f,index:fixtures.length+i,category:'club',path:`community/view.html?id=${f.postId}&venue=${f.venue}`}));
export const extraElements=[
 {key:'E01',parent:'T01',name:'두 번째 댓글 광고',text:casino,style:'display:none',techniques:['OFFSCREEN']},
 {key:'E02',parent:'T02',name:'두 번째 복합 댓글',text:jamo,style:'opacity:0',techniques:['JAMO','TRANSPARENT']},
 {key:'E03',parent:'T03',name:'세 번째 전각 댓글',text:full,style:'color:transparent',techniques:['HOMOGLYPH','TRANSPARENT']},
 {key:'E04',parent:'T03',name:'같은 글 다른 숨김 댓글',text:medicine,style:'font-size:0',techniques:['OFFSCREEN']}
];
export const titles=['퇴근 후 배드민턴 한 게임의 즐거움','토요일 아침 수영장에서 시작한 하루','초보 러너의 해솔 둘레길 첫 완주','우리 동호회의 가을 농구 모임','아이와 함께한 주말 체육교실','작은 습관으로 만드는 건강한 하루','체육관에서 만난 새로운 이웃','스트레칭을 함께 배우는 점심시간','해솔 시민 걷기 행사 참여 후기','다시 찾은 탁구대, 반가운 한 판','비 오는 날 실내 운동을 즐기는 방법','수영 강습에서 배운 호흡 연습'];
export const authors=['해솔러너','아침수영','동네코치','주말산책','라켓친구','함께걷기','건강한하루','체육관이웃'];
export const titleFor=f=>f.venue?`${f.venue==='pool'?'수영장':'체육관'} 동호회 활동 기록`:f.category==='notice'?['시민 생활체육과 온라인 안전 안내','어린이 운동교실 자료 나눔','센터 이용 예절과 접근성 안내'][f.index%3]:titles[f.index%titles.length];
