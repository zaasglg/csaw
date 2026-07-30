"use client"

import { Check } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"

export function FormSuccess({
  title,
  description,
  buttonLabel,
  onReset,
  iconBoxClassName,
  buttonClassName,
}: {
  title: string
  description: string
  buttonLabel: string
  onReset: () => void
  iconBoxClassName: string
  buttonClassName: string
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid min-h-[420px] place-items-center px-8 py-10 text-center"
    >
      <div>
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
          className={iconBoxClassName}
        >
          <Check className="size-6" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="text-3xl font-black tracking-[-0.04em] text-primary-900"
        >
          {title}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mx-auto mt-3 max-w-sm text-[16px] leading-[1.45] text-primary-600"
        >
          {description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <Button type="button" onClick={onReset} className={buttonClassName}>
            {buttonLabel}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
