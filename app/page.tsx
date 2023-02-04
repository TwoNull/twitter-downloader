"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  function handleSubmit(event: any) {
    event.preventDefault();
    try {
      const url = new URL(event.target.query.value);
      const tweetpath = url.pathname.split("/");
      const id = tweetpath[tweetpath.length - 1];
      if (!Number.isNaN(Number(id))) {
        router.push(`/media/${id}`);
      } else {
        throw "not tweet";
      }
    } catch {
      alert("URL is not a tweet.");
    }
  }

  if (typeof window != "undefined") {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  return (
    <div className={styles.content}>
      <p>Paste a Twitter video link below to download.</p>
      <form className={styles.linkinput} onSubmit={handleSubmit}>
        <input
          autoComplete="off"
          type="text"
          id="query"
          placeholder="https://twitter.com/Jxxyy/status/1564696341338521601"
        />
        <button type="submit">&#x21E8;</button>
      </form>
    </div>
  );
}
