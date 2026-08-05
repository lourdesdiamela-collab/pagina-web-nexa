'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function FAQAccordion({ faqs }) {
  const [active, setActive] = useState(null);

  return (
    <motion.div className="svc-faq-list" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
      {faqs.map((faq, index) => (
        <motion.div key={faq.q} variants={fadeUp} className="svc-faq-item">
          <motion.button
            onClick={() => setActive(active === index ? null : index)}
            className="svc-faq-trigger"
            whileHover={{ x: 2 }}
          >
            <span>{faq.q}</span>
            <motion.div animate={{ rotate: active === index ? 45 : 0 }} transition={{ duration: 0.25 }} className="svc-faq-icon">
              <Plus size={18} />
            </motion.div>
          </motion.button>
          <AnimatePresence initial={false}>
            {active === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div className="svc-faq-answer">
                  <p>{faq.a}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
}
