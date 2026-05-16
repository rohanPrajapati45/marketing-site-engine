import styles from "./Btn_slide.module.css";

function Btn_slide({ inside, ...props }) {
  return (
    <button className={styles.btn_slide} {...props}>
      {inside}
    </button>
  );
}

export default Btn_slide;
