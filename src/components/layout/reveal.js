import { motion, useReducedMotion } from "framer-motion";

// Reveal fades and lifts its children into place the first time they scroll into
// view. It uses framer-motion's whileInView, which watches the element with the
// browser's IntersectionObserver, so there is no scroll listener to maintain.
//
// Why it looks the way it does:
// - once: true. Each item animates one time. Items that keep hiding and
//   re-appearing while you scroll back up feel jumpy.
// - Only opacity and transform (y) are animated. Those are cheap for the browser
//   and do not move other elements around, so the layout never shifts.
// - index staggers neighbours by a small delay so a row of cards arrives as a
//   wave. It wraps every three items so cards far down the page do not wait.
// - Reduced motion: if the visitor asked their system for less motion, the
//   children are drawn right away with no animation.
// - Put Reveal around an element, not on one that already sets its own CSS
//   transform. Framer writes an inline transform, which would override a
//   :hover transform on the same element.
const Reveal = ({ children, index = 0, className, style }) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: (index % 3) * 0.08 }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
