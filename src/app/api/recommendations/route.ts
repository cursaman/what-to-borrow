import { NextRequest, NextResponse } from "next/server";

type NlBook={titleInfo?:string;authorInfo?:string;pubInfo?:string;pubYearInfo?:string;isbn?:string;kdcName1s?:string;detailLink?:string};
const keywords:Record<string,string>={focus:"추리 소설",calm:"마음 에세이",refresh:"유머 소설",learn:"과학 교양"};

export async function GET(request:NextRequest){
  const key=process.env.NL_API_KEY;
  if(!key)return NextResponse.json({error:"API 인증키가 설정되지 않았습니다."},{status:503});
  const keyword=keywords[request.nextUrl.searchParams.get("mood")??""]??keywords.focus;
  const params=new URLSearchParams({key,apiType:"json",srchTarget:"total",kwd:keyword,pageSize:"6",pageNum:"1",sort:"ipub_year",order:"desc"});
  try{
    const response=await fetch(`https://www.nl.go.kr/NL/search/openApi/search.do?${params}`,{next:{revalidate:3600}});
    if(!response.ok)throw new Error();
    const data=await response.json();
    const books=(Array.isArray(data?.result)?data.result:[]).map((book:NlBook)=>({title:stripHtml(book.titleInfo)||"제목 정보 없음",author:stripHtml(book.authorInfo)||"저자 정보 없음",publisher:stripHtml(book.pubInfo)||"발행처 정보 없음",year:book.pubYearInfo??"",isbn:book.isbn??"",category:book.kdcName1s??"",detailUrl:book.detailLink?`https://www.nl.go.kr${book.detailLink}`:""}));
    return NextResponse.json({books,total:data?.total??books.length,keyword,source:"국립중앙도서관"});
  }catch{return NextResponse.json({error:"도서 정보를 불러오지 못했습니다."},{status:502})}
}
function stripHtml(value?:string){return value?.replace(/<[^>]*>/g,"").replace(/&amp;/g,"&").trim()??""}
