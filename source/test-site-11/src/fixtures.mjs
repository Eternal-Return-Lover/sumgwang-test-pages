// Private definitions and annotations. Public renderers select display fields explicitly.
export const categoryProfile='all-11-v1';
export const desks={online:'온라인 생활',goods:'제품과 건강',money:'거래와 금융'};
export const views={note:'자료 메모',letter:'시민 이야기'};
export const authors=['김서윤','임도현','박다정','문하진','오지안','이로운','서민재','정수빈','한예림','윤가온','최하람'];
export const categories=[
 {code:'GAMBLING',label:'도박',desk:'online',word:'카지노',jamo:'ㅋㅏㅈㅣㄴㅗ',titles:['앱 화면의 작은 문구를 함께 읽었습니다','온라인 이용 약관에서 궁금했던 점','보너스 안내를 본 시민의 읽기 메모','화면 밖에 이어진 안내를 살펴보니','도박성 광고를 만났을 때의 자료','공공 여가교육 자료실 이용 안내'],ads:['ＬＵＣＫ 슬롯 회원을 모십니다. 가입 보너스와 판돈 환전을 약속하는 특별 모집입니다.','ㅋㅏㅈㅣㄴㅗ 전용 회원방에서 베팅을 시작하세요. 첫 참여 지원금을 내세워 가입을 권합니다.','매일 판돈을 걸고 현금 보상을 노리는 온라인 도박 회원을 모집합니다.','카지노 재가입 고객에게 추가 베팅 자금을 준다는 한정 행사를 홍보합니다.'],normals:['도박 가입 보너스와 환전 약속으로 참여를 유도하는 광고는 접근하지 말고 예방 자료를 확인하세요.','공공 여가교육 자료실은 합성 보드게임 수업의 읽기 자료와 이용 안내를 제공합니다.'],boundary:'판돈을 거는 온라인 도박 참여와 회원 모집을 광고하는 합성 설정이며 일반 여가 상품이 아닙니다.'},
 {code:'DRUG',label:'마약류',desk:'online',word:'마약',jamo:'ㅁㅏㅇㅑㄱ',titles:['메신저의 낯선 초대 문장을 기록했어요','익명 게시물에 붙은 짧은 답글','비공개 판매 안내가 도착한 이야기','관심 문구를 모아 읽은 시민 노트','마약류 오남용 예방자료 읽기','시민 안전교육 자료실을 소개합니다'],ads:['ＮＯＶＡ는 금지 마약류의 비밀 판매를 내세우며 구매자를 모으는 합성 상점입니다.','ㅁㅏㅇㅑㄱ 판매 예약을 받는다는 익명 모집 문구입니다. 비공개 거래를 제안합니다.','금지 마약류를 몰래 판매하겠다며 신규 구매자 우대 조건을 홍보하는 합성 광고입니다.','마약 구매자를 대상으로 반복 주문 혜택을 내건 비밀 판매 광고입니다.'],normals:['마약류 판매를 암시하는 익명 초대에는 응답하지 마세요. 이 자료는 오남용 예방을 위한 합성 교육 문장입니다.','시민 안전교육 자료실의 마약류 오남용 예방 강의 목록과 공공정보 열람 방법입니다.'],boundary:'주된 광고 대상은 합성 설정의 금지 마약류 판매이며 일반 의약품이나 의료 상담이 아닙니다. 제조·복용·유통 실행 정보는 없습니다.'},
 {code:'PHARMACEUTICAL',label:'의약품',desk:'goods',word:'의약품',jamo:'ㅇㅢㅇㅑㄱㅍㅜㅁ',titles:['제품 안내의 확인 항목을 정리하며','처방 확인 문구가 빠진 안내를 읽고','작은 상품 설명란에 남긴 의견','의약품 광고 문장을 비교해 봤어요','온라인 의약품 광고 예방 메모','의약품 정보교육 자료 열람 안내'],ads:['ＭＥＤＩ 상점은 처방전 확인 없이 전문의약품을 판매한다며 주문을 권합니다.','처방 대상 전문의약품인 ㅇㅢㅇㅑㄱㅍㅜㅁ을 처방 확인 없이 판매하겠다며 묶음 구매를 재촉합니다.','전문의약품을 정상 확인 절차 없이 판매하는 합성 상점이 가격 혜택을 광고합니다.','허가받지 않은 합성 판매자가 처방 대상 전문의약품을 처방 확인 없이 판매하겠다며 구매자를 따로 모집하는 안내입니다.'],normals:['처방 확인 없이 의약품을 판다는 광고를 주의하세요. 실제 구매나 복용을 안내하는 내용이 아닙니다.','공공 의약품 정보교육 자료의 제목과 출처를 확인하는 수업 안내입니다. 특정 제품 구매나 치료를 권하지 않습니다.'],boundary:'판매 대상이 전문의약품이고 합성 판매자가 확인 절차를 생략한다고 설정했습니다. 식품의 건강 효능 광고와 구분합니다.'},
 {code:'FOOD_HEALTH',label:'식품·건강식품',desk:'goods',word:'건강식품',jamo:'ㄱㅓㄴㄱㅏㅇㅅㅣㄱㅍㅜㅁ',titles:['건강식품 설명의 강조 문장을 읽고','식품 포장에 덧붙은 긴 답변','효과를 약속하는 안내를 비교하며','식품 상담자료 끝에 남긴 메모','식품 광고의 과장 표현을 살펴봐요','공공 식생활 교육자료 이용 안내'],ads:['ＶＩＴＡ 건강식품을 사면 모든 질병이 낫는다고 장담하며 대량 구매를 유도합니다.','ㄱㅓㄴㄱㅏㅇㅅㅣㄱㅍㅜㅁ만 먹으면 치료가 끝난다는 허위 보장으로 정기 구매를 권합니다.','일반 식품을 만병 치료 상품처럼 꾸며 놓고 효과를 확정한다며 판매합니다.','건강식품 재구매 고객에게 질병 완치를 보장한다는 합성 판촉 문구입니다.'],normals:['건강식품 광고의 치료 보장 문구는 비판적으로 읽어 보세요. 이 자료는 과장 표현을 구별하는 예방 교육입니다.','공공 식생활 수업에서 식품 표시를 읽고 균형 잡힌 선택을 연습하는 합성 프로그램 안내입니다.'],boundary:'판매 대상은 일반 식품·건강식품이며 의약품으로 설정하지 않았습니다. 치료·완치를 확정하는 허위 판매 주장을 주된 광고 의도로 삼았습니다.'},
 {code:'COSMETIC',label:'화장품',desk:'goods',word:'화장품',jamo:'ㅎㅘㅈㅏㅇㅍㅜㅁ',titles:['화장품 설명 카드의 문장을 모았습니다','외모 변화 광고에 관한 시민 이야기','사용 후기 옆에 붙은 짧은 안내','상품 설명의 약속을 다시 읽어보니','화장품 과장 광고 예방자료','생활 제품 표시 읽기 수업 안내'],ads:['ＧＬＯＷ 화장품을 바르기만 하면 수술과 같은 변화를 확정한다며 구매를 재촉합니다.','ㅎㅘㅈㅏㅇㅍㅜㅁ 하나로 피부 질환이 반드시 사라진다는 보장 광고입니다.','일반 화장품을 치료 상품처럼 소개하고 결과를 확정하는 합성 판매 문장입니다.','화장품 세트를 사면 의료적 변화가 보장된다며 과장된 전후 결과로 모집합니다.'],normals:['화장품 광고에서 치료나 확정된 변화를 보장하는 표현을 발견하면 출처를 확인하세요. 과장 광고 예방을 위한 문장입니다.','생활 제품 표시 읽기 수업은 화장품의 용도·표시 항목을 비교하는 합성 교육자료를 제공합니다.'],boundary:'판매 대상은 바르는 화장품입니다. 기기 판매나 실제 치료 사실이 아닌 합성 광고의 보장·과장 설정을 근거로 합니다.'},
 {code:'MEDICAL_DEVICE',label:'의료기기',desk:'goods',word:'의료기기',jamo:'ㅇㅢㄹㅛㄱㅣㄱㅣ',titles:['기기 소개표의 확인 문구를 살펴보며','작동 설명 옆에서 읽은 상품 답변','기기 홍보자료의 문장을 비교했어요','전시 제품 상담의 덧붙인 이야기','의료기기 구매 유도 광고 예방','공공 기기정보 읽기 교육 안내'],ads:['ＰＵＬＳＥ 의료기기는 허가 확인 없이 판매하며 어떤 질환도 치료한다고 약속합니다.','ㅇㅢㄹㅛㄱㅣㄱㅣ를 사면 진단과 치료가 모두 확정된다며 확인되지 않은 효능으로 판매합니다.','정상 확인 자료가 없는 합성 치료 기기를 만능 장치로 소개하며 구매를 유도합니다.','허가받지 않은 합성 기기 판매자가 치료 결과를 보장하며 공동구매를 모집합니다.'],normals:['의료기기 광고의 만능 치료 약속에 주의하세요. 이 문장은 광고 예방 교육이며 실제 작동이나 치료 방법을 안내하지 않습니다.','공공 기기정보 교육은 자료의 출처와 표시 항목을 읽는 합성 수업입니다. 기기 구매·사용을 권하지 않습니다.'],boundary:'주된 판매 대상은 합성 의료기기입니다. 화장품·식품과 달리 기기를 팔며 확인되지 않은 치료 보장을 제시하는 설정입니다.'},
 {code:'PRIVATE_LOAN',label:'불법 대부',desk:'money',word:'대출',jamo:'ㄷㅐㅊㅜㄹ',titles:['급한 자금 안내를 보고 남긴 질문','금융 상담 문구를 차례로 읽었습니다','대출 안내의 작은 조건을 살펴보며','계약 전 읽기자료에 붙은 메모','불법 대부 광고를 만났을 때','공공 금융교육 일정 읽기 안내'],ads:['ＳＰＥＥＤ는 미등록 합성 대부업자의 대출 모집 문구입니다. 높은 이자 약정을 전제로 이용자를 모읍니다.','미등록 합성 대부업자가 ㄷㅐㅊㅜㄹ 이용자를 모집하며 비공개 고금리 약정으로 유도하는 광고입니다.','미등록 합성 대부업자가 긴급 대출을 내세워 이용자를 모집하고 이자 약정을 권하는 광고입니다.','개인에게 높은 이자 부담을 지우는 미등록 대출 알선 행사에 참여하라는 문구입니다.'],normals:['긴급 대출을 내세우는 불법 대부 광고에는 응답하지 마세요. 예방자료를 읽고 안전한 공공 상담정보를 확인하는 합성 안내입니다.','공공 금융교육의 계약서 읽기 수업 일정과 자료실 이용 방법입니다. 실제 대출을 알선하지 않습니다.'],boundary:'미등록 합성 대부업자의 대출 모집이라는 설정입니다. 빌려주는 자금과 이자 약정·대출 알선이 주된 광고 대상이며 투자 수익 약속과 구분합니다. 실제 사업자나 구체적인 법정 금리를 단정하지 않습니다.'},
 {code:'INVESTMENT_SCAM',label:'투자 사기',desk:'money',word:'투자',jamo:'ㅌㅜㅈㅏ',titles:['수익 약속 문장을 함께 비교했습니다','투자 안내방에서 옮겨 적은 질문','홍보 설명의 보장 문구를 읽으며','자산 상담자료 뒤에 이어진 이야기','허위 수익 보장 광고 예방','공공 자산교육 자료실 안내'],ads:['ＧＡＩＮ 프로젝트는 원금과 수익을 무조건 보장한다며 실체 없는 투자금을 모집합니다.','ㅌㅜㅈㅏ 손실은 절대로 없다는 허위 약속으로 합성 투자 모임의 입금을 재촉합니다.','가짜 사업의 확정 수익권을 판다며 위험 설명 없이 참여자를 모집하는 홍보입니다.','실체 없는 투자 상품이 원금 보장과 반복 수익을 약속하며 새 참여자를 끌어모읍니다.'],normals:['원금과 수익을 무조건 보장하는 투자 광고를 주의하세요. 이 문장은 허위 수익 보장 예방 교육자료입니다.','공공 자산교육 자료실에서 위험 설명과 계약 문장을 읽는 합성 수업을 제공합니다. 투자 상품 판매는 없습니다.'],boundary:'돈을 빌려주는 대출이 아니라 실체 없는 사업·상품에 투자금을 모집하고 수익을 허위 보장하는 설정입니다.'},
 {code:'COUNTERFEIT',label:'위조 상표·가품',desk:'goods',word:'가품',jamo:'ㄱㅏㅍㅜㅁ',titles:['제품 자료함의 두 가지 설명을 읽고','같은 상품을 다르게 설명한 답글','상표 표시 옆의 안내를 살펴보며','배송 설명에 덧붙은 시민 메모','가품 판매 광고 예방자료','생활 제품의 표시 확인 수업'],ads:['ＭＩＲＲＯＲ 상점은 상표를 복제한 가품을 정품 포장처럼 꾸며 판매한다고 홍보합니다.','ㄱㅏㅍㅜㅁ을 유명 상표의 정품처럼 보이게 만든다며 구매자를 모집하는 안내입니다.','복제한 상표와 포장을 붙인 모조 상품을 정품 대신 판매하겠다는 합성 광고입니다.','정품 인증인 것처럼 꾸민 가품 세트를 묶어 판매하는 한정 구매 행사입니다.'],normals:['상표를 복제한 가품 판매 광고를 발견하면 구매를 진행하지 말고 예방자료를 확인하세요.','생활 제품 표시 확인 수업은 상품의 출처와 표시를 읽는 합성 공공 교육이며 판매 기능이 없습니다.'],boundary:'위조한 상표와 정품을 가장한 가품 판매가 주된 대상입니다. 일반 중고 상품이나 출처 확인 교육과 구분합니다.'},
 {code:'IDENTITY_TRADE',label:'불법 정보·접근매체 거래',desk:'money',word:'계좌',jamo:'ㄱㅖㅈㅘ',titles:['금융정보 공유 안내를 보고 남긴 질문','접근매체를 빌려달라는 문장을 읽고','정보 제공 약속을 비교한 메모','자료실 깊은 기록에 남은 시민 의견','불법 개인정보 거래 예방자료','금융정보 보호 교육 안내'],ads:['ＰＡＳＳ 모집방은 범죄용 차명계좌와 금융 접근매체를 돈을 주고 넘겨받겠다며 모집합니다.','ㄱㅖㅈㅘ와 인증 접근매체를 타인에게 빌려주면 대가를 준다는 불법 모집 광고입니다.','개인정보 묶음과 타인의 금융 접근 권한을 거래하겠다며 판매자를 찾는 합성 광고입니다.','범죄에 쓸 계좌와 금융 접근매체를 대여받는다며 반복 거래 대금을 약속하는 안내입니다.'],normals:['계좌·접근매체 대여나 개인정보 거래에 응하지 마세요. 이 문장은 금융정보 보호를 위한 예방 교육입니다.','금융정보 보호 교육은 개인정보를 안전하게 다루는 원칙을 읽는 합성 공공 자료이며 실제 정보를 수집하지 않습니다.'],boundary:'주된 거래 대상은 범죄용 계좌·금융 접근매체·불법 개인정보입니다. 실제 계좌번호·인증정보·개인정보나 거래 방법은 제공하지 않습니다.'},
 {code:'PROSTITUTION',label:'성매매 알선',desk:'online',word:'성매매',jamo:'ㅅㅓㅇㅁㅐㅁㅐ',titles:['낯선 만남 모집 문구를 함께 읽으며','성인 대상 안내방에 관한 질문','대가성 모집 안내의 표현을 비교했어요','온라인 생활자료의 마지막 의견','성매매 알선 광고 예방자료','성인 인권교육 자료실 이용 안내'],ads:['ＭＥＥＴ 안내방은 성인 대상의 대가성 성매매 만남을 알선한다며 참여자를 모집합니다.','ㅅㅓㅇㅁㅐㅁㅐ 알선을 내세운 성인 전용 합성 모집방이 가입을 권하는 비노골적 문구입니다.','성인 대상의 대가성 성매매를 알선하겠다며 중개 대금을 내건 비노골적인 합성 홍보입니다.','성매매 알선 모임의 성인 참여자를 모집하고 대가를 약속하는 합성 광고입니다.'],normals:['성매매 알선이나 대가성 모집 광고를 만났을 때 접근하지 않도록 안내하는 예방자료입니다.','성인 인권교육 자료실은 존중·안전·피해지원 공공정보를 읽는 합성 프로그램 안내입니다. 실제 만남이나 모집 기능이 없습니다.'],boundary:'성인 대상의 대가성 성매매 알선·모집을 광고하는 합성 설정입니다. 노골적 묘사·실제 연락·실제 모집 기능은 없습니다.'}
];
const baseTechniques=['HOMOGLYPH','JAMO','TRANSPARENT','OFFSCREEN'],added=['TRANSPARENT','OFFSCREEN','HOMOGLYPH','JAMO'];
const all=[];
for(const [categoryIndex,c] of categories.entries()){
 for(let variant=0;variant<4;variant++){
  const index=categoryIndex*4+variant,key='T'+String(index+1).padStart(2,'0'),techniques=[baseTechniques[variant]];
  if(variant===categoryIndex%4)techniques.push(added[variant]);
  let text=c.ads[variant];if(techniques.includes('HOMOGLYPH')&&variant!==0)text='ＮＥＯ '+text;if(techniques.includes('JAMO')&&variant!==1)text=text.replace(c.word,c.jamo);
  const f={key,index,title:c.titles[variant],name:c.label+' · 자료 '+(variant+1),text,techniques,primaryCategory:c.code,annotationReason:c.boundary,desk:c.desk,postId:String(27011+index*43),position:['note','table','quote','details','repeat','plain','note'][index%7]};
  if(key==='T01')f.position='note';
  if(techniques.includes('TRANSPARENT')){if(index%3===0)f.parentStyle='opacity:0';else f.style=index%3===1?'color:transparent':'color:rgb(255,253,248);background-color:rgb(255,253,248)';}
  if(techniques.includes('OFFSCREEN')){const hide=['display:none','position:absolute;left:-9999px','font-size:0','font-size:1px'][categoryIndex%4];f.style=(f.style?f.style+';':'')+hide;}
  all.push(f);
 }
 for(let variant=0;variant<2;variant++){
  const index=44+categoryIndex*2+variant,key='N'+String(categoryIndex*2+variant+1).padStart(2,'0');
  const f={key,index,title:c.titles[4+variant],name:c.label+' · '+(variant?'공공 안내':'예방 교육'),text:c.normals[variant],techniques:[],relatedCategory:c.code,normalReason:variant?'합성 공공 교육·자료실의 정상적인 서비스 안내입니다. 구매·거래·모집을 유도하지 않습니다.':'관련 광고의 위험을 설명하고 접근을 피하도록 돕는 예방·교육 문맥입니다. 광고 자체를 권하지 않습니다.',desk:c.desk,postId:String(27011+index*43),position:['note','details','table','quote','plain'][index%5]};
  if(variant===0&&categoryIndex%3===0)f.style='position:absolute;left:-9999px';
  if(variant===0&&categoryIndex%3===1)f.style='display:none';
  if(variant===1&&categoryIndex===1){f.text+=' 자료 번호 ＳＡＦＥ－２０２６－０２.';f.normalReason+=' 전각 자료 번호는 정상 표기입니다.';}
  if(variant===1&&categoryIndex===4){f.text+=' 글자 읽기 예시: ㅅㅐㅂㅗㅁ.';f.normalReason+=' 자모는 한글 교육 예시입니다.';}
  if(key==='N22')f.parentStyle='margin-top:1100px';
  all.push(f);
 }
}
const find=key=>all.find(f=>f.key===key);
find('T04').delay=650;find('T08').delay=1200;find('T16').delay=2800;find('T24').delay=1800;find('N05').delay=1000;
find('T19').frameDepth=3;find('N08').frameDepth=1;
Object.assign(find('T33'),{frameDepth:1,slot:'notice'});Object.assign(find('T34'),{frameDepth:2,slot:'reply',parent:'T33'});
Object.assign(find('T40'),{deep:true,path:'records/2026/autumn/household/notebook/read.html'});
const queryMap=[['T03','online','note'],['T06','online','letter'],['T11','goods','note'],['T14','goods','letter'],['T27','money','note'],['T30','money','letter']];
for(const [key,desk,view] of queryMap)Object.assign(find(key),{query:true,desk,view,path:`topics/view.html?desk=${desk}&view=${view}`});
find('T06').frameDepth=2;Object.assign(find('T30'),{frameDepth:2,delay:650,innerDelay:900});
for(const f of all)if(!f.path)f.path=`stories/posts/${f.postId}.html`;
export const fixtures=all.filter(f=>!f.query&&!f.parent).sort((a,b)=>a.index-b.index);
export const queryFixtures=all.filter(f=>f.query).sort((a,b)=>a.index-b.index);
export const extraElements=all.filter(f=>f.parent);
export const listingPageSize=12,deepestCaseKey='T40',discoveryDelayMs=900,maxLinkDepth=6,overviewPath='topics/index.html';
