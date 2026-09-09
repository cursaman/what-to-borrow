"use client";

import { FormEvent, useState } from "react";

type Book = { title: string; author: string; genre: string; pages: number; reason: string; library: string; available: boolean; color: string };

const books: Book[] = [
  { title: "칵테일, 러브, 좀비", author: "조예은", genre: "한국소설", pages: 168, reason: "짧고 선명한 이야기가 필요한 저녁에", library: "부산시립시민도서관", available: true, color: "#ff6b51" },
  { title: "아주 희미한 빛으로도", author: "최은영", genre: "한국소설", pages: 352, reason: "조용히 오래 남는 문장을 읽고 싶을 때", library: "부산시립시민도서관", available: false, color: "#3867f4" },
  { title: "이처럼 사소한 것들", author: "클레어 키건", genre: "외국소설", pages: 132, reason: "한 호흡에 읽고 깊은 여운을 남기고 싶을 때", library: "명장도서관", available: true, color: "#7d4be2" },
  { title: "물고기는 존재하지 않는다", author: "룰루 밀러", genre: "과학·에세이", pages: 300, reason: "예상 못 한 지적 반전을 만나고 싶을 때", library: "부산시립시민도서관", available: true, color: "#0f9476" },
  { title: "어서 오세요, 휴남동 서점입니다", author: "황보름", genre: "한국소설", pages: 364, reason: "마음을 천천히 정돈하는 독서가 필요할 때", library: "안락누리도서관", available: true, color: "#e99d17" },
];

const moods = ["몰입하고 싶어", "마음이 복잡해", "기분 전환", "새로운 걸 알고 싶어"];

export default function BookFinder() {
  const [mood, setMood] = useState(moods[0]);
  const [minutes, setMinutes] = useState("60");
  const [result, setResult] = useState<Book[]>(books.slice(0, 3));
  const [searched, setSearched] = useState(false);

  function recommend(event: FormEvent) {
    event.preventDefault();
    const rotated = mood === moods[3] ? [books[3], books[2], books[0]] : mood === moods[1] ? [books[4], books[1], books[2]] : books.slice(0, 3);
    setResult(rotated.filter((book) => minutes === "30" ? book.pages < 200 : true));
    setSearched(true);
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="오늘 뭐 빌리지 홈"><span>오늘 뭐</span><strong>빌리지?</strong></a>
        <div className="location"><span aria-hidden="true">●</span> 부산 사직동</div>
      </header>

      <section className="workspace" id="top">
        <div className="intro">
          <p className="kicker">사직동에서 오늘 읽을 한 권</p>
          <h1>어떤 하루를<br />보내고 있나요?</h1>
          <p>기분과 남은 시간을 고르면, 가까운 도서관에서 빌릴 만한 책을 골라드려요.</p>
        </div>

        <form className="finder" onSubmit={recommend}>
          <fieldset>
            <legend><span>1</span> 지금 기분은?</legend>
            <div className="chips">{moods.map((item) => <button type="button" className={mood === item ? "chip active" : "chip"} onClick={() => setMood(item)} key={item}>{item}</button>)}</div>
          </fieldset>
          <fieldset>
            <legend><span>2</span> 얼마나 읽을까요?</legend>
            <div className="time-options">
              {[{v:"30", t:"잠깐", s:"30분 안쪽"},{v:"60",t:"한 시간",s:"차 한 잔과 함께"},{v:"long",t:"푹 빠져서",s:"시간 제한 없이"}].map((item) => (
                <label className={minutes === item.v ? "time active" : "time"} key={item.v}><input type="radio" name="minutes" value={item.v} checked={minutes === item.v} onChange={() => setMinutes(item.v)} /><strong>{item.t}</strong><small>{item.s}</small></label>
              ))}
            </div>
          </fieldset>
          <button className="submit" type="submit">오늘의 책 골라줘 <span aria-hidden="true">→</span></button>
          <p className="demo-note">현재는 사직동 도서관 기준 데모 데이터예요.</p>
        </form>
      </section>

      <section className="results" aria-live="polite">
        <div className="results-head"><div><p className="kicker">TODAY&apos;S PICKS</p><h2>{searched ? "다시 골라봤어요" : "오늘은 이 책 어때요?"}</h2></div><span>{result.length}권 추천</span></div>
        <div className="book-grid">{result.map((book, index) => (
          <article className="book" key={book.title}>
            <div className="cover" style={{background: book.color}}><span>{book.genre}</span><b>{book.title}</b><small>{book.author}</small><i>{String(index + 1).padStart(2, "0")}</i></div>
            <div className="book-info"><p>{book.reason}</p><div className="meta"><span>{book.pages}쪽</span><span>{book.genre}</span></div><div className="availability"><span className={book.available ? "dot on" : "dot"}></span><div><strong>{book.library}</strong><small>{book.available ? "대출 가능" : "현재 대출 중"}</small></div></div></div>
          </article>
        ))}</div>
      </section>

      <footer><strong>오늘 뭐 빌리지?</strong><p>도서관 가는 길이 조금 더 설레도록.</p><span>데이터 출처 · 도서관 정보나루</span></footer>
    </main>
  );
}
