import React from "react";
import styles from "./Btn_slide.module.css";

function Btn_slide({ inside }) {
  return <button className={styles.btn_slide}>{inside}</button>;
}

export default Btn_slide;
