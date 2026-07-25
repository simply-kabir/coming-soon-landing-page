import styles from "./ComingSoon.module.css";

export default function ComingSoon() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.block}>
        <div className={styles.line} />

        <h1 className={styles.name}>KABIR</h1>
        <p className={styles.role}>ML Engineer &amp; Developer</p>

        <div className={styles.divider} />

        <p className={styles.tagline}>Something is coming.</p>
        <p className={styles.sub}>
          A portfolio crafted with intention.
          <br />
          Arriving soon.
        </p>

        <div className={`${styles.line} ${styles.bottomLine}`} />
      </div>
    </div>
  );
}
