"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CtaFinal() {
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] mb-6">
            Sua identidade não pode esperar.
            <br />
            <span className="gradient-text">Comece agora.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Milhares de pessoas já estão construindo suas identidades baseadas em provas.
            Junte-se a elas gratuitamente.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-foreground text-background px-10 py-4 rounded-full text-sm font-semibold hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Criar sua identidade gratuitamente
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
