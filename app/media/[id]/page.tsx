import styles from "./media.module.css";
import Links from "../../components/links";
import Link from "next/link";

function convertMillis(millis: number) {
  var minutes = Math.floor(millis / 60000);
  var seconds = Number(((millis % 60000) / 1000).toFixed(0));
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

async function scrapeLinks(id: string) {
  try {
    const res = await (
      await fetch(`${process.env.BASE_URL}/api/${id}`, {
        next: { revalidate: 60 },
      })
    ).json();
    const links = res.vars;
    if (!links.message) {
      let videos = [];
      for (const link in links) {
        if (links[link].content_type == "video/mp4") {
          videos.push(links[link]);
        }
      }
      return [videos, res.thumb, res.duration];
    }
    return links.message;
  } catch {
    return "error";
  }
}

export default async function Media({ params }: any) {
  const { id } = params;
  if (id) {
    const links = await scrapeLinks(id);
    if (typeof links != "string") {
      return (
        <div className={styles.content}>
          <div className={styles.display}>
            <img src={links[1]} className={styles.thumbnail} />
            <p>Duration: {convertMillis(links[2])}</p>
          </div>
          <Links links={links[0]} duration={links[2]} />
        </div>
      );
    }
  }

  if (typeof window != "undefined") {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  return (
    <div className={styles.content}>
      <p>No Video Found!</p>
      <Link href="/">
        <span>&#8678; Go Back</span>
      </Link>
    </div>
  );
}
